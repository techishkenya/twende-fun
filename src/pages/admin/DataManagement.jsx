import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { seedDemoData, deleteDemoData } from '../../lib/seedDemoData';
import { Database, Trash2, RefreshCw, AlertTriangle, Package, Users, DollarSign, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DataManagement() {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        demoUsers: 0,
        demoProducts: 0,
        demoPrices: 0,
        demoSubmissions: 0,
        demoProductSubmissions: 0,
        realUsers: 0,
        realProducts: 0,
        realPrices: 0
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Count demo data
            const demoUsersSnapshot = await getDocs(query(collection(db, 'users'), where('isDemo', '==', true)));
            const demoProductsSnapshot = await getDocs(query(collection(db, 'products'), where('isDemo', '==', true)));
            const demoPricesSnapshot = await getDocs(query(collection(db, 'prices'), where('isDemo', '==', true)));
            const demoSubmissionsSnapshot = await getDocs(query(collection(db, 'submissions'), where('isDemo', '==', true)));
            const demoProductSubmissionsSnapshot = await getDocs(query(collection(db, 'product_submissions'), where('isDemo', '==', true)));

            // Count real data
            const allUsersSnapshot = await getDocs(collection(db, 'users'));
            const allProductsSnapshot = await getDocs(collection(db, 'products'));
            const allPricesSnapshot = await getDocs(collection(db, 'prices'));

            const realUserCount = allUsersSnapshot.size - demoUsersSnapshot.size;
            const realProductCount = allProductsSnapshot.size - demoProductsSnapshot.size;
            const realPriceCount = allPricesSnapshot.size - demoPricesSnapshot.size;

            setStats({
                demoUsers: demoUsersSnapshot.size,
                demoProducts: demoProductsSnapshot.size,
                demoPrices: demoPricesSnapshot.size,
                demoSubmissions: demoSubmissionsSnapshot.size,
                demoProductSubmissions: demoProductSubmissionsSnapshot.size,
                realUsers: realUserCount,
                realProducts: realProductCount,
                realPrices: realPriceCount
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
            toast.error('Failed to load statistics');
        }
    };

    const handleSeedDemoData = async () => {
        if (!confirm('This will create demo users and submissions. Continue?')) return;

        setLoading(true);
        try {
            const result = await seedDemoData();
            if (result.success) {
                toast.success('Demo data created successfully!');
                await fetchStats();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error seeding data:', error);
            toast.error('Failed to seed demo data');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDemoData = async () => {
        if (deleteConfirmation !== 'DELETE') {
            toast.error('Please type DELETE to confirm');
            return;
        }

        setLoading(true);
        try {
            const result = await deleteDemoData();
            if (result.success) {
                toast.success(`Deleted: ${result.deletedCounts.users} users, ${result.deletedCounts.products} products, ${result.deletedCounts.prices} prices`);
                setShowDeleteModal(false);
                setDeleteConfirmation('');
                await fetchStats();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            toast.error('Failed to delete demo data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
                <p className="text-gray-600 mt-1">Manage demo and production data</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-500">Demo</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.demoUsers}</h3>
                    <p className="text-sm text-gray-600">Demo Users</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="text-xs text-gray-500">Demo</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.demoProducts}</h3>
                    <p className="text-sm text-gray-600">Demo Products</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <span className="text-xs text-gray-500">Demo</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.demoPrices}</h3>
                    <p className="text-sm text-gray-600">Demo Prices</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <span className="text-xs text-gray-500">Demo</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {stats.demoSubmissions + stats.demoProductSubmissions}
                    </h3>
                    <p className="text-sm text-gray-600">Demo Submissions</p>
                </div>
            </div>

            {/* Real Data Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-4">Production Data</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-blue-700">Real Users</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.realUsers}</p>
                    </div>
                    <div>
                        <p className="text-sm text-blue-700">Real Products</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.realProducts}</p>
                    </div>
                    <div>
                        <p className="text-sm text-blue-700">Real Prices</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.realPrices}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Data Actions</h3>

                <div className="space-y-4">
                    {/* Seed Demo Data */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Database className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-1">Seed Demo Data</h4>
                            <p className="text-sm text-gray-600 mb-3">
                                Create 3 demo users (Alice, Brian, Carol) with varied submissions for testing and demonstration purposes.
                            </p>
                            <button
                                onClick={handleSeedDemoData}
                                disabled={loading}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                                Seed Demo Data
                            </button>
                        </div>
                    </div>

                    {/* Delete Demo Data */}
                    <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                        <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-red-900 mb-1 flex items-center gap-2">
                                Delete All Demo Data
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </h4>
                            <p className="text-sm text-red-700 mb-3">
                                <strong>Danger Zone:</strong> This will permanently delete all data marked with <code className="bg-red-200 px-1 rounded">isDemo: true</code>.
                                Real user data will NOT be affected.
                            </p>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                disabled={loading || stats.demoUsers === 0}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Demo Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800">
                                    <strong>Warning:</strong> This action cannot be undone. All demo data will be permanently removed.
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-700 mb-2">
                                    You will delete:
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                    <li>• {stats.demoUsers} demo users</li>
                                    <li>• {stats.demoProducts} demo products</li>
                                    <li>• {stats.demoPrices} demo prices</li>
                                    <li>• {stats.demoSubmissions + stats.demoProductSubmissions} demo submissions</li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type <strong>DELETE</strong> to confirm:
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                    placeholder="DELETE"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteConfirmation('');
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteDemoData}
                                    disabled={loading || deleteConfirmation !== 'DELETE'}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            Delete Forever
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
