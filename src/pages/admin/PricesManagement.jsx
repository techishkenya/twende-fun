import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, Search, X, Filter } from 'lucide-react';
import { useProducts, useSupermarkets } from '../../hooks/useFirestore';

export default function PricesManagement() {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProduct, setFilterProduct] = useState('');
    const [filterSupermarket, setFilterSupermarket] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPrice, setEditingPrice] = useState(null);

    const { products } = useProducts();
    const { supermarkets } = useSupermarkets();

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const q = query(collection(db, 'prices'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const pricesList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPrices(pricesList);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching prices:', error);
            setLoading(false);
        }
    };

    const filteredPrices = prices.filter(price => {
        const product = products.find(p => p.id === price.productId);
        const supermarket = supermarkets.find(s => s.id === price.supermarketId);

        const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supermarket?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProduct = !filterProduct || price.productId === filterProduct;
        const matchesSupermarket = !filterSupermarket || price.supermarketId === filterSupermarket;

        return matchesSearch && matchesProduct && matchesSupermarket;
    });

    const handleDelete = async (priceId) => {
        if (confirm('Are you sure you want to delete this price entry?')) {
            try {
                await deleteDoc(doc(db, 'prices', priceId));
                setPrices(prices.filter(p => p.id !== priceId));
            } catch (error) {
                console.error('Error deleting price:', error);
                alert('Failed to delete price');
            }
        }
    };

    const handleSave = async (priceData) => {
        try {
            if (editingPrice) {
                // Update existing price
                await updateDoc(doc(db, 'prices', editingPrice.id), {
                    ...priceData,
                    timestamp: new Date()
                });
                setPrices(prices.map(p => p.id === editingPrice.id ? { ...p, ...priceData } : p));
                setEditingPrice(null);
            } else {
                // Add new price
                const docRef = await addDoc(collection(db, 'prices'), {
                    ...priceData,
                    timestamp: new Date(),
                    verified: true
                });
                setPrices([{ id: docRef.id, ...priceData, timestamp: new Date() }, ...prices]);
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error saving price:', error);
            alert('Failed to save price');
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
                    <h1 className="text-3xl font-bold text-gray-900">Prices Management</h1>
                    <p className="text-gray-600 mt-1">{prices.length} total price entries</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Price
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by product or supermarket..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        value={filterProduct}
                        onChange={(e) => setFilterProduct(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">All Products</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterSupermarket}
                        onChange={(e) => setFilterSupermarket(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">All Supermarkets</option>
                        {supermarkets.map(supermarket => (
                            <option key={supermarket.id} value={supermarket.id}>{supermarket.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Prices Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Supermarket
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPrices.map((price) => {
                                const product = products.find(p => p.id === price.productId);
                                const supermarket = supermarkets.find(s => s.id === price.supermarketId);

                                return (
                                    <tr key={price.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {product?.name || 'Unknown Product'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {supermarket?.name || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                KES {price.price?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {price.location || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {price.timestamp?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingPrice(price)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(price.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredPrices.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No prices found</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingPrice) && (
                <PriceModal
                    price={editingPrice}
                    products={products}
                    supermarkets={supermarkets}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingPrice(null);
                    }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function PriceModal({ price, products, supermarkets, onClose, onSave }) {
    const [formData, setFormData] = useState({
        productId: price?.productId || '',
        supermarketId: price?.supermarketId || '',
        price: price?.price || '',
        location: price?.location || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            price: parseFloat(formData.price)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {price ? 'Edit Price' : 'Add New Price'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Product */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product
                        </label>
                        <select
                            value={formData.productId}
                            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        >
                            <option value="">Select product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>{product.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Supermarket */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supermarket
                        </label>
                        <select
                            value={formData.supermarketId}
                            onChange={(e) => setFormData({ ...formData, supermarketId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        >
                            <option value="">Select supermarket</option>
                            {supermarkets.map(supermarket => (
                                <option key={supermarket.id} value={supermarket.id}>{supermarket.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (KES)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="150.00"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Two Rivers, Hub Karen, etc."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            {price ? 'Update' : 'Add'} Price
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
