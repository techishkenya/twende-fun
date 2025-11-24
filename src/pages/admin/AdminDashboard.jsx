import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Package, DollarSign, Store, Users, TrendingUp, Clock } from 'lucide-react';

export default function AdminDashboard() {
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

    const statCards = [
        { label: 'Total Products', value: stats.products, icon: Package, color: 'blue' },
        { label: 'Price Entries', value: stats.prices, icon: DollarSign, color: 'green' },
        { label: 'Supermarkets', value: stats.supermarkets, icon: Store, color: 'orange' },
        { label: 'Users', value: stats.users, icon: Users, color: 'purple' },
        { label: 'Pending Reviews', value: stats.pendingSubmissions, icon: Clock, color: 'yellow' },
        { label: 'Today\'s Submissions', value: stats.todaySubmissions, icon: TrendingUp, color: 'red' },
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
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
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
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-colors font-semibold">
                        Add New Product
                    </button>
                    <button className="p-4 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-semibold">
                        Update Prices
                    </button>
                    <button className="p-4 border-2 border-orange-600 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors font-semibold">
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
                            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{activity.action}</p>
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
