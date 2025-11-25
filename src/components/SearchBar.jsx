import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function SearchBar({ className = '', initialValue = '' }) {
    const [queryText, setQueryText] = useState(initialValue);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (queryText.trim().length >= 2) {
                setLoading(true);
                try {
                    // Simple search implementation - in production use Algolia or similar
                    // Here we fetch all active products and filter client-side for "contains" search
                    // Firestore only supports "startsWith" natively efficiently
                    const q = query(collection(db, 'products'), where('active', '==', true));
                    const snapshot = await getDocs(q);

                    const searchLower = queryText.toLowerCase();
                    const filtered = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(p => p.name.toLowerCase().includes(searchLower) || p.category.toLowerCase().includes(searchLower))
                        .slice(0, 5); // Limit to 5 results

                    setResults(filtered);
                    setShowResults(true);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [queryText]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (queryText.trim()) {
            setShowResults(false);
            navigate(`/search?q=${encodeURIComponent(queryText)}`);
        }
    };

    const handleResultClick = (productId) => {
        setShowResults(false);
        navigate(`/product/${productId}`);
    };

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    onFocus={() => {
                        if (queryText.trim().length >= 2) setShowResults(true);
                    }}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-sm"
                    placeholder="Search products (e.g. Milk, Bread)..."
                />
                {queryText && (
                    <button
                        type="button"
                        onClick={() => {
                            setQueryText('');
                            setResults([]);
                            setShowResults(false);
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </form>

            {/* Live Results Dropdown */}
            {showResults && (
                <div className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                    {loading ? (
                        <div className="p-4 flex items-center justify-center text-gray-500">
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map((product) => (
                                <li key={product.id}>
                                    <button
                                        onClick={() => handleResultClick(product.id)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-10 w-10 object-contain rounded-md bg-white border border-gray-100"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.category}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={handleSubmit}
                                    className="w-full text-center py-3 text-sm text-primary-600 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    See all results for "{queryText}"
                                </button>
                            </li>
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No products found matching "{queryText}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
