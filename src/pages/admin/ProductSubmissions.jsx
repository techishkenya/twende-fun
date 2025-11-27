import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Package, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductSubmissions() {
    const { currentUser } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleApprove = async (submission) => {
        try {
            // Generate product ID
            const timestamp = new Date().getTime();
            const productId = submission.productName.toLowerCase().replace(/\s+/g, '-') + '-' + timestamp;

            // 1. Create new category if needed
            if (submission.newCategory) {
                const categoryId = submission.newCategory.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, 'categories', categoryId), {
                    name: submission.newCategory,
                    productCount: 1,
                    createdAt: new Date()
                });
            }

            // 2. Create product document
            await setDoc(doc(db, 'products', productId), {
                name: submission.productName,
                category: submission.category,
                image: submission.imageUrl,
                active: true,
                submittedBy: submission.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            // 3. Update submission status
            await updateDoc(doc(db, 'product_submissions', submission.id), {
                status: 'approved',
                reviewedAt: new Date(),
                reviewedBy: currentUser.uid
            });

            // 4. Award user points (20 points for new product)
            const userRef = doc(db, 'users', submission.userId);
            const userDoc = await getDocs(collection(db, 'users'));
            const userData = userDoc.docs.find(d => d.id === submission.userId)?.data();

            if (userData) {
                await updateDoc(userRef, {
                    points: (userData.points || 0) + 20
                });
            }

            toast.success(`Product "${submission.productName}" approved!`);

            // Update local state
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
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Submissions</h1>
                    <p className="text-gray-600 mt-1">{submissions.length} total submissions</p>
                </div>
            </div>

            {/* Submissions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {submissions.filter(s => s.status === 'pending').map((submission) => (
                    <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            {/* Product Image */}
                            <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                                <img
                                    src={submission.imageUrl}
                                    alt={submission.productName}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div class="text-gray-400"><Package class="h-12 w-12" /></div>';
                                    }}
                                />
                            </div>

                            {/* Product Info */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{submission.productName}</h3>
                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex justify-between">
                                    <span>Category:</span>
                                    <span className="font-medium">{submission.category}</span>
                                </div>
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
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleApprove(submission)}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    title="Approve"
                                >
                                    <Check className="h-4 w-4" />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(submission.id)}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                    title="Reject"
                                >
                                    <X className="h-4 w-4" />
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {submissions.filter(s => s.status === 'pending').length === 0 && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No pending product submissions</p>
                    </div>
                )}
            </div>

            {/* Reviewed Submissions */}
            {submissions.filter(s => s.status !== 'pending').length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Reviewed Submissions</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {submissions.filter(s => s.status !== 'pending').map((submission) => (
                                    <tr key={submission.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{submission.productName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{submission.category}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{submission.userName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${submission.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {submission.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {submission.reviewedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
