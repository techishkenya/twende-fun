import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Check, X, Search, Filter, Clock } from 'lucide-react';
import { useProducts, useSupermarkets } from '../../hooks/useFirestore';

export default function SubmissionsManagement() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');

    const { products } = useProducts();
    const { supermarkets } = useSupermarkets();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'submissions'));
                const submissionsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSubmissions(submissionsList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching submissions:', error);
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const filteredSubmissions = submissions.filter(submission => {
        const product = products.find(p => p.id === submission.productId);
        const supermarket = supermarkets.find(s => s.id === submission.supermarketId);

        const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supermarket?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleApprove = async (submission) => {
        try {
            // Add to prices collection
            await addDoc(collection(db, 'prices'), {
                productId: submission.productId,
                supermarketId: submission.supermarketId,
                price: submission.price,
                location: submission.location,
                timestamp: new Date(),
                verified: true,
                submittedBy: submission.userId
            });

            // Update submission status
            await updateDoc(doc(db, 'submissions', submission.id), {
                status: 'approved',
                reviewedAt: new Date()
            });

            setSubmissions(submissions.map(s =>
                s.id === submission.id ? { ...s, status: 'approved' } : s
            ));
        } catch (error) {
            console.error('Error approving submission:', error);
            alert('Failed to approve submission');
        }
    };

    const handleReject = async (submissionId) => {
        if (confirm('Are you sure you want to reject this submission?')) {
            try {
                await updateDoc(doc(db, 'submissions', submissionId), {
                    status: 'rejected',
                    reviewedAt: new Date()
                });

                setSubmissions(submissions.map(s =>
                    s.id === submissionId ? { ...s, status: 'rejected' } : s
                ));
            } catch (error) {
                console.error('Error rejecting submission:', error);
                alert('Failed to reject submission');
            }
        }
    };

    const handleDelete = async (submissionId) => {
        if (confirm('Are you sure you want to delete this submission?')) {
            try {
                await deleteDoc(doc(db, 'submissions', submissionId));
                setSubmissions(submissions.filter(s => s.id !== submissionId));
            } catch (error) {
                console.error('Error deleting submission:', error);
                alert('Failed to delete submission');
            }
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
                    <h1 className="text-3xl font-bold text-gray-900">Submissions Review</h1>
                    <p className="text-gray-600 mt-1">{submissions.length} total submissions</p>
                </div>
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

                {/* Status Filter */}
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submissions Table */}
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
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubmissions.map((submission) => {
                                const product = products.find(p => p.id === submission.productId);
                                const supermarket = supermarkets.find(s => s.id === submission.supermarketId);

                                return (
                                    <tr key={submission.id} className="hover:bg-gray-50">
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
                                                KES {submission.price?.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {submission.location || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {submission.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {submission.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(submission)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(submission.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(submission.id)}
                                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredSubmissions.length === 0 && (
                    <div className="text-center py-12">
                        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No submissions found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
