const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// ============================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================

/**
 * Verify API key and return supermarket data
 */
async function authenticateAPIKey(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Missing or invalid Authorization header'
                }
            });
        }

        const apiKey = authHeader.substring(7); // Remove 'Bearer '

        // Find API key in database
        const keysRef = db.collection('api_keys');
        const querySnapshot = await keysRef.where('apiKey', '==', apiKey).get();

        if (querySnapshot.empty) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Invalid API key'
                }
            });
        }

        const keyDoc = querySnapshot.docs[0];
        const keyData = keyDoc.data();

        // Check if key is active
        if (keyData.status !== 'active') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'API key has been revoked'
                }
            });
        }

        // Check rate limiting (simple in-memory, use Redis for production)
        const rateLimitOk = await checkRateLimit(keyData.supermarketId, keyData.rateLimit);
        if (!rateLimitOk) {
            return res.status(429).json({
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many requests. Please retry later.',
                    retry_after: 60
                }
            });
        }

        // Update last used
        await keysRef.doc(keyDoc.id).update({
            lastUsed: admin.firestore.FieldValue.serverTimestamp(),
            totalRequests: admin.firestore.FieldValue.increment(1)
        });

        // Attach key data to request
        req.apiKey = keyData;
        req.apiKeyId = keyDoc.id;
        req.isDemo = keyData.environment === 'demo' || keyData.isDemo === true;

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Authentication failed'
            }
        });
    }
}

/**
 * Simple rate limiting (in production, use Redis)
 */
const rateLimitCache = new Map();
async function checkRateLimit(supermarketId, limits) {
    const now = Date.now();
    const key = `${supermarketId}_${Math.floor(now / 60000)}`; // Per minute

    const count = rateLimitCache.get(key) || 0;
    rateLimitCache.set(key, count + 1);

    // Clean old entries
    for (const [k, v] of rateLimitCache.entries()) {
        if (k.split('_')[1] < Math.floor(now / 60000) - 5) {
            rateLimitCache.delete(k);
        }
    }

    return count < (limits?.requests_per_minute || 60);
}

/**
 * Check permissions
 */
function requirePermission(permission) {
    return (req, res, next) => {
        if (!req.apiKey.permissions || !req.apiKey.permissions.includes(permission)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `Missing required permission: ${permission}`
                }
            });
        }
        next();
    };
}

/**
 * Log API usage
 */
async function logAPIUsage(req, res, next) {
    const startTime = Date.now();

    // Override res.json to capture response
    const originalJson = res.json.bind(res);
    res.json = function (data) {
        const duration = Date.now() - startTime;

        // Log usage (fire and forget)
        db.collection('api_usage_logs').add({
            supermarketId: req.apiKey?.supermarketId,
            endpoint: req.path,
            method: req.method,
            status: res.statusCode,
            duration: duration,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            isDemo: req.isDemo || false
        }).catch(err => console.error('Logging error:', err));

        return originalJson(data);
    };

    next();
}

// Apply logging to all routes
app.use(logAPIUsage);

// ============================================================
// API ENDPOINTS
// ============================================================

/**
 * Health Check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

/**
 * Get Products
 */
app.get('/products', authenticateAPIKey, requirePermission('products:read'), async (req, res) => {
    try {
        const { category, limit = 50, offset = 0, search } = req.query;
        const parsedLimit = Math.min(parseInt(limit) || 50, 100);
        const parsedOffset = parseInt(offset) || 0;

        let query = db.collection('products')
            .where('active', '==', true);

        // Filter by demo mode
        if (req.isDemo) {
            query = query.where('isDemo', '==', true);
        } else {
            query = query.where('isDemo', '!=', true);
        }

        // Filter by category
        if (category) {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        let products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Search filter (in-memory, not scalable for large datasets)
        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p =>
                p.name?.toLowerCase().includes(searchLower) ||
                p.category?.toLowerCase().includes(searchLower) ||
                p.brand?.toLowerCase().includes(searchLower)
            );
        }

        // Pagination
        const total = products.length;
        const paginatedProducts = products.slice(parsedOffset, parsedOffset + parsedLimit);

        res.json({
            success: true,
            data: {
                products: paginatedProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    brand: p.brand,
                    barcode: p.barcode,
                    unit_size: p.unitSize,
                    image: p.image,
                    attributes: p.attributes || {}
                })),
                pagination: {
                    total: total,
                    limit: parsedLimit,
                    offset: parsedOffset,
                    has_more: parsedOffset + parsedLimit < total
                }
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to fetch products'
            }
        });
    }
});

