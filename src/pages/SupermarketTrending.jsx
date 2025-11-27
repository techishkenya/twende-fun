import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, TrendingUp, ChevronDown, ChevronUp, Grid3x3 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SUPERMARKETS } from '../lib/types';
import { getCheapestPrice } from '../hooks/useFirestore';

export default function SupermarketTrending() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showAllLocations, setShowAllLocations] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [bestPriceProducts, setBestPriceProducts] = useState([]);
    const [categoryStats, setCategoryStats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Find the supermarket
    const supermarket = SUPERMARKETS.find(s => s.id === id);

    useEffect(() => {
        if (!supermarket) return;

        const fetchBestPrices = async () => {
            try {
                // Fetch all active products
                const productsSnapshot = await getDocs(collection(db, 'products'));
                const allProducts = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Fetch all prices
                const pricesSnapshot = await getDocs(collection(db, 'prices'));
                const allPrices = {};
                pricesSnapshot.docs.forEach(doc => {
                    allPrices[doc.id] = doc.data().prices;
                });

                // Find products where this supermarket has the best price
                const bestPriceItems = [];

                for (const product of allProducts) {
                    if (!product.active) continue;

                    const prices = allPrices[product.id];
                    if (!prices) continue;

                    // Get this supermarket's price
                    const myPrice = prices[id]?.price;
                    if (!myPrice || myPrice <= 0) continue;

                    // Find cheapest price across all supermarkets
                    const cheapest = getCheapestPrice(prices);

                    // Check if this supermarket has the best price
                    if (cheapest && cheapest.supermarket === id) {
                        bestPriceItems.push({
                            ...product,
                            currentPrice: myPrice,
                            location: prices[id]?.location || '',
                            score: (product.isTrending ? 10000 : 0) + (product.viewCount || 0)
                        });
                    }
                }

                // Sort by score
                bestPriceItems.sort((a, b) => b.score - a.score);

                // Calculate category stats
                const categoryMap = {};
                bestPriceItems.forEach(item => {
                    if (!categoryMap[item.category]) {
                        categoryMap[item.category] = 0;
                    }
                    categoryMap[item.category]++;
                });

                const stats = Object.entries(categoryMap)
                    .map(([category, count]) => ({ category, count }))
                    .sort((a, b) => b.count - a.count);

                setBestPriceProducts(bestPriceItems);
                setCategoryStats(stats);
            } catch (error) {
                console.error("Error fetching best prices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBestPrices();
    }, [id, supermarket]);

    if (!supermarket) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Supermarket Not Found</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }



    const displayedLocations = showAllLocations ? supermarket.locations : supermarket.locations.slice(0, 6);

    // Filter products by selected category
    const filteredProducts = selectedCategory
        ? bestPriceProducts.filter(p => p.category === selectedCategory)
        : bestPriceProducts;

    // Get color classes based on supermarket
    const getHeaderColor = () => {
        switch (id) {
            case 'carrefour': return 'from-blue-600 to-blue-700';
            case 'naivas': return 'from-orange-500 to-orange-600';
            case 'quickmart': return 'from-yellow-500 to-yellow-600';
            case 'magunas': return 'from-red-600 to-red-700';
            default: return 'from-primary-600 to-primary-700';
        }
    };

    const getBadgeColor = () => {
        switch (id) {
            case 'carrefour': return 'bg-blue-100 text-blue-700';
            case 'naivas': return 'bg-orange-100 text-orange-700';
            case 'quickmart': return 'bg-yellow-100 text-yellow-700';
            case 'magunas': return 'bg-red-100 text-red-700';
            default: return 'bg-primary-100 text-primary-700';
        }
    };

    const getIconColor = () => {
        switch (id) {
            case 'carrefour': return 'text-blue-600';
            case 'naivas': return 'text-orange-600';
            case 'quickmart': return 'text-yellow-600';
            case 'magunas': return 'text-red-600';
            default: return 'text-primary-600';
        }
    };

    const getButtonColor = () => {
        switch (id) {
            case 'carrefour': return 'text-blue-600 hover:text-blue-700';
            case 'naivas': return 'text-orange-600 hover:text-orange-700';
            case 'quickmart': return 'text-yellow-600 hover:text-yellow-700';
            case 'magunas': return 'text-red-600 hover:text-red-700';
            default: return 'text-primary-600 hover:text-primary-700';
        }
    };

    const getActiveBadgeColor = () => {
        switch (id) {
            case 'carrefour': return 'bg-blue-600 text-white';
            case 'naivas': return 'bg-orange-500 text-white';
            case 'quickmart': return 'bg-yellow-500 text-white';
            case 'magunas': return 'bg-red-600 text-white';
            default: return 'bg-primary-600 text-white';
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className={`bg-gradient-to-r ${getHeaderColor()} text-white p-6 pb-8 rounded-b-[2.5rem] shadow-lg`}>
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-display font-bold">{supermarket.name}</h1>
                        <p className="text-white/90 text-sm">{supermarket.description}</p>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-4 space-y-4">
                {/* Branch Locations Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <MapPin className={`h-5 w-5 ${getIconColor()}`} />
                            <h2 className="font-bold text-gray-900">Branch Locations</h2>
                        </div>
                        <span className="text-xs text-gray-500">{supermarket.locations.length} branches</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {displayedLocations.map((location, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1 ${getBadgeColor()} text-xs rounded-full font-medium`}
                            >
                                {location}
                            </span>
                        ))}
                    </div>

                    {supermarket.locations.length > 6 && (
                        <button
                            onClick={() => setShowAllLocations(!showAllLocations)}
                            className={`flex items-center gap-1 text-sm ${getButtonColor()} font-medium hover:underline`}
                        >
                            {showAllLocations ? (
                                <>
                                    <ChevronUp className="h-4 w-4" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-4 w-4" />
                                    Show All ({supermarket.locations.length - 6} more)
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Best Price Categories */}
                {!loading && categoryStats.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Grid3x3 className={`h-5 w-5 ${getIconColor()}`} />
                            <h2 className="font-bold text-gray-900">Best Price Categories</h2>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">
                            Categories where {supermarket.name} has the lowest prices
                        </p>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${!selectedCategory
                                    ? getActiveBadgeColor()
                                    : `${getBadgeColor()} hover:opacity-80`
                                    }`}
                            >
                                All ({bestPriceProducts.length})
                            </button>
                            {categoryStats.map(({ category, count }) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${selectedCategory === category
                                        ? getActiveBadgeColor()
                                        : `${getBadgeColor()} hover:opacity-80`
                                        }`}
                                >
                                    {category} ({count})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Best Price Products */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className={`h-5 w-5 ${getIconColor()}`} />
                        {selectedCategory ? `Best Prices: ${selectedCategory}` : 'All Best Prices'}
                    </h2>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/product/${item.id}`}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                                >
                                    {/* Product Image */}
                                    <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-gray-500">{item.category}</p>
                                        {item.location && (
                                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                <MapPin className="h-3 w-3" />
                                                {item.location}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="text-right flex-shrink-0">
                                        <div className="font-bold text-gray-900 text-lg">KES {item.currentPrice}</div>
                                        <div className={`text-[10px] px-2 py-0.5 rounded-full ${getActiveBadgeColor()} font-bold`}>
                                            BEST PRICE
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <TrendingUp className={`h-12 w-12 ${getIconColor()} mx-auto mb-3 opacity-50`} />
                                <p className="text-gray-500 font-medium">
                                    {selectedCategory
                                        ? `No best price items in ${selectedCategory}`
                                        : `No best price items at ${supermarket.name}`}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {selectedCategory
                                        ? 'Try selecting a different category'
                                        : 'This supermarket may have competitive prices on specific items'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
