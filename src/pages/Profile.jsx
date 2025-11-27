import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut, Award, ShoppingBag, ArrowLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TermsModal from '../components/auth/TermsModal';
import toast from 'react-hot-toast';

export default function Profile() {
    const { currentUser, loginWithGoogle, logout } = useAuth();
    const navigate = useNavigate();
    const [showTerms, setShowTerms] = useState(false);
    const [userStats, setUserStats] = useState({ points: 0, submissionCount: 0, level: 1 });
    const [loading, setLoading] = useState(false);

    // Fetch real user stats
    useEffect(() => {
        if (!currentUser) return;

        const userRef = doc(db, 'users', currentUser.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserStats({
                    points: data.points || 0,
                    submissionCount: data.submissionCount || 0,
                    level: Math.floor((data.points || 0) / 100) + 1 // Simple level logic: 1 level per 100 points
                });
            } else {
                // Create user doc if it doesn't exist (first time login)
                createUserDoc(currentUser);
            }
        });

        return () => unsubscribe();
    }, [currentUser]);

    const createUserDoc = async (user) => {
        try {
            await setDoc(doc(db, 'users', user.uid), {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                points: 0,
                submissionCount: 0,
                joinedAt: new Date(),
                role: 'user' // Default role
            });
        } catch (error) {
            console.error("Error creating user profile:", error);
        }
    };

    const handleLoginClick = () => {
        setShowTerms(true);
    };

    const handleTermsAccepted = async () => {
        setShowTerms(false);
        setLoading(true);
        try {
            await loginWithGoogle();
            toast.success('Welcome back!');
        } catch (error) {
            console.error('Failed to login', error);
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-24">
                <TermsModal
                    isOpen={showTerms}
                    onClose={() => setShowTerms(false)}
                    onAccept={handleTermsAccepted}
                />

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm text-center">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="h-10 w-10 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Twende</h1>
                    <p className="text-gray-500 mb-8">Sign in to track prices, earn points, and contribute to the community.</p>

                    <button
                        onClick={handleLoginClick}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        )}
                        {loading ? 'Signing in...' : 'Continue with Google'}
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        );
    }

    const stats = [
        { label: 'Points', value: userStats.points.toLocaleString(), icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { label: 'Contributions', value: userStats.submissionCount.toLocaleString(), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    ];

    return (
        <div className="pb-20">
            <div className="bg-white p-6 mb-2">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-display font-bold text-gray-900 flex-1">Profile</h1>
                    <Link to="/profile/edit" className="p-2 text-gray-400 hover:text-gray-600">
                        <Settings className="h-6 w-6" />
                    </Link>
                </div>

                <div className="flex items-center space-x-4 mb-8">
                    <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold border-4 border-white shadow-sm overflow-hidden">
                        {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-10 w-10" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-900">{currentUser.displayName || 'Price Hunter'}</h2>
                        </div>
                        <p className="text-gray-500 text-sm">{currentUser.email}</p>
                        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Level {userStats.level} Contributor
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center bg-white">
                            <div className={`p - 3 rounded - full ${stat.bg} ${stat.color} mb - 2`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <Link to="/profile/submissions" className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-700">My Submissions</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                    <Link to="/profile/achievements" className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-700">Achievements</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                    <Link to="/help" className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-700">Help & Support</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Link>
                </div>

                <button
                    onClick={logout}
                    className="mt-8 w-full flex items-center justify-center p-4 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut className="h-5 w-5 mr-2" />
                    Log Out
                </button>
            </div>
        </div>
    );
}
