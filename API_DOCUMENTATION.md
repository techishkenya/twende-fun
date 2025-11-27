# Tracker KE - Supermarket API Documentation

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Base URL**: `https://us-central1-twende-a3958.cloudfunctions.net/api/v1`

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Rate Limits](#rate-limits)
4. [Endpoints](#endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Code Examples](#code-examples)
8. [Webhooks](#webhooks)
9. [Testing & Sandbox](#testing--sandbox)
10. [Support](#support)

---

## 🎯 Introduction

Welcome to the Tracker KE Supermarket API! This API allows supermarkets to programmatically update product prices, sync inventory, and manage product catalogs in real-time.

### Key Features

- ✅ Real-time price updates
- ✅ Batch operations (up to 100 items)
- ✅ Demo/Sandbox environment
- ✅ Comprehensive error reporting
- ✅ Webhook notifications
- ✅ RESTful design

### Getting Started

1. Contact admin to receive your API credentials
2. Test in **Demo Mode** (sandbox environment)
3. Switch to **Live Mode** when ready
4. Start sending price updates!

---

## 🔐 Authentication

All API requests require authentication using **API Keys**.

### API Key Structure

You will receive:
- **API Key**: `pk_live_{supermarket}_{random}` (for identification)
- **API Secret**: `sk_secret_{random}` (for signing requests)

### Authentication Methods

#### Method 1: Bearer Token (Recommended)

```http
Authorization: Bearer YOUR_API_KEY
X-API-Secret: YOUR_API_SECRET
```

#### Method 2: Request Signing (High Security)

For sensitive operations, sign your requests using HMAC-SHA256:

```javascript
const crypto = require('crypto');

function signRequest(method, path, body, secret) {
  const timestamp = Date.now();
  const payload = `${method}:${path}:${timestamp}:${JSON.stringify(body)}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return {
    'X-Timestamp': timestamp,
    'X-Signature': signature
  };
}
```

### Permission Scopes

| Scope | Description |
|-------|-------------|
| `prices:read` | Read price data |
| `prices:write` | Update prices |
| `products:read` | Read product catalog |
| `products:write` | Create/update products |
| `analytics:read` | Access usage analytics |

---

## ⚡ Rate Limits

| Plan | Requests/Minute | Requests/Hour | Batch Size |
|------|----------------|---------------|------------|
| **Free (Demo)** | 10 | 100 | 10 |
| **Standard** | 60 | 1,000 | 100 |
| **Premium** | 300 | 10,000 | 500 |
| **Enterprise** | Custom | Custom | Custom |

### Rate Limit Headers

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1732745100
```

### Exceeding Rate Limits

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please retry after 60 seconds.",
    "retry_after": 60
  }
}
```

---

## 📡 Endpoints

### 1. Health Check

Check API availability.

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-28T00:45:38+03:00"
}
```

---

### 2. Get Products

Retrieve the product catalog.

```http
GET /products
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | string | No | Filter by category |
| `limit` | integer | No | Max items (default: 50, max: 100) |
| `offset` | integer | No | Pagination offset |
| `search` | string | No | Search product names |

**Example Request:**

```bash
curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/products?category=Beverages&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123456",
        "name": "Coca Cola 500ml",
        "category": "Beverages",
        "brand": "Coca Cola",
        "barcode": "5449000000996",
        "unit_size": "500ml",
        "image": "https://example.com/coke.jpg",
        "attributes": {
          "pack_size": 1,
          "returnable_bottle": false
        }
      }
    ],
    "pagination": {
      "total": 1250,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

---

### 3. Get Single Product

Get details for a specific product.

```http
GET /products/{product_id}
```

**Example Request:**

```bash
curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/products/prod_123456" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "prod_123456",
    "name": "Coca Cola 500ml",
    "category": "Beverages",
    "current_prices": {
      "carrefour": {
        "price": 60,
        "currency": "KES",
        "location": "Westlands",
        "updated_at": "2025-11-28T00:30:00+03:00"
      },
      "naivas": {
        "price": 55,
        "currency": "KES",
        "location": "CBD",
        "updated_at": "2025-11-28T00:25:00+03:00"
      }
    },
    "price_range": {
      "min": 55,
      "max": 65,
      "average": 58.5
    }
  }
}
```

---

### 4. Update Single Price

Update price for a single product.

```http
POST /prices/single
```

**Request Body:**

```json
{
  "product_id": "prod_123456",
  "price": 60.00,
  "currency": "KES",
  "location": "Westlands Branch",
  "stock_status": "in_stock",
  "metadata": {
    "promotion": false,
    "discount_percentage": 0,
    "unit_size": "500ml"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "product_id": "prod_123456",
    "price": 60.00,
    "previous_price": 55.00,
    "updated_at": "2025-11-28T00:45:38+03:00",
    "price_change_percentage": 9.09
  }
}
```

---

### 5. Batch Update Prices

Update multiple prices in one request (up to 100 items).

```http
POST /prices/batch
```

**Request Body:**

```json
{
  "prices": [
    {
      "product_id": "prod_123456",
      "price": 60.00,
      "currency": "KES",
      "location": "Westlands Branch",
      "stock_status": "in_stock"
    },
    {
      "product_id": "prod_789012",
      "price": 120.00,
      "currency": "KES",
      "location": "Westlands Branch",
      "stock_status": "limited_stock"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "processed": 2,
    "successful": 2,
    "failed": 0,
    "results": [
      {
        "product_id": "prod_123456",
        "status": "updated",
        "price": 60.00
      },
      {
        "product_id": "prod_789012",
        "status": "updated",
        "price": 120.00
      }
    ]
  }
}
```

**Partial Success Example:**

```json
{
  "success": true,
  "data": {
    "processed": 3,
    "successful": 2,
    "failed": 1,
    "results": [
      {
        "product_id": "prod_123456",
        "status": "updated",
        "price": 60.00
      },
      {
        "product_id": "prod_INVALID",
        "status": "failed",
        "error": "Product not found"
      },
      {
        "product_id": "prod_789012",
        "status": "updated",
        "price": 120.00
      }
    ]
  }
}
```

---

### 6. Sync Product Catalog

Sync your product catalog with Tracker KE.

```http
POST /products/sync
```

**Request Body:**

```json
{
  "products": [
    {
      "external_id": "YOUR_SKU_123",
      "name": "Coca Cola 500ml",
      "category": "Beverages",
      "barcode": "5449000000996",
      "brand": "Coca Cola",
      "unit_size": "500ml",
      "image_url": "https://yourcdn.com/coke.jpg",
      "attributes": {
        "pack_size": 1,
        "volume": "500ml"
      }
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "created": 5,
    "updated": 10,
    "skipped": 2,
    "mappings": [
      {
        "external_id": "YOUR_SKU_123",
        "tracker_id": "prod_123456",
        "action": "created"
      }
    ]
  }
}
```

---

## 📊 Data Models

### Product Object

```typescript
interface Product {
  id: string;                    // Tracker KE product ID
  name: string;                  // Product name
  category: string;              // Category name
  brand?: string;                // Brand name
  barcode?: string;              // EAN/UPC barcode
  unit_size?: string;            // e.g., "500ml", "1kg"
  image?: string;                // Image URL
  attributes?: Record<string, any>; // Custom attributes
  created_at: string;            // ISO 8601 timestamp
  updated_at: string;            // ISO 8601 timestamp
}
```

### Price Object

```typescript
interface Price {
  product_id: string;            // Product reference
  price: number;                 // Price amount
  currency: string;              // Currency code (KES)
  location?: string;             // Branch/location name
  stock_status?: StockStatus;    // Stock availability
  metadata?: PriceMetadata;      // Additional info
}

type StockStatus = 'in_stock' | 'out_of_stock' | 'limited_stock';

interface PriceMetadata {
  promotion?: boolean;
  discount_percentage?: number;
  unit_size?: string;
  special_offer?: string;
}
```

---

## ❌ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Price must be a positive number",
    "field": "price",
    "details": {
      "received": -10,
      "expected": "number > 0"
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_REQUEST` | 400 | Validation error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Temporary outage |

---

## 💻 Code Examples

### Python

```python
import requests
import hmac
import hashlib
import time
import json

class TrackerKEClient:
    def __init__(self, api_key, api_secret, base_url=None):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = base_url or 'https://us-central1-twende-a3958.cloudfunctions.net/api/v1'
    
    def _get_headers(self, method, path, body=None):
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        
        # Optional: Add request signing for extra security
        if self.api_secret:
            timestamp = str(int(time.time()))
            payload = f"{method}:{path}:{timestamp}:{json.dumps(body or {})}"
            signature = hmac.new(
                self.api_secret.encode(),
                payload.encode(),
                hashlib.sha256
            ).hexdigest()
            
            headers.update({
                'X-Timestamp': timestamp,
                'X-Signature': signature
            })
        
        return headers
    
    def update_price(self, product_id, price, location=None, stock_status='in_stock'):
        """Update a single product price"""
        path = '/prices/single'
        body = {
            'product_id': product_id,
            'price': price,
            'currency': 'KES',
            'location': location,
            'stock_status': stock_status
        }
        
        response = requests.post(
            f'{self.base_url}{path}',
            headers=self._get_headers('POST', path, body),
            json=body
        )
        
        return response.json()
    
    def batch_update_prices(self, prices):
        """Update multiple prices at once"""
        path = '/prices/batch'
        body = {'prices': prices}
        
        response = requests.post(
            f'{self.base_url}{path}',
            headers=self._get_headers('POST', path, body),
            json=body
        )
        
        return response.json()
    
    def get_products(self, category=None, limit=50):
        """Fetch products"""
        path = '/products'
        params = {'limit': limit}
        if category:
            params['category'] = category
        
        response = requests.get(
            f'{self.base_url}{path}',
            headers=self._get_headers('GET', path),
            params=params
        )
        
        return response.json()

# Usage Example
client = TrackerKEClient(
    api_key='pk_live_carrefour_xyz123',
    api_secret='sk_secret_xyz456'
)

# Update single price
result = client.update_price(
    product_id='prod_123456',
    price=60.00,
    location='Westlands Branch',
    stock_status='in_stock'
)
print(result)

# Batch update
prices = [
    {'product_id': 'prod_123', 'price': 50.00, 'stock_status': 'in_stock'},
    {'product_id': 'prod_456', 'price': 75.00, 'stock_status': 'limited_stock'}
]
result = client.batch_update_prices(prices)
print(result)
```

### Node.js

```javascript
const axios = require('axios');
const crypto = require('crypto');

class TrackerKEClient {
  constructor(apiKey, apiSecret, baseUrl) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.baseUrl = baseUrl || 'https://us-central1-twende-a3958.cloudfunctions.net/api/v1';
  }

  _getHeaders(method, path, body = null) {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    // Optional: Add request signing
    if (this.apiSecret) {
      const timestamp = Date.now().toString();
      const payload = `${method}:${path}:${timestamp}:${JSON.stringify(body || {})}`;
      const signature = crypto
        .createHmac('sha256', this.apiSecret)
        .update(payload)
        .digest('hex');

      headers['X-Timestamp'] = timestamp;
      headers['X-Signature'] = signature;
    }

    return headers;
  }

  async updatePrice(productId, price, options = {}) {
    const path = '/prices/single';
    const body = {
      product_id: productId,
      price: price,
      currency: 'KES',
      location: options.location,
      stock_status: options.stock_status || 'in_stock',
      metadata: options.metadata
    };

    const response = await axios.post(
      `${this.baseUrl}${path}`,
      body,
      { headers: this._getHeaders('POST', path, body) }
    );

    return response.data;
  }

  async batchUpdatePrices(prices) {
    const path = '/prices/batch';
    const body = { prices };

    const response = await axios.post(
      `${this.baseUrl}${path}`,
      body,
      { headers: this._getHeaders('POST', path, body) }
    );

    return response.data;
  }

  async getProducts(options = {}) {
    const path = '/products';
    const params = {
      category: options.category,
      limit: options.limit || 50,
      offset: options.offset || 0
    };

    const response = await axios.get(
      `${this.baseUrl}${path}`,
      {
        headers: this._getHeaders('GET', path),
        params
      }
    );

    return response.data;
  }
}

// Usage Example
const client = new TrackerKEClient(
  'pk_live_carrefour_xyz123',
  'sk_secret_xyz456'
);

// Update single price
client.updatePrice('prod_123456', 60.00, {
  location: 'Westlands Branch',
  stock_status: 'in_stock'
})
  .then(result => console.log(result))
  .catch(error => console.error(error));

// Batch update
const prices = [
  { product_id: 'prod_123', price: 50.00, stock_status: 'in_stock' },
  { product_id: 'prod_456', price: 75.00, stock_status: 'limited_stock' }
];

client.batchUpdatePrices(prices)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### cURL

```bash
# Update single price
curl -X POST "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/prices/single" \
  -H "Authorization: Bearer pk_live_carrefour_xyz123" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_123456",
    "price": 60.00,
    "currency": "KES",
    "location": "Westlands Branch",
    "stock_status": "in_stock"
  }'

# Batch update prices
curl -X POST "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/prices/batch" \
  -H "Authorization: Bearer pk_live_carrefour_xyz123" \
  -H "Content-Type: application/json" \
  -d '{
    "prices": [
      {
        "product_id": "prod_123456",
        "price": 60.00,
        "currency": "KES",
        "location": "Westlands Branch",
        "stock_status": "in_stock"
      },
      {
        "product_id": "prod_789012",
        "price": 120.00,
        "currency": "KES",
        "location": "Westlands Branch",
        "stock_status": "in_stock"
      }
    ]
  }'

# Get products
curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/products?category=Beverages&limit=20" \
  -H "Authorization: Bearer pk_live_carrefour_xyz123"
```

---

## 🔔 Webhooks

Get real-time notifications when events occur.

### Configuring Webhooks

Set your webhook URL in the admin dashboard. We'll send POST requests to your endpoint when:

- Price updates are processed
- Products are added/updated
- Errors occur

### Webhook Payload

```json
{
  "event": "price.updated",
  "timestamp": "2025-11-28T00:45:38+03:00",
  "data": {
    "product_id": "prod_123456",
    "supermarket_id": "carrefour",
    "price": 60.00,
    "previous_price": 55.00,
    "change_percentage": 9.09
  }
}
```

### Webhook Security

Verify webhook authenticity using the signature:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === expectedSignature;
}
```

---

## 🧪 Testing & Sandbox

### Demo Mode

Test your integration without affecting live data:

**Demo Base URL**: Same endpoint, use demo API keys
```
Demo API Key: pk_demo_carrefour_xyz123
Demo Secret: sk_demo_xyz456
```

Demo mode features:
- ✅ All API endpoints available
- ✅ Isolated data (won't show on live site)
- ✅ Same rate limits
- ✅ Free forever

### Testing Checklist

- [ ] Authenticate successfully
- [ ] Fetch product catalog
- [ ] Update single price
- [ ] Batch update prices (10+ items)
- [ ] Handle validation errors
- [ ] Handle rate limiting
- [ ] Verify webhooks

---

## 🆘 Support

### Resources

- **Developer Portal**: https://tracker.ke/developers
- **Status Page**: https://status.tracker.ke
- **Email**: api-support@tracker.ke
- **Response Time**: Within 24 hours

### Common Issues

**Q: Getting 401 Unauthorized**
- Verify your API key is correct
- Check you're using the right environment (demo vs live)
- Ensure Authorization header is set

**Q: Rate limit exceeded**
- Reduce request frequency
- Use batch endpoints for bulk updates
- Contact us for higher limits

**Q: Product not found**
- Use `/products` to get valid product IDs
- Check product exists in our catalog
- Sync your catalog first using `/products/sync`

---

## 📝 Changelog

### Version 1.0.0 (November 2025)
- Initial release
- Product catalog API
- Price update endpoints (single & batch)
- Webhook support
- Demo/Sandbox environment

---

**Happy Integrating! 🚀**

For questions or feedback, reach out to our API team at api-support@tracker.ke
