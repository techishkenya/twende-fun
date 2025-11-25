import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Package, DollarSign, Store, Users, TrendingUp, Clock, Plus, Edit, FileCheck } from 'lucide-react';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        products: 0,
        prices: 0,
        supermarkets: 0,
        users: 0,
        pendingSubmissions: 0,
        todaySubmissions: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchRecentActivity();
    }, []);

    const fetchStats = async () => {
        try {
            // Get counts from collections
            const productsSnap = await getDocs(collection(db, 'products'));
            const pricesSnap = await getDocs(collection(db, 'prices'));
            const supermarketsSnap = await getDocs(collection(db, 'supermarkets'));
            const usersSnap = await getDocs(collection(db, 'users'));

            // Get pending submissions
            const pendingQuery = query(
                collection(db, 'submissions'),
                where('status', '==', 'pending')
            );
            const pendingSnap = await getDocs(pendingQuery);

            // Get today's submissions
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayQuery = query(
                collection(db, 'submissions'),
                where('createdAt', '>=', today)
            );
            const todaySnap = await getDocs(todayQuery);

            setStats({
                products: productsSnap.size,
                prices: pricesSnap.size,
                supermarkets: supermarketsSnap.size,
                users: usersSnap.size,
                pendingSubmissions: pendingSnap.size,
                todaySubmissions: todaySnap.size
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    const fetchRecentActivity = async () => {
        try {
            // Fetch recently updated products (as a proxy for admin activity)
            const productsQuery = query(
                collection(db, 'products'),
                orderBy('updatedAt', 'desc'),
                limit(10)
            );
            const productsSnap = await getDocs(productsQuery);

            const activities = productsSnap.docs.map(doc => {
                const data = doc.data();
                const updatedAt = data.updatedAt?.toDate() || new Date();
                const timeAgo = getTimeAgo(updatedAt);

                return {
                    action: `Updated product "${data.name}"`,
                    time: timeAgo,
                    timestamp: updatedAt
                };
            });

            setRecentActivity(activities);
        } catch (error) {
            console.error('Error fetching activity:', error);
            // Fallback to mock data if no updatedAt field exists
            setRecentActivity([
                { action: 'System initialized', time: 'Just now', timestamp: new Date() }
            ]);
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
        return date.toLocaleDateString();
    };

    const quickActions = [
        {
            label: 'Add New Product',
            icon: Plus,
            color: 'bg-blue-50 text-blue-600',
            onClick: () => navigate('/admin/products', { state: { openAddModal: true } })
        },
        {
            label: 'Update Prices',
            icon: Edit,
            color: 'bg-green-50 text-green-600',
            onClick: () => navigate('/admin/products')
        },
        {
            label: 'Review Submissions',
            icon: FileCheck,
            color: 'bg-yellow-50 text-yellow-600',
            onClick: () => navigate('/admin/submissions')
        }
    ];
    const statCards = [
        {
            label: 'Total Products',
            value: stats.products,
            icon: Package,
            color: 'blue',
            onClick: () => navigate('/admin/products')
        },
        {
            label: 'Supermarkets',
            value: stats.supermarkets,
            icon: Store,
            color: 'orange',
            onClick: () => navigate('/admin/supermarkets')
        },
        {
            label: 'Users',
            value: stats.users,
            icon: Users,
            color: 'purple',
            onClick: () => navigate('/admin/users')
        },
        {
            label: 'Pending Reviews',
            value: stats.pendingSubmissions,
            icon: Clock,
            color: 'yellow',
            onClick: () => navigate('/admin/submissions')
        },
        {
            label: 'Today\'s Submissions',
            value: stats.todaySubmissions,
            icon: TrendingUp,
            color: 'red',
            onClick: () => navigate('/admin/submissions')
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to Twende Fun Admin Panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <button
                            key={stat.label}
                            onClick={stat.onClick}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-105 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-4 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Product
                    </button>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-4 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                        <Edit className="h-5 w-5" />
                        Update Prices
                    </button>
                    <button
                        onClick={() => navigate('/admin/submissions')}
                        className="p-4 border-2 border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                        <FileCheck className="h-5 w-5" />
                        Review Submissions
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                {recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                ) : (
                    <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