/**
 * Get Single Product
 */
app.get('/products/:id', authenticateAPIKey, requirePermission('products:read'), async (req, res) => {
    try {
        const { id } = req.params;

        const productDoc = await db.collection('products').doc(id).get();

        if (!productDoc.exists) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Product not found'
                }
            });
        }

        const product = productDoc.data();

        // Check demo mode
        if (req.isDemo && product.isDemo !== true) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Product not found'
                }
            });
        } else if (!req.isDemo && product.isDemo === true) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Product not found'
                }
            });
        }

        // Get prices
        const pricesDoc = await db.collection('prices').doc(id).get();
        const currentPrices = pricesDoc.exists ? pricesDoc.data().prices : {};

        // Calculate price range
        const priceValues = Object.values(currentPrices).map(p => p.price || 0).filter(p => p > 0);
        const priceRange = priceValues.length > 0 ? {
            min: Math.min(...priceValues),
            max: Math.max(...priceValues),
            average: priceValues.reduce((a, b) => a + b, 0) / priceValues.length
        } : null;

        res.json({
            success: true,
            data: {
                id: productDoc.id,
                name: product.name,
                category: product.category,
                brand: product.brand,
                barcode: product.barcode,
                current_prices: currentPrices,
                price_range: priceRange
            }
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to fetch product'
            }
        });
    }
});

/**
 * Update Single Price
 */
app.post('/prices/single', authenticateAPIKey, requirePermission('prices:write'), async (req, res) => {
    try {
        const { product_id, price, currency = 'KES', location, stock_status = 'in_stock', metadata } = req.body;

        // Validation
        if (!product_id || !price) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_REQUEST',
                    message: 'product_id and price are required'
                }
            });
        }

        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_REQUEST',
                    message: 'Price must be a positive number',
                    field: 'price'
                }
            });
        }

        // Check product exists
        const productDoc = await db.collection('products').doc(product_id).get();
        if (!productDoc.exists) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Product not found'
                }
            });
        }

        const supermarketId = req.apiKey.supermarketId;
        const pricesRef = db.collection('prices').doc(product_id);
        const priceDoc = await pricesRef.get();

        const previousPrice = priceDoc.exists ? priceDoc.data().prices?.[supermarketId]?.price : null;

        // Update price
        const priceUpdate = {
            [`prices.${supermarketId}`]: {
                price: price,
                location: location || '',
                stock_status: stock_status,
                metadata: metadata || {},
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            },
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        };

        if (!priceDoc.exists) {
            priceUpdate.isDemo = req.isDemo;
        }

        await pricesRef.set(priceUpdate, { merge: true });

        // Calculate price change
        const priceChange = previousPrice ? ((price - previousPrice) / previousPrice * 100) : 0;

        res.json({
            success: true,
            data: {
                product_id: product_id,
                price: price,
                previous_price: previousPrice,
                updated_at: new Date().toISOString(),
                price_change_percentage: parseFloat(priceChange.toFixed(2))
            }
        });
    } catch (error) {
        console.error('Error updating price:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to update price'
            }
        });
    }
});

/**
 * Batch Update Prices
 */
