import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TrendingUp, Star, Eye, Search } from 'lucide-react';

export default function TrendingManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'products'), orderBy('viewCount', 'desc'), limit(50));
            const snapshot = await getDocs(q);
            const productsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsList);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback if index is missing
            try {
                const snapshot = await getDocs(collection(db, 'products'));
                const productsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsList.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)));
            } catch (err) {
                console.error('Fallback fetch failed:', err);
            }
        } finally {
            setLoading(false);
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
            console.error('Error updating trending status:', error);
            alert('Failed to update status');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const trendingCount = products.filter(p => p.isTrending).length;
    const totalViews = products.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const avgViews = products.length > 0 ? Math.round(totalViews / products.length) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Trending Management</h1>
                <p className="text-gray-600 mt-1">Manage manually trending items and view popular products</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium">Trending Products</p>
                            <p className="text-3xl font-bold mt-1">{trendingCount}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Star className="h-6 w-6 fill-current" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Views</p>
                            <p className="text-3xl font-bold mt-1">{totalViews.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <Eye className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Average Views</p>
                            <p className="text-3xl font-bold mt-1">{avgViews}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

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

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full object-contain border border-gray-200" src={product.image} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4 text-gray-400" />
                                            {product.viewCount || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {product.isTrending ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                <Star className="h-3 w-3 mr-1 fill-current" /> Trending
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                Standard
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => toggleTrending(product.id, product.isTrending)}
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${product.isTrending
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                }`}
                                        >
                                            {product.isTrending ? 'Remove Trending' : 'Mark Trending'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredProducts.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No products found</p>
                            <p className="text-sm text-gray-400 mt-1">Try a different search term or check back later</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
