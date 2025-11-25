import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, Search, X, Save, TrendingUp, ArrowLeft, Grid3x3, Package, Star, Eye, ArrowUpDown } from 'lucide-react';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../../lib/types';
import { getCheapestPrice, getSupermarketColor, useSupermarkets } from '../../hooks/useFirestore';
import { getSupermarketInitials } from '../../lib/stringUtils';

export default function ProductsManagement() {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [prices, setPrices] = useState({});
    const [categories, setCategories] = useState([]);

    // Loading states
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState('popular'); // popular, newest, oldest
    const [filterType, setFilterType] = useState('all'); // all, manual, auto
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingPrices, setEditingPrices] = useState({});
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);

    // Fetch supermarkets dynamically
    const { supermarkets, loading: supermarketsLoading } = useSupermarkets();

    // Handle navigation state for Quick Actions
    useEffect(() => {
        if (location.state?.openAddModal) {
            setShowAddProduct(true);
            // Clear state to prevent reopening on refresh (optional, but good practice)
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Initial fetch for categories
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products when category is selected or initially (if we want to show counts)
    useEffect(() => {
        fetchProductsAndPrices();
    }, []);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const categoriesSnapshot = await getDocs(collection(db, 'categories'));

            if (categoriesSnapshot.empty) {
                // Fallback for display only, don't write to DB here to avoid race conditions
                const defaultCats = DEFAULT_CATEGORIES.map(cat => ({
                    id: cat.toLowerCase().replace(/\s+/g, '-'),
                    name: cat,
                    productCount: 0
                }));
                setCategories(defaultCats);
            } else {
                const catsList = categoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategories(catsList);
            }
        } catch (error) {
            // console.error('Error fetching categories:', error);
            // Fallback on error
            setCategories(DEFAULT_CATEGORIES.map(cat => ({ name: cat, productCount: 0 })));
        } finally {
            setCategoriesLoading(false);
        }
    };

    const fetchProductsAndPrices = async () => {
        try {
            setProductsLoading(true);

            // Parallel fetch
            const [productsSnapshot, pricesSnapshot] = await Promise.all([
                getDocs(collection(db, 'products')),
                getDocs(collection(db, 'prices'))
            ]);

            const productsList = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);

            const pricesMap = {};
            pricesSnapshot.docs.forEach(doc => {
                pricesMap[doc.id] = doc.data().prices;
            });
            setPrices(pricesMap);

        } catch (error) {
            // console.error('Error fetching products/prices:', error);
        } finally {
            setProductsLoading(false);
        }
    };

    const getCategoryProductCount = (categoryName) => {
        return products.filter(p => p.category === categoryName).length;
    };

    // Filter products by category and search
    const baseFiltered = useMemo(() => {
        return selectedCategory
            ? products.filter(product =>
                product.category === selectedCategory &&
                (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category?.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            : [];
    }, [selectedCategory, products, searchTerm]);

    // Sort products based on sortBy
    const sortedProducts = useMemo(() => {
        return [...baseFiltered].sort((a, b) => {
            switch (sortBy) {
                case 'popular':
                    return (b.viewCount || 0) - (a.viewCount || 0);
                case 'newest':
                    return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
                case 'oldest':
                    return (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0);
                default:
                    return 0;
            }
        });
    }, [baseFiltered, sortBy]);

    // Get top 10 by views for auto-trending badge
    const top10ByViews = useMemo(() => {
        return [...baseFiltered]
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 10)
            .map(p => p.id);
    }, [baseFiltered]);

    // Apply Filter Type
    const filteredProducts = useMemo(() => {
        return sortedProducts.filter(product => {
            if (filterType === 'all') return true;
            if (filterType === 'manual') return product.isTrending;
            if (filterType === 'auto') return top10ByViews.includes(product.id);
            return true;
        });
    }, [sortedProducts, filterType, top10ByViews]);

    const handleAddCategory = async (categoryName) => {
        try {
            const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');

            // Try to persist defaults if needed, but don't block new category
            try {
                const categoriesRef = collection(db, 'categories');
                const snapshot = await getDocs(categoriesRef);

                if (snapshot.empty && categories.length > 0) {
                    for (const cat of categories) {
                        if (cat.id !== categoryId) {
                            await setDoc(doc(db, 'categories', cat.id), {
                                name: cat.name,
                                productCount: 0,
                                createdAt: new Date()
                            });
                        }
                    }
                }
            } catch (persistError) {
                console.error('Error persisting defaults:', persistError);
            }

            await setDoc(doc(db, 'categories', categoryId), {
                name: categoryName,
                productCount: 0,
                createdAt: new Date()
            });

            if (!categories.some(c => c.id === categoryId)) {
                setCategories([...categories, { id: categoryId, name: categoryName, productCount: 0 }]);
            }
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category');
        } finally {
            setShowAddCategory(false);
        }
    };

    const handleDeleteCategory = async (categoryId, categoryName) => {
        const productsInCategory = products.filter(p => p.category === categoryName);
        if (productsInCategory.length > 0) {
            alert(`Cannot delete category with ${productsInCategory.length} products. Please delete or move the products first.`);
            return;
        }

        if (confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
            try {
                await deleteDoc(doc(db, 'categories', categoryId));
                setCategories(categories.filter(c => c.id !== categoryId));
            } catch (error) {
                // console.error('Error deleting category:', error);
                alert('Failed to delete category');
            }
        }
    };

    const handleAddProduct = async (productData) => {
        try {
            // Generate product ID
            const productId = `${productData.category.toLowerCase().substring(0, 2)}-${Date.now()}`;

            // Add product
            await setDoc(doc(db, 'products', productId), {
                ...productData,
                active: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                updatedBy: currentUser.uid,
                updatedByEmail: currentUser.email
            });

            // Initialize prices for all supermarkets (dynamic)
            const initialPrices = {};
            supermarkets.forEach(supermarket => {
                initialPrices[supermarket.id] = {
                    price: 0,
                    location: '',
                    updatedAt: new Date()
                };
            });

            await setDoc(doc(db, 'prices', productId), {
                productId,
                prices: initialPrices,
                lastUpdated: new Date(),
                verified: true
            });

            setProducts([...products, { id: productId, ...productData }]);
            setPrices({ ...prices, [productId]: initialPrices });
            setShowAddProduct(false);
        } catch (error) {
            // console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (confirm('Are you sure you want to delete this product and all its prices?')) {
            try {
                await deleteDoc(doc(db, 'products', productId));
                await deleteDoc(doc(db, 'prices', productId));
                setProducts(products.filter(p => p.id !== productId));
                const newPrices = { ...prices };
                delete newPrices[productId];
                setPrices(newPrices);
            } catch (error) {
                // console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const handleUpdateProduct = async (productId, updatedData) => {
        try {
            await updateDoc(doc(db, 'products', productId), {
                ...updatedData,
                updatedAt: new Date(),
                updatedBy: currentUser.uid,
                updatedByEmail: currentUser.email
            });
            setProducts(products.map(p => p.id === productId ? { ...p, ...updatedData } : p));
            setEditingProduct(null);
        } catch (error) {
            // console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    const handleUpdatePrices = async (productId, newPrices) => {
        try {
            const productRef = doc(db, 'products', productId);
            const priceUpdates = {};

            // Calculate new average price
            let total = 0;
            let count = 0;

            Object.entries(newPrices).forEach(([supermarketId, data]) => {
                if (data.price > 0) {
                    priceUpdates[`prices.${supermarketId}`] = {
                        price: Number(data.price),
                        location: data.location || '',
                        updatedAt: new Date()
                    };
                    total += Number(data.price);
                    count++;
                }
            });

            if (count > 0) {
                priceUpdates.averagePrice = Math.round(total / count);
            }

            // Add audit fields
            priceUpdates.updatedAt = new Date();
            priceUpdates.updatedBy = currentUser.uid;
            priceUpdates.updatedByEmail = currentUser.email;

            await updateDoc(productRef, priceUpdates);

            // Update local state
            setPrices(prev => ({
                ...prev,
                [productId]: newPrices
            }));

            // Clear editing state
            const newEditingPrices = { ...editingPrices };
            delete newEditingPrices[productId];
            setEditingPrices(newEditingPrices);

            alert('Prices updated successfully!');
        } catch (error) {
            // console.error('Error updating prices:', error);
            alert('Error updating prices');
        }
    };

    const toggleTrending = async (productId, currentStatus) => {
        try {
            await updateDoc(doc(db, 'products', productId), {
                isTrending: !currentStatus
            });
            setProducts(products.map(p =>
                p.id === productId ? { ...p, isTrending: !currentStatus } : p
            ));
        } catch (error) {
            // console.error('Error updating trending status:', error);
            alert('Failed to update trending status');
        }
    };

    // Main Render
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products & Pricing</h1>
                    <p className="text-gray-600 mt-1">
                        {selectedCategory
                            ? `Managing ${selectedCategory}`
                            : 'Select a category to manage products'}
                    </p>
                </div>
                {!selectedCategory && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowAddCategory(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                        >
                            <Grid3x3 className="h-5 w-5" />
                            Add Category
                        </button>
                    </div>
                )}
                {selectedCategory && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back
                        </button>
                        <button
                            onClick={() => setShowAddProduct(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Add Product
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            {categoriesLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : !selectedCategory ? (
                // Categories Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((category) => {
                        const productCount = getCategoryProductCount(category.name);
                        return (
                            <div
                                key={category.id || category.name}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                                                <Grid3x3 className="h-6 w-6 text-primary-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {productsLoading ? '...' : `${productCount} products`}
                                                </p>
                                            </div>
                                        </div>
                                        {category.id && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCategory(category.id, category.name);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {categories.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">No categories found.</p>
                        </div>
                    )}
                </div>
            ) : (
                // Products List
                <div className="space-y-6">
                    {/* Search & Sort */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative min-w-[180px]">
                                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                                >
                                    <option value="popular">Popular (Most Views)</option>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative min-w-[180px]">
                                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
                                >
                                    <option value="all">All Products</option>
                                    <option value="manual">Manual Trending</option>
                                    <option value="auto">Auto Trending (Top 10)</option>
                                </select>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                {filteredProducts.length} products
                            </span>
                            <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                {filteredProducts.filter(p => p.isTrending).length} manually trending
                            </span>
                            <span className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                {top10ByViews.length} auto-trending (top 10)
                            </span>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="space-y-4">
                        {filteredProducts.map((product) => {
                            const productPrices = prices[product.id] || {};
                            const cheapest = getCheapestPrice(productPrices);
                            const isEditingPrices = editingPrices[product.id];
                            const isAutoTrending = top10ByViews.includes(product.id);
                            const isManualTrending = product.isTrending;

                            return (
                                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Product Header */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4 flex-1">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="h-16 w-16 object-contain rounded-lg border border-gray-200"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-2">
                                                        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                                        {/* Trending Badges */}
                                                        {isManualTrending && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                                                <Star className="h-3 w-3 fill-current" />
                                                                TRENDING
                                                            </span>
                                                        )}
                                                        {isAutoTrending && !isManualTrending && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                                <TrendingUp className="h-3 w-3" />
                                                                Auto Top 10
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                            {product.category}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                            <Eye className="h-3 w-3" />
                                                            {product.viewCount || 0} views
                                                        </span>
                                                    </div>
                                                    {cheapest && (
                                                        <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                                            <TrendingUp className="h-4 w-4 text-green-600" />
                                                            Best Price: KES {cheapest.price} at {cheapest.supermarket}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {/* Trending Toggle */}
                                                <button
                                                    onClick={() => toggleTrending(product.id, product.isTrending)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${isManualTrending
                                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    title={isManualTrending ? "Remove from trending" : "Mark as trending"}
                                                >
                                                    <Star className={`h-4 w-4 ${isManualTrending ? 'fill-current' : ''}`} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingProduct(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Prices Grid */}
                                    <div className="p-6 bg-gray-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold text-gray-900">Prices Across Supermarkets</h4>
                                            {!isEditingPrices ? (
                                                <button
                                                    onClick={() => setEditingPrices({ ...editingPrices, [product.id]: { ...productPrices } })}
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Edit Prices
                                                </button>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const newEditingPrices = { ...editingPrices };
                                                            delete newEditingPrices[product.id];
                                                            setEditingPrices(newEditingPrices);
                                                        }}
                                                        className="text-sm text-gray-600 hover:text-gray-700 font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdatePrices(product.id, isEditingPrices)}
                                                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                        Save
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {supermarkets.map((supermarket) => {
                                                const priceData = isEditingPrices
                                                    ? isEditingPrices[supermarket.id]
                                                    : productPrices[supermarket.id];
                                                const price = priceData?.price || 0;
                                                const location = priceData?.location || '';
                                                const colorClass = getSupermarketColor(supermarket.id);
                                                const isCheapest = cheapest?.supermarket === supermarket.id;

                                                return (
                                                    <div
                                                        key={supermarket.id}
                                                        className={`p-4 rounded-lg border-2 ${isCheapest && !isEditingPrices
                                                            ? `border-${colorClass} bg-${colorClass}/5`
                                                            : 'border-gray-200 bg-white'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className={`w-8 h-8 rounded-full bg-${colorClass} flex items-center justify-center text-white font-bold text-sm`}>
                                                                {getSupermarketInitials(supermarket.name, supermarkets.map(s => s.name))}
                                                            </div>
                                                            <span className="font-semibold text-gray-900 text-sm">{supermarket.name}</span>
                                                        </div>

                                                        {isEditingPrices ? (
                                                            <div className="space-y-2">
                                                                <input
                                                                    type="number"
                                                                    value={price}
                                                                    onChange={(e) => setEditingPrices({
                                                                        ...editingPrices,
                                                                        [product.id]: {
                                                                            ...isEditingPrices,
                                                                            [supermarket.id]: {
                                                                                ...priceData,
                                                                                price: parseInt(e.target.value) || 0
                                                                            }
                                                                        }
                                                                    })}
                                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                                                    placeholder="Price"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={location}
                                                                    onChange={(e) => setEditingPrices({
                                                                        ...editingPrices,
                                                                        [product.id]: {
                                                                            ...isEditingPrices,
                                                                            [supermarket.id]: {
                                                                                ...priceData,
                                                                                location: e.target.value
                                                                            }
                                                                        }
                                                                    })}
                                                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                                                                    placeholder="Location"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p className={`text-xl font-bold ${isCheapest ? `text-${colorClass}` : 'text-gray-900'}`}>
                                                                    KES {price}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{location || 'No location'}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500">No products in this category yet</p>
                                <button
                                    onClick={() => setShowAddProduct(true)}
                                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Add your first product
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            {showAddCategory && (
                <AddCategoryModal
                    onClose={() => setShowAddCategory(false)}
                    onSave={handleAddCategory}
                />
            )}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    categories={categories.map(c => c.name)}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleUpdateProduct}
                />
            )}
            {showAddProduct && (
                <AddProductModal
                    category={selectedCategory}
                    onClose={() => setShowAddProduct(false)}
                    onSave={handleAddProduct}
                />
            )}
        </div>
    );
}

// Add Category Modal
function AddCategoryModal({ onClose, onSave }) {
    const [categoryName, setCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSave(categoryName);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g., Frozen Foods"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Add Product Modal
function AddProductModal({ category, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        category: category,
        image: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add Product to {category}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="e.g., Brookside Milk 500ml"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt="Preview"
                                className="mt-2 h-20 w-20 object-contain rounded-lg border border-gray-200"
                            />
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            Add Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Edit Product Modal
function EditProductModal({ product, categories, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: product.name || '',
        category: product.category || '',
        image: product.image || '',
        active: product.active !== false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(product.id, formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            required
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="h-4 w-4 text-primary-600 rounded"
                        />
                        <label htmlFor="active" className="ml-2 text-sm text-gray-700">Active</label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
