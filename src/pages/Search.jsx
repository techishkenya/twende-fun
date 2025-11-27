import { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useFirestore';
import { CATEGORIES } from '../lib/types';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { products, loading } = useProducts();

    // Read category from URL on mount
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam && CATEGORIES.includes(categoryParam)) {
            const timer = setTimeout(() => setActiveCategory(categoryParam), 0);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const filteredProducts = products.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
        return matchesQuery && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Search Header */}
            <div className="bg-white sticky top-0 z-30 px-4 md:px-6 lg:px-8 py-4 md:py-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-primary-500"
                            autoFocus
                        />
                    </div>
                    <button className="p-3 bg-gray-100 rounded-xl text-gray-600">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>

                {/* Categories Scroll */}
                <div className="flex gap-2 overflow-x-auto md:flex-wrap pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveCategory('All')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === 'All'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All
                    </button>
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="p-4 md:p-6 lg:p-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No products found{query && ` matching "${query}"`}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
