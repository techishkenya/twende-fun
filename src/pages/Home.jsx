import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ScanLine, Bell, TrendingUp, ShoppingBag } from 'lucide-react';
import { useSupermarkets } from '../hooks/useFirestore';
import SearchBar from '../components/SearchBar';
import CategoryGrid from '../components/CategoryGrid';
import SupermarketCard from '../components/SupermarketCard';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const { supermarkets, loading: supermarketsLoading } = useSupermarkets();
    return (
        <div className="pb-8">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 md:p-8 lg:p-10 pb-12 md:pb-16 rounded-b-[2.5rem] shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold tracking-tight">TRACKER KE v1.0</h1>
                        <p className="text-blue-100 text-sm md:text-base">Compare prices, save money. 🚀</p>
                    </div>
                    <div className="h-10 w-10 md:h-12 md:w-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg md:text-xl font-bold">
                        T
                    </div>
                </div>
                <SearchBar />
            </header>

            {/* Content */}
            <div className="px-4 md:px-6 lg:px-8 -mt-6 relative z-10 space-y-6 md:space-y-8">

                {/* Categories Section */}
                <section className="bg-white rounded-2xl shadow-md p-5 md:p-6 lg:p-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Categories</h2>
                        <Link to="/search" className="text-primary-600 text-sm md:text-base font-medium hover:text-primary-700 transition-colors">
                            See All
                        </Link>
                    </div>
                    <CategoryGrid />
                </section>

                {/* Trending Section */}
                <section className="bg-white rounded-2xl shadow-md p-5 md:p-6 lg:p-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Supermarket Deals</h2>
                        <Link to="/search" className="text-primary-600 text-sm md:text-base font-medium hover:text-primary-700 transition-colors">
                            View More
                        </Link>
                    </div>

                    <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
                        {supermarketsLoading ? (
                            <div className="flex justify-center py-8 md:col-span-2 lg:col-span-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : (
                            supermarkets.map((supermarket) => (
                                <SupermarketCard key={supermarket.id} supermarket={supermarket} />
                            ))
                        )}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl shadow-lg p-6 md:p-8 lg:p-10 text-white text-center">
                    <h3 className="font-bold text-lg md:text-xl lg:text-2xl mb-2">Spot a Price Change?</h3>
                    <p className="text-blue-100 text-sm md:text-base mb-4 md:mb-6">Help the community by updating prices in your area.</p>
                    <Link to="/add-price" className="inline-block bg-white text-primary-600 px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors">
                        Add Price
                    </Link>
                </section>
            </div>
        </div>
    );
}
