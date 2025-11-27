import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, Search } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
    const location = useLocation();
    // const { currentUser } = useAuth();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Search', path: '/search' },
        { icon: PlusCircle, label: 'Add Price', path: '/add-price', primary: true },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <main className="max-w-md mx-auto md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-h-screen bg-white md:shadow-xl overflow-hidden flex flex-col">
                <div className="flex-1">
                    <Outlet />
                </div>

                {/* Footer Links */}
                <div className="py-8 text-center text-gray-400 text-xs bg-gray-50 border-t border-gray-100">
                    <p>&copy; {new Date().getFullYear()} Twende. All rights reserved.</p>
                    <div className="mt-2 space-x-3">
                        <Link to="/how-it-works" className="hover:text-gray-600 transition-colors">How It Works</Link>
                        <span>•</span>
                        <Link to="/help" className="hover:text-gray-600 transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link to="/help" className="hover:text-gray-600 transition-colors">Terms</Link>
                    </div>
                </div>
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
                <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        if (item.primary) {
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex flex-col items-center justify-center -mt-8"
                                >
                                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 rounded-full shadow-lg hover:from-primary-700 hover:to-secondary-700 transition-all active:scale-95">
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 mt-1">{item.label}</span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex flex-col items-center justify-center w-16 py-1 transition-colors active:scale-95",
                                    isActive ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                <Icon className={clsx("h-6 w-6", isActive && "fill-current")} />
                                <span className="text-[10px] font-medium mt-1">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