app.post('/prices/batch', authenticateAPIKey, requirePermission('prices:write'), async (req, res) => {
    try {
        const { prices } = req.body;

        if (!Array.isArray(prices) || prices.length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_REQUEST',
                    message: 'prices must be a non-empty array'
                }
            });
        }

        if (prices.length > 100) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_REQUEST',
                    message: 'Maximum 100 prices per batch'
                }
            });
        }

        const results = [];
        let successful = 0;
        let failed = 0;

        const supermarketId = req.apiKey.supermarketId;

        for (const item of prices) {
            try {
                const { product_id, price, location, stock_status = 'in_stock', metadata } = item;

                // Validation
                if (!product_id || !price) {
                    results.push({
                        product_id: product_id || 'unknown',
                        status: 'failed',
                        error: 'Missing product_id or price'
                    });
                    failed++;
                    continue;
                }

                if (typeof price !== 'number' || price < 0) {
                    results.push({
                        product_id: product_id,
                        status: 'failed',
                        error: 'Invalid price'
                    });
                    failed++;
                    continue;
                }

                // Check product exists
                const productDoc = await db.collection('products').doc(product_id).get();
                if (!productDoc.exists) {
                    results.push({
                        product_id: product_id,
                        status: 'failed',
                        error: 'Product not found'
                    });
                    failed++;
                    continue;
                }

                // Update price
                const pricesRef = db.collection('prices').doc(product_id);
                const priceUpdate = {
                    [`prices.${supermarketId}`]: {
                        price: price,
                        location: location || '',
                        stock_status: stock_status,
                        metadata: metadata || {},
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    },
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                    isDemo: req.isDemo
                };

                await pricesRef.set(priceUpdate, { merge: true });

                results.push({
                    product_id: product_id,
                    status: 'updated',
                    price: price
                });
                successful++;
            } catch (error) {
                console.error(`Error updating price for ${item.product_id}:`, error);
                results.push({
                    product_id: item.product_id,
                    status: 'failed',
                    error: 'Internal error'
                });
                failed++;
            }
        }

        res.json({
            success: true,
            data: {
                processed: prices.length,
                successful: successful,
                failed: failed,
                results: results
            }
        });
    } catch (error) {
        console.error('Error in batch update:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to process batch update'
            }
        });
    }
});

/**
 * Product Sync (for supermarkets to add their products)
 */
app.post('/products/sync', authenticateAPIKey, requirePermission('products:write'), async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'INVALID_REQUEST',
                    message: 'products must be a non-empty array'
                }
            });
        }

        const results = {
            created: 0,
            updated: 0,
            skipped: 0,
            mappings: []
        };

        for (const product of products) {
            try {
                const { external_id, name, category, barcode, brand, unit_size, image_url, attributes } = product;

                if (!name || !category) {
                    results.skipped++;
                    continue;
                }

                // Search for existing product by barcode or name
                let existingProduct = null;

                if (barcode) {
                    const barcodeQuery = await db.collection('products')
                        .where('barcode', '==', barcode)
                        .where('isDemo', '==', req.isDemo)
                        .limit(1)
                        .get();

                    if (!barcodeQuery.empty) {
                        existingProduct = { id: barcodeQuery.docs[0].id, ...barcodeQuery.docs[0].data() };
                    }
                }

                if (existingProduct) {
                    // Update existing
                    await db.collection('products').doc(existingProduct.id).update({
                        name: name,
                        category: category,
                        brand: brand || existingProduct.brand,
                        unitSize: unit_size || existingProduct.unitSize,
                        image: image_url || existingProduct.image,
                        attributes: attributes || existingProduct.attributes,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    results.updated++;
                    results.mappings.push({
                        external_id: external_id,
                        tracker_id: existingProduct.id,
                        action: 'updated'
                    });
                } else {
                    // Create new
                    const newProduct = {
                        name: name,
                        category: category,
                        brand: brand || '',
                        barcode: barcode || '',
                        unitSize: unit_size || '',
                        image: image_url || '',
                        attributes: attributes || {},
                        active: true,
                        isDemo: req.isDemo,
                        viewCount: 0,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    };

                    const docRef = await db.collection('products').add(newProduct);

                    results.created++;
                    results.mappings.push({
                        external_id: external_id,
                        tracker_id: docRef.id,
                        action: 'created'
                    });
                }
            } catch (error) {
                console.error('Error syncing product:', error);
                results.skipped++;
            }
        }

        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error in product sync:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'SERVER_ERROR',
                message: 'Failed to sync products'
            }
        });
    }
});

// ============================================================
// EXPORT CLOUD FUNCTION
// ============================================================

exports.api = functions.https.onRequest(app);
