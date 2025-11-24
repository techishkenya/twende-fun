import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, Search } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Search', path: '/search' },
        { icon: PlusCircle, label: 'Add Price', path: '/add-price', primary: true },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
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
                                    <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 rounded-full shadow-lg hover:from-primary-700 hover:to-secondary-700 transition-all">
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
                                    "flex flex-col items-center justify-center w-16 py-1 transition-colors",
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
