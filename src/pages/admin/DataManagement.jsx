import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { deleteDemoData } from '../../lib/seedDemoData';
import { initializeFirestore } from '../../lib/initializeFirestore';
import { Database, Trash2, RefreshCw, AlertTriangle, Package, Users, DollarSign, FileText, Play } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAdmin } from '../../context/AdminContext';

export default function DataManagement() {
    const [loading, setLoading] = useState(false);
    const { viewMode, setViewMode } = useAdmin();
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
            // Don't toast on error to avoid spamming if permissions are still propagating
        }
    };

    const handleInitializeDemo = async () => {
        setLoading(true);
        try {
            const result = await initializeFirestore();
            if (result.success) {
                toast.success('Demo environment initialized successfully!');
                await fetchStats();
            } else {
                toast.error(result.error || 'Initialization failed');
            }
        } catch (error) {
            console.error('Error initializing demo:', error);
            toast.error('Failed to initialize demo environment');
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

    const isDemoMode = viewMode === 'demo';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
                    <p className="text-gray-600 mt-1">Manage application data and environment mode</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${isDemoMode ? 'text-blue-600' : 'text-gray-500'}`}>Demo Mode</span>
                    <button
                        onClick={() => setViewMode(isDemoMode ? 'live' : 'demo')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDemoMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDemoMode ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </button>
                    <span className={`text-sm font-medium ${!isDemoMode ? 'text-green-600' : 'text-gray-500'}`}>Live Mode</span>
                </div>
            </div>

            {/* Mode Banner */}
            <div className={`p-4 rounded-xl border ${isDemoMode ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDemoMode ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {isDemoMode ? <Database className="h-6 w-6" /> : <RefreshCw className="h-6 w-6" />}
                    </div>
                    <div>
                        <h3 className={`font-bold ${isDemoMode ? 'text-blue-900' : 'text-green-900'}`}>
                            {isDemoMode ? 'Demo Environment Active' : 'Live Environment Active'}
                        </h3>
                        <p className={`text-sm ${isDemoMode ? 'text-blue-700' : 'text-green-700'}`}>
                            {isDemoMode
                                ? 'You are viewing and managing demo data. This data is safe to delete.'
                                : 'You are viewing production data. Be careful with your actions.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <span className="text-xs text-gray-500">{isDemoMode ? 'Demo' : 'Real'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {isDemoMode ? stats.demoUsers : stats.realUsers}
                    </h3>
                    <p className="text-sm text-gray-600">Users</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="text-xs text-gray-500">{isDemoMode ? 'Demo' : 'Real'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {isDemoMode ? stats.demoProducts : stats.realProducts}
                    </h3>
                    <p className="text-sm text-gray-600">Products</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                        <span className="text-xs text-gray-500">{isDemoMode ? 'Demo' : 'Real'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {isDemoMode ? stats.demoPrices : stats.realPrices}
                    </h3>
                    <p className="text-sm text-gray-600">Prices</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <span className="text-xs text-gray-500">{isDemoMode ? 'Demo' : 'Real'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        {isDemoMode ? (stats.demoSubmissions + stats.demoProductSubmissions) : 0}
                    </h3>
                    <p className="text-sm text-gray-600">Submissions</p>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Environment Actions</h3>

                <div className="space-y-4">
                    {/* Go Live / Switch Mode Action */}
                    <div className={`flex items-start gap-4 p-4 rounded-lg ${isDemoMode ? 'bg-green-50' : 'bg-blue-50'}`}>
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isDemoMode ? 'bg-green-100' : 'bg-blue-100'}`}>
                            {isDemoMode ? <RefreshCw className="h-6 w-6 text-green-600" /> : <Database className="h-6 w-6 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-bold mb-1 ${isDemoMode ? 'text-green-900' : 'text-blue-900'}`}>
                                {isDemoMode ? 'Go Live' : 'Switch to Demo Mode'}
                            </h4>
                            <p className={`text-sm mb-3 ${isDemoMode ? 'text-green-700' : 'text-blue-700'}`}>
                                {isDemoMode
                                    ? 'Switch to Live Mode to view production data. This will hide all demo data from this view.'
                                    : 'Switch back to Demo Mode to view and manage test data.'}
                            </p>
                            <button
                                onClick={() => setViewMode(isDemoMode ? 'live' : 'demo')}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white ${isDemoMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                <RefreshCw className="h-4 w-4" />
                                {isDemoMode ? 'Switch to Live Mode' : 'Switch to Demo Mode'}
                            </button>
                        </div>
                    </div>

                    {/* Initialize Demo Environment - Only visible in Demo Mode */}
                    {isDemoMode && (
                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Play className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-blue-900 mb-1">Initialize Demo Environment</h4>
                                <p className="text-sm text-blue-700 mb-3">
                                    Populate the database with a complete set of demo data: Users, Products, Prices, and Submissions.
                                    Use this if the demo environment is empty.
                                </p>
                                <button
                                    onClick={handleInitializeDemo}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                    Initialize Data
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Delete Demo Data - Only visible in Demo Mode */}
                    {isDemoMode && (
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
                                    <strong>Danger Zone:</strong> This will permanently delete all data marked as demo.
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
                    )}
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
