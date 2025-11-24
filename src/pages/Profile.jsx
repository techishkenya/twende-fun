import { useAuth } from '../context/AuthContext';
import { User, Settings, LogOut, Award, ShoppingBag, ArrowLeft, ChevronRight, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
    const { currentUser, loginWithGoogle, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-24">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm text-center">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="h-10 w-10 text-primary-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Twende</h1>
                    <p className="text-gray-500 mb-8">Sign in to track prices, earn points, and contribute to the community.</p>

                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>
                </div>
            </div>
        );
    }

    // Mock user data if not fully authenticated
    const user = currentUser;

    const stats = [
        { label: 'Points', value: '1,250', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        { label: 'Contributions', value: '45', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
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
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-10 w-10" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-900">{user.displayName || 'Price Hunter'}</h2>
                            <Link to="/profile/edit" className="text-primary-600 hover:text-primary-700">
                                <Settings className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="text-gray-500">{user.email}</p>
                        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            Level 5 Contributor
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center bg-white">
                            <div className={`p-3 rounded-full ${stat.bg} ${stat.color} mb-2`}>
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
