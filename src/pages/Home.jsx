import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import CategoryGrid from '../components/CategoryGrid';
import SupermarketCard from '../components/SupermarketCard';
import { SUPERMARKETS } from '../lib/types';

export default function Home() {
    return (
        <div className="pb-8">
            {/* Header */}
            <header className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-display font-bold tracking-tight">TRACKER KE</h1>
                        <p className="text-blue-100 text-sm">Compare prices, save money.</p>
                    </div>
                    <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-lg font-bold">
                        T
                    </div>
                </div>
                <SearchBar />
            </header>

            {/* Content */}
            <div className="px-4 -mt-6 relative z-10 space-y-6">

                {/* Categories Section */}
                <section className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Categories</h2>
                        <Link to="/search" className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors">
                            See All
                        </Link>
                    </div>
                    <CategoryGrid />
                </section>

                {/* Trending Section */}
                <section className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Supermarket Deals</h2>
                        <Link to="/search" className="text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors">
                            View More
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {SUPERMARKETS.map((supermarket) => (
                            <SupermarketCard key={supermarket.id} supermarket={supermarket} />
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-secondary-600 to-primary-600 rounded-2xl shadow-lg p-6 text-white text-center">
                    <h3 className="font-bold text-lg mb-2">Spot a Price Change?</h3>
                    <p className="text-blue-100 text-sm mb-4">Help the community by updating prices in your area.</p>
                    <Link to="/add-price" className="inline-block bg-white text-primary-600 px-6 py-2 rounded-full font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors">
                        Add Price
                    </Link>
                </section>
            </div>
        </div>
    );
}
