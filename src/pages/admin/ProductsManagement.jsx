import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, Search, X, Save, TrendingUp } from 'lucide-react';
import { CATEGORIES, SUPERMARKETS } from '../../lib/types';
import { getCheapestPrice, getSupermarketColor } from '../../hooks/useFirestore';

export default function ProductsManagement() {
    const [products, setProducts] = useState([]);
    const [prices, setPrices] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingPrices, setEditingPrices] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch products
            const productsSnapshot = await getDocs(collection(db, 'products'));
            const productsList = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);

            // Fetch all prices
            const pricesSnapshot = await getDocs(collection(db, 'prices'));
            const pricesMap = {};
            pricesSnapshot.docs.forEach(doc => {
                pricesMap[doc.id] = doc.data().prices;
            });
            setPrices(pricesMap);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (productId) => {
        if (confirm('Are you sure you want to delete this product and all its prices?')) {
            try {
                await deleteDoc(doc(db, 'products', productId));
                await deleteDoc(doc(db, 'prices', productId));
                setProducts(products.filter(p => p.id !== productId));
                const newPrices = { ...prices };
                delete newPrices[productId];
                setPrices(newPrices);
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const handleUpdateProduct = async (productId, updatedData) => {
        try {
            await updateDoc(doc(db, 'products', productId), {
                ...updatedData,
                updatedAt: new Date()
            });
            setProducts(products.map(p => p.id === productId ? { ...p, ...updatedData } : p));
            setEditingProduct(null);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    const handleUpdatePrices = async (productId, newPrices) => {
        try {
            await updateDoc(doc(db, 'prices', productId), {
                prices: newPrices,
                lastUpdated: new Date()
            });
            setPrices({ ...prices, [productId]: newPrices });
            setEditingPrices({});
        } catch (error) {
            console.error('Error updating prices:', error);
            alert('Failed to update prices');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products & Pricing Management</h1>
                    <p className="text-gray-600 mt-1">{products.length} total products</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </div>

            {/* Products List */}
            <div className="space-y-4">
                {filteredProducts.map((product) => {
                    const productPrices = prices[product.id] || {};
                    const cheapest = getCheapestPrice(productPrices);
                    const isEditingPrices = editingPrices[product.id];

                    return (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Product Header */}
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-16 w-16 object-contain rounded-lg border border-gray-200"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mt-1">
                                                {product.category}
                                            </span>
                                            {cheapest && (
                                                <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                    Best Price: KES {cheapest.price} at {cheapest.supermarket}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingProduct(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
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
                                    {SUPERMARKETS.map((supermarket) => {
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
                                                        {supermarket.name.charAt(0)}
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
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500">No products found</p>
                </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleUpdateProduct}
                />
            )}
        </div>
    );
}

function EditProductModal({ product, onClose, onSave }) {
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
                            {CATEGORIES.map((cat) => (
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
