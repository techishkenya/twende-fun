import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, Clock, X, ArrowLeft } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { FMCG_PRODUCTS } from '../lib/products';
import SwipeableCard from '../components/SwipeableCard';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);

    // Mock Data for Frequent & Trending
    const [recentSearches, setRecentSearches] = useState(['Milk', 'Bread', 'Sugar', 'Cooking Oil']);
    const [trendingProducts, setTrendingProducts] = useState([
        { id: 'tr-1', name: 'Jogoo Maize Meal 2kg', price: 'KES 230', change: '-5%' },
        { id: 'tr-2', name: 'Kabras Sugar 1kg', price: 'KES 210', change: '-2%' },
        { id: 'tr-3', name: 'Fresh Fri 1L', price: 'KES 340', change: '+1%' },
    ]);

    useEffect(() => {
        if (query) {
            const filtered = FMCG_PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    const removeRecent = (item) => {
        setRecentSearches(prev => prev.filter(i => i !== item));
    };

    const removeTrending = (id) => {
        setTrendingProducts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="pb-20 min-h-screen bg-gray-50">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <SearchBar initialValue={query} />
                </div>
            </div>

            <div className="p-4">
                {query ? (
                    <>
                        <h2 className="text-sm font-medium text-gray-500 mb-4">
                            {results.length} results for "{query}"
                        </h2>
                        <div className="space-y-3">
                            {results.map(product => (
                                <Link
                                    key={product.id}
                                    to={`/product/${product.id}`}
                                    className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
                                >
                                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                                    <div className="ml-4 flex-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                                        <span className="text-xs text-gray-500">{product.category}</span>
                                        <div className="mt-1 font-bold text-primary-600 text-xs">
                                            View Prices
                                        </div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-300" />
                                </Link>
                            ))}
                            {results.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <Search className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-gray-900 font-bold">No results found</h3>
                                    <p className="text-gray-500 text-sm mt-1">Try searching for "Milk" or "Bread"</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="space-y-8">
                        {/* Frequent Searches */}
                        {recentSearches.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3 text-gray-800">
                                    <Clock className="h-4 w-4 text-primary-600" />
                                    <h2 className="font-bold text-sm">Frequent Searched</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map(term => (
                                        <SwipeableCard key={term} onDismiss={() => removeRecent(term)} className="inline-block">
                                            <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm text-gray-600 flex items-center gap-2">
                                                <Link to={`/search?q=${term}`}>{term}</Link>
                                                <button onClick={(e) => { e.preventDefault(); removeRecent(term); }} className="text-gray-400 hover:text-red-500">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </SwipeableCard>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Trending Section */}
                        {trendingProducts.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3 text-gray-800">
                                    <TrendingUp className="h-4 w-4 text-primary-600" />
                                    <h2 className="font-bold text-sm">Trending Now</h2>
                                </div>
                                <div className="space-y-3">
                                    {trendingProducts.map(product => (
                                        <SwipeableCard key={product.id} onDismiss={() => removeTrending(product.id)}>
                                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs font-bold text-primary-600">{product.price}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${product.change.startsWith('-') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {product.change}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="h-8 w-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </SwipeableCard>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
