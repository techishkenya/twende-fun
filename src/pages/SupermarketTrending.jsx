import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SUPERMARKETS } from '../lib/types';

export default function SupermarketTrending() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showAllLocations, setShowAllLocations] = useState(false);

    // Find the supermarket
    const supermarket = SUPERMARKETS.find(s => s.id === id);

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

    const [trendingItems, setTrendingItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Fetch products that are either manually trending OR have high views
                // Note: Complex OR queries are limited in Firestore, so we'll fetch top viewed and filter client-side or do two queries

                // For simplicity and robustness without complex indexes:
                // Fetch all products, sort by a score (isTrending * 1000 + viewCount)
                const snapshot = await getDocs(collection(db, 'products'));
                const allProducts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Calculate a "trending score"
                const scoredProducts = allProducts.map(p => ({
                    ...p,
                    score: (p.isTrending ? 10000 : 0) + (p.viewCount || 0)
                }));

                // Sort by score desc
                scoredProducts.sort((a, b) => b.score - a.score);

                // Take top 20
                const topProducts = scoredProducts.slice(0, 20);

                // Now fetch prices for these products to display current price
                // This is N+1 but for 20 items it's acceptable for now, or we could store cached price in product
                // Assuming we need to fetch prices:
                const itemsWithPrices = await Promise.all(topProducts.map(async (p) => {
                    // Fetch price for THIS supermarket
                    // If we stored prices in a subcollection or separate collection 'prices'
                    // We need to find the price document for this product
                    try {
                        const priceDoc = await getDoc(doc(db, 'prices', p.id));
                        if (priceDoc.exists()) {
                            const pricesData = priceDoc.data().prices;
                            const myPrice = pricesData[id]?.price || 0;
                            return {
                                ...p,
                                currentPrice: myPrice,
                                trend: 'stable', // We'd need historical data for real trend, mocking for now
                                priceChange: 0,
                                priceChangePercent: 0
                            };
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    return { ...p, currentPrice: 0, trend: 'stable', priceChange: 0, priceChangePercent: 0 };
                }));

                setTrendingItems(itemsWithPrices.filter(p => p.currentPrice > 0)); // Only show if it has a price here
            } catch (error) {
                console.error("Error fetching trending:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, [id]);
    const displayedLocations = showAllLocations ? supermarket.locations : supermarket.locations.slice(0, 6);

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

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="h-4 w-4 text-red-500" />;
            case 'down':
                return <TrendingDown className="h-4 w-4 text-green-500" />;
            default:
                return <Minus className="h-4 w-4 text-gray-400" />;
        }
    };

    const getTrendColor = (trend) => {
        switch (trend) {
            case 'up':
                return 'text-red-600 bg-red-50';
            case 'down':
                return 'text-green-600 bg-green-50';
            default:
                return 'text-gray-600 bg-gray-50';
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

                {/* Trending Items */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className={`h-5 w-5 ${getIconColor()}`} />
                        Trending Items
                    </h2>

                    <div className="space-y-3">
                        {trendingItems.map((item) => (
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
                                </div>

                                {/* Price & Trend */}
                                <div className="text-right flex-shrink-0">
                                    <div className="font-bold text-gray-900 text-lg">KES {item.currentPrice}</div>
                                    <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getTrendColor(item.trend)}`}>
                                        {getTrendIcon(item.trend)}
                                        {item.trend !== 'stable' && (
                                            <span>{Math.abs(item.priceChange)} ({Math.abs(item.priceChangePercent)}%)</span>
                                        )}
                                        {item.trend === 'stable' && <span>Stable</span>}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
