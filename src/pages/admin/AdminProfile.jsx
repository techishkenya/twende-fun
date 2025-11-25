import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { User, Clock, Activity, Shield } from 'lucide-react';

export default function AdminProfile() {
    const { currentUser } = useAuth();
    const [accessLogs, setAccessLogs] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                // Fetch Access Logs (All Admins)
                const accessQuery = query(
                    collection(db, 'admin_access_logs'),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                );
                const accessSnapshot = await getDocs(accessQuery);
                const accessList = accessSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAccessLogs(accessList);

                // Fetch Activity Logs (Current Admin's changes)
                // We'll look for products updated by this user
                const activityQuery = query(
                    collection(db, 'products'),
                    where('updatedBy', '==', currentUser.uid),
                    orderBy('updatedAt', 'desc'),
                    limit(10)
                );
                const activitySnapshot = await getDocs(activityQuery);
                const activityList = activitySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    type: 'Product Update'
                }));
                setActivityLogs(activityList);

            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchLogs();
        }
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
                        <p className="text-gray-600">{currentUser?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                Super Admin
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Access Log */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <h2 className="font-semibold text-gray-900">Recent Admin Access</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500">User</th>
                                    <th className="px-4 py-2 text-right font-medium text-gray-500">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {accessLogs.length > 0 ? (
                                    accessLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{log.email}</div>
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-500">
                                                {log.timestamp?.toDate()?.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-4 py-8 text-center text-gray-500">
                                            No access logs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* My Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-gray-400" />
                        <h2 className="font-semibold text-gray-900">My Recent Changes</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500">Action</th>
                                    <th className="px-4 py-2 text-right font-medium text-gray-500">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activityLogs.length > 0 ? (
                                    activityLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">Updated "{log.name}"</div>
                                                <div className="text-xs text-gray-500">Product Update</div>
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-500">
                                                {log.updatedAt?.toDate()?.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-4 py-8 text-center text-gray-500">
                                            No recent activity found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
