import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Package, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductSubmissions() {
    const { currentUser } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('pending');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'product_submissions'));
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
        const matchesSearch = submission.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.userName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleApprove = async (submission) => {
        try {
            const timestamp = new Date().getTime();
            const productId = submission.productName.toLowerCase().replace(/\s+/g, '-') + '-' + timestamp;

            if (submission.newCategory) {
                const categoryId = submission.newCategory.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'categories', categoryId), {
                    name: submission.newCategory,
                    productCount: 1,
                    createdAt: new Date()
                });
            }

            await setDoc(doc(db, 'products', productId), {
                name: submission.productName,
                category: submission.category,
                barcode: submission.barcode || '',
                image: submission.imageUrl,
                active: true,
                submittedBy: submission.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await updateDoc(doc(db, 'product_submissions', submission.id), {
                status: 'approved',
                reviewedAt: new Date(),
                reviewedBy: currentUser.uid
            });

            const userRef = doc(db, 'users', submission.userId);
            const userDoc = await getDocs(collection(db, 'users'));
            const userData = userDoc.docs.find(d => d.id === submission.userId)?.data();

            if (userData) {
                await updateDoc(userRef, {
                    points: (userData.points || 0) + 20
                });
            }

            toast.success(`Product "${submission.productName}" approved!`);
            setSubmissions(submissions.map(s =>
                s.id === submission.id ? { ...s, status: 'approved' } : s
            ));
        } catch (error) {
            console.error('Error approving submission:', error);
            toast.error('Failed to approve product');
        }
    };

    const handleReject = async (submissionId) => {
        if (confirm('Are you sure you want to reject this product submission?')) {
            try {
                await updateDoc(doc(db, 'product_submissions', submissionId), {
                    status: 'rejected',
                    reviewedAt: new Date(),
                    reviewedBy: currentUser.uid
                });

                setSubmissions(submissions.map(s =>
                    s.id === submissionId ? { ...s, status: 'rejected' } : s
                ));

                toast.success('Product submission rejected');
            } catch (error) {
                console.error('Error rejecting submission:', error);
                toast.error('Failed to reject product');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Submissions</h1>
                    <p className="text-gray-600 mt-1">{submissions.length} total submissions</p>
                </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by product, category, or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                <img
                                    src={submission.imageUrl}
                                    alt={submission.productName}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="flex items-center justify-center text-gray-400"><svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>';
                                    }}
                                />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{submission.productName}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Category:</span>
                                    <span className="font-medium">{submission.category}</span>
                                </div>
                                {submission.barcode && (
                                    <div className="flex justify-between">
                                        <span>Barcode:</span>
                                        <span className="font-medium font-mono text-xs bg-gray-100 px-1 rounded">{submission.barcode}</span>
                                    </div>
                                )}
                                {submission.newCategory && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                        <span className="text-yellow-800 text-xs font-medium">New Category: {submission.category}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Submitted by:</span>
                                    <span className="font-medium">{submission.userName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Date:</span>
                                    <span className="font-medium">
                                        {submission.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Status:</span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${submission.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : submission.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {submission.status}
                                    </span>
                                </div>
                            </div>

                            {submission.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprove(submission)}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check className="h-4 w-4" />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(submission.id)}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {filteredSubmissions.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                            No {filterStatus !== 'all' ? filterStatus : ''} product submissions found
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
