import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SubmissionCard from '../../components/SubmissionCard';
import toast from 'react-hot-toast';

export default function MySubmissions() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!currentUser) return;

            try {
                const q = query(
                    collection(db, 'submissions'),
                    where('userId', '==', currentUser.uid),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(q);
                const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSubmissions(subs);
            } catch (error) {
                console.error('Error fetching submissions:', error);
                toast.error('Failed to load submissions');
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [currentUser]);

    const handleEdit = () => {
        // For now, just show a toast. In a real app, we'd navigate to an edit form.
        toast('Edit feature coming soon!', { icon: '🚧' });
    };

    if (!currentUser) return null;

    return (
        <div className="bg-gray-50">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">My Submissions</h1>
            </div>

            <div className="p-4 max-w-lg mx-auto space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
                    </div>
                ) : submissions.length > 0 ? (
                    submissions.map(sub => (
                        <SubmissionCard
                            key={sub.id}
                            submission={sub}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Submissions Yet</h3>
                        <p className="text-gray-500 mb-6">Start contributing prices to earn points!</p>
                        <button
                            onClick={() => navigate('/add-price')}
                            className="bg-primary-600 text-white font-bold py-2 px-6 rounded-full hover:bg-primary-700 transition-colors"
                        >
                            Submit a Price
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
