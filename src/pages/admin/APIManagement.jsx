import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { Key, Copy, Trash2, Plus, RefreshCw, Eye, EyeOff, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function APIManagement() {
    const { currentUser } = useAuth();
    const { viewMode } = useAdmin();
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSecrets, setShowSecrets] = useState({});
    const [analytics, setAnalytics] = useState(null);

    const fetchAPIKeys = useCallback(async () => {
        try {
            setLoading(true);
            const isDemoMode = viewMode === 'demo';
            const q = query(
                collection(db, 'api_keys'),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const keys = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(k => isDemoMode ? k.isDemo === true : k.isDemo !== true);

            setApiKeys(keys);
        } catch (error) {
            console.error('Error fetching API keys:', error);
            toast.error('Failed to load API keys');
        } finally {
            setLoading(false);
        }
    }, [viewMode]);

    const fetchAnalytics = useCallback(async () => {
        try {
            // Fetch API usage analytics
            const isDemoMode = viewMode === 'demo';
            const logsRef = collection(db, 'api_usage_logs');
            const snapshot = await getDocs(logsRef);

            const logs = snapshot.docs
                .map(doc => doc.data())
                .filter(log => isDemoMode ? log.isDemo === true : log.isDemo !== true);

            // Calculate statistics
            const now = new Date();
            const last24h = new Date(now - 24 * 60 * 60 * 1000);
            const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);

            const stats = {
                total_requests: logs.length,
                last_24h: logs.filter(l => l.timestamp?.toDate() > last24h).length,
                last_7d: logs.filter(l => l.timestamp?.toDate() > last7d).length,
                success_rate: logs.filter(l => l.status === 200).length / logs.length * 100,
                by_endpoint: {}
            };

            // Group by endpoint
            logs.forEach(log => {
                const endpoint = log.endpoint || 'unknown';
                if (!stats.by_endpoint[endpoint]) {
                    stats.by_endpoint[endpoint] = 0;
                }
                stats.by_endpoint[endpoint]++;
            });

            setAnalytics(stats);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    }, [viewMode]);

    useEffect(() => {
        fetchAPIKeys();
        fetchAnalytics();
    }, [fetchAPIKeys, fetchAnalytics]);

    const generateAPIKey = (supermarketId, environment = 'demo') => {
        const prefix = environment === 'demo' ? 'pk_demo' : 'pk_live';
        const random = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        return `${prefix}_${supermarketId}_${random}`;
    };

    const generateAPISecret = () => {
        const random = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        return `sk_secret_${random}`;
    };

    const handleCreateKey = async (formData) => {
        try {
            const isDemoMode = viewMode === 'demo';
            const environment = isDemoMode ? 'demo' : 'live';

            const apiKey = generateAPIKey(formData.supermarketId, environment);
            const apiSecret = generateAPISecret();

            const newKey = {
                supermarketId: formData.supermarketId,
                supermarketName: formData.supermarketName,
                apiKey: apiKey,
                apiSecret: apiSecret, // In production, hash this!
                environment: environment,
                status: 'active',
                permissions: formData.permissions || ['prices:read', 'prices:write', 'products:read'],
                rateLimit: {
                    requests_per_minute: parseInt(formData.rateLimit) || 60,
                    requests_per_hour: parseInt(formData.rateLimit) * 60 || 1000
                },
                metadata: {
                    contact_email: formData.contactEmail,
                    contact_phone: formData.contactPhone,
                    notes: formData.notes
                },
                createdAt: new Date(),
                createdBy: currentUser.uid,
                lastUsed: null,
                totalRequests: 0,
                isDemo: isDemoMode
            };

            await addDoc(collection(db, 'api_keys'), newKey);

            toast.success('API Key created successfully!');
            fetchAPIKeys();
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating API key:', error);
            toast.error('Failed to create API key');
        }
    };

    const handleRevokeKey = async (keyId) => {
        if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
            return;
        }

        try {
            await updateDoc(doc(db, 'api_keys', keyId), {
                status: 'revoked',
                revokedAt: new Date(),
                revokedBy: currentUser.uid
            });

            toast.success('API Key revoked successfully');
            fetchAPIKeys();
        } catch (error) {
            console.error('Error revoking API key:', error);
            toast.error('Failed to revoke API key');
        }
    };

    const handleDeleteKey = async (keyId) => {
        if (!confirm('Are you sure you want to permanently delete this API key?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'api_keys', keyId));
            toast.success('API Key deleted successfully');
            fetchAPIKeys();
        } catch (error) {
            console.error('Error deleting API key:', error);
            toast.error('Failed to delete API key');
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const toggleSecretVisibility = (keyId) => {
        setShowSecrets(prev => ({ ...prev, [keyId]: !prev[keyId] }));
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
                    <h1 className="text-3xl font-bold text-gray-900">API Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage API keys for supermarket integrations
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Generate API Key
                </button>
            </div>

            {/* Analytics Cards */}
            {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {analytics.total_requests.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Last 24 Hours</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {analytics.last_24h.toLocaleString()}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Clock className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Success Rate</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {(analytics.success_rate || 0).toFixed(1)}%
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Keys</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {apiKeys.filter(k => k.status === 'active').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Key className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* API Keys List */}
            <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <Key className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {apiKey.supermarketName}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${apiKey.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {apiKey.status === 'active' ? (
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                )}
                                                {apiKey.status.toUpperCase()}
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                {apiKey.environment.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {apiKey.status === 'active' && (
                                        <button
                                            onClick={() => handleRevokeKey(apiKey.id)}
                                            className="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                        >
                                            Revoke
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeleteKey(apiKey.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Credentials */}
                        <div className="p-6 bg-gray-50 space-y-3">
                            {/* API Key */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">API KEY</label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-900">
                                        {apiKey.apiKey}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(apiKey.apiKey, 'API Key')}
                                        className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* API Secret */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">API SECRET</label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-900">
                                        {showSecrets[apiKey.id]
                                            ? apiKey.apiSecret
                                            : '••••••••••••••••••••••••••••'}
                                    </code>
                                    <button
                                        onClick={() => toggleSecretVisibility(apiKey.id)}
                                        className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors"
                                    >
                                        {showSecrets[apiKey.id] ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(apiKey.apiSecret, 'API Secret')}
                                        className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Rate Limit</p>
                                <p className="font-semibold text-gray-900 mt-1">
                                    {apiKey.rateLimit?.requests_per_minute || 60}/min
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Total Requests</p>
                                <p className="font-semibold text-gray-900 mt-1">
                                    {(apiKey.totalRequests || 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Created</p>
                                <p className="font-semibold text-gray-900 mt-1">
                                    {apiKey.createdAt?.toDate().toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Last Used</p>
                                <p className="font-semibold text-gray-900 mt-1">
                                    {apiKey.lastUsed
                                        ? apiKey.lastUsed.toDate().toLocaleDateString()
                                        : 'Never'}
                                </p>
                            </div>
                        </div>

                        {/* Permissions */}
                        <div className="p-6 pt-0">
                            <p className="text-xs font-semibold text-gray-600 mb-2">PERMISSIONS</p>
                            <div className="flex flex-wrap gap-2">
                                {(apiKey.permissions || []).map((permission) => (
                                    <span
                                        key={permission}
                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                    >
                                        {permission}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {apiKeys.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Key className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No API keys yet</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Generate your first API key
                        </button>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <CreateAPIKeyModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateKey}
                    environment={viewMode}
                />
            )}
        </div>
    );
}

// Create API Key Modal
function CreateAPIKeyModal({ onClose, onCreate, environment }) {
    const [formData, setFormData] = useState({
        supermarketId: '',
        supermarketName: '',
        rateLimit: '60',
        permissions: ['prices:read', 'prices:write', 'products:read'],
        contactEmail: '',
        contactPhone: '',
        notes: ''
    });

    const availablePermissions = [
        'prices:read',
        'prices:write',
        'products:read',
        'products:write',
        'analytics:read'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
    };

    const togglePermission = (permission) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Generate API Key</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <span className="text-gray-500 text-xl">×</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Supermarket Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Supermarket ID *
                            </label>
                            <input
                                type="text"
                                value={formData.supermarketId}
                                onChange={(e) => setFormData({ ...formData, supermarketId: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., carrefour"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Lowercase, no spaces</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Supermarket Name *
                            </label>
                            <input
                                type="text"
                                value={formData.supermarketName}
                                onChange={(e) => setFormData({ ...formData, supermarketName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g., Carrefour Kenya"
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                value={formData.contactEmail}
                                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="api@supermarket.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Phone
                            </label>
                            <input
                                type="tel"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="+254..."
                            />
                        </div>
                    </div>

                    {/* Rate Limit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rate Limit (requests/minute)
                        </label>
                        <input
                            type="number"
                            value={formData.rateLimit}
                            onChange={(e) => setFormData({ ...formData, rateLimit: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            min="10"
                            max="1000"
                        />
                    </div>

                    {/* Permissions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Permissions
                        </label>
                        <div className="space-y-2">
                            {availablePermissions.map((permission) => (
                                <label key={permission} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.includes(permission)}
                                        onChange={() => togglePermission(permission)}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">{permission}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            rows="3"
                            placeholder="Any additional notes about this integration..."
                        />
                    </div>

                    {/* Environment Notice */}
                    <div className={`p-4 rounded-lg ${environment === 'demo'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-green-50 border border-green-200'
                        }`}>
                        <p className="text-sm font-medium text-gray-900">
                            {environment === 'demo' ? '🧪 Demo Mode' : '🚀 Live Mode'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            {environment === 'demo'
                                ? 'This API key will only work with demo data'
                                : 'This API key will affect live production data'}
                        </p>
                    </div>

                    {/* Actions */}
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
                            Generate API Key
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
