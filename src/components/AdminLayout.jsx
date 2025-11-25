import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
    LayoutDashboard,
    Package,
    Store,
    UserCheck,
    Users,
    LogOut,
    Menu,
    X,
    TrendingUp,
    Server,
    User,
    Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!currentUser) {
                navigate('/admin/login');
                return;
            }

            try {
                // Check if user has admin role in Firestore
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists() && userDoc.data().role === 'admin') {
                    setIsAdmin(true);

                    // Log admin access
                    // We use a session storage flag to prevent logging on every page refresh/navigation within the session
                    const hasLoggedSession = sessionStorage.getItem('adminSessionLogged');
                    if (!hasLoggedSession) {
                        try {
                            await addDoc(collection(db, 'admin_access_logs'), {
                                uid: currentUser.uid,
                                email: currentUser.email,
                                timestamp: new Date(),
                                userAgent: navigator.userAgent
                            });
                            sessionStorage.setItem('adminSessionLogged', 'true');
                        } catch (logError) {
                            console.error('Error logging access:', logError);
                        }
                    }
                } else {
                    console.error('Access denied: User is not an admin');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [currentUser, navigate]);

    const handleLogout = async () => {
        try {
            sessionStorage.removeItem('adminSessionLogged');
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAdmin) return null;

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/supermarkets', label: 'Supermarkets', icon: Store },
        { path: '/admin/submissions', label: 'Submissions', icon: UserCheck },
        { path: '/admin/users', label: 'Users', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h1 className="text-xl font-bold text-primary-600">Twende Admin</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-50 text-primary-700 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Info & Logout */}
                    <div className="p-4 border-t space-y-2">
                        <Link
                            to="/admin/data-utility"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <Server className="h-4 w-4" />
                            <span>Data Utility</span>
                        </Link>

                        <Link
                            to="/"
                            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>View Public Site</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            {/* History Navigation */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 hover:text-gray-900"
                                    title="Go Back"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => navigate(1)}
                                    className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600 hover:text-gray-900"
                                    title="Go Forward"
                                >
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Profile Dropdown / Link */}
                            <Link
                                to="/admin/profile"
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
                            >
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                                        {currentUser?.displayName || 'Admin User'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {currentUser?.email}
                                    </div>
                                </div>
                                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm group-hover:border-primary-100 transition-colors">
                                    <User className="h-5 w-5 text-primary-600" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                ></div>
            )}
        </div>
    );
}
