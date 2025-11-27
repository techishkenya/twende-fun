import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, writeBatch, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Check, X, Loader2, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { SUPERMARKETS } from '../../lib/types';

export default function SubmissionModeration() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const q = query(
                collection(db, 'submissions'),
                where('status', '==', 'pending'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            setSubmissions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (error) {
            console.error('Error fetching submissions:', error);
            toast.error('Failed to load submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (submission) => {
        setProcessingId(submission.id);
        try {
            const batch = writeBatch(db);

            // 1. Update Submission Status
            const subRef = doc(db, 'submissions', submission.id);
            batch.update(subRef, { status: 'approved', reviewedAt: new Date() });

            // 2. Update Product Price
            const priceRef = doc(db, 'prices', submission.productId);
            const priceDoc = await getDoc(priceRef);

            let currentPrices = {};
            if (priceDoc.exists()) {
                currentPrices = priceDoc.data().prices || {};
            }

            // Update specific supermarket price
            currentPrices[submission.supermarketId] = {
                price: submission.price,
                updatedAt: new Date(),
                location: submission.branch || '',
                verified: true // Community verified
            };

            batch.set(priceRef, {
                productId: submission.productId,
                prices: currentPrices,
                lastUpdated: new Date()
            }, { merge: true });

            // 3. Award Points to User
            const userRef = doc(db, 'users', submission.userId);
            batch.update(userRef, {
                points: increment(10),
                submissionCount: increment(1)
            });

            await batch.commit();

            toast.success('Submission approved & price updated!');
            setSubmissions(prev => prev.filter(s => s.id !== submission.id));
        } catch (error) {
            console.error('Error approving submission:', error);
            toast.error('Failed to approve submission');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (submission) => {
        if (!confirm('Are you sure you want to reject this submission?')) return;

        setProcessingId(submission.id);
        try {
            await updateDoc(doc(db, 'submissions', submission.id), {
                status: 'rejected',
                reviewedAt: new Date()
            });

            toast.success('Submission rejected');
            setSubmissions(prev => prev.filter(s => s.id !== submission.id));
        } catch (error) {
            console.error('Error rejecting submission:', error);
            toast.error('Failed to reject submission');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Submission Moderation</h1>

            {submissions.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                    <p className="text-gray-500">No pending submissions to review.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {submissions.map(sub => {
                        const supermarketName = SUPERMARKETS.find(s => s.id === sub.supermarketId)?.name || sub.supermarketId;

                        return (
                            <div key={sub.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={sub.productImage}
                                        alt={sub.productName}
                                        className="h-16 w-16 object-contain rounded-lg bg-gray-50"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900">{sub.productName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                            <span className="font-medium">{supermarketName}</span>
                                            {sub.branch && (
                                                <span className="flex items-center gap-1 text-gray-400">
                                                    <MapPin className="h-3 w-3" />
                                                    {sub.branch}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-lg font-bold text-primary-600">KES {sub.price}</span>
                                            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded-full">
                                                by {sub.userDisplayName}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleReject(sub)}
                                        disabled={processingId === sub.id}
                                        className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(sub)}
                                        disabled={processingId === sub.id}
                                        className="flex-1 md:flex-none px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processingId === sub.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        Approve
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
