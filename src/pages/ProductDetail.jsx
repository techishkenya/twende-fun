import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Share2, AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import { useProduct, usePrices, getCheapestPrice, getSupermarketColor } from '../hooks/useFirestore';
import { SUPERMARKETS } from '../lib/types';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, loading: productLoading, error: productError } = useProduct(id);
    const { prices, loading: pricesLoading } = usePrices(id);

    // Increment view count on load
    useEffect(() => {
        if (id) {
            const incrementView = async () => {
                try {
                    const productRef = doc(db, 'products', id);
                    await updateDoc(productRef, {
                        viewCount: increment(1)
                    });
                } catch (error) {
                    console.error('Error incrementing view count:', error);
                }
            };
            incrementView();
        }
    }, [id]);

    if (productLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (productError || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700"
                >
                    Go Home
                </button>
            </div>
        );
    }

    // Get cheapest price
    const cheapest = prices ? getCheapestPrice(prices) : null;
    const cheapestPrice = cheapest?.price || 0;
    const cheapestSupermarket = cheapest?.supermarket || '';

    // Calculate stats
    const priceValues = prices ? Object.values(prices).map(p => p.price) : [];
    const highestPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;
    const averagePrice = priceValues.length > 0
        ? Math.round(priceValues.reduce((a, b) => a + b, 0) / priceValues.length)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Header */}
            <div className="relative bg-white">
                <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-start z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-900" />
                    </button>
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                        <Share2 className="h-6 w-6 text-gray-900" />
                    </button>
                </div>

                {/* Product Image */}
                <div className="flex items-center justify-center py-16 md:py-20">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-48 w-48 md:h-64 md:w-64 object-contain"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
                {/* Product Info */}
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 -mt-6 relative z-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <Link
                        to={`/search?category=${encodeURIComponent(product.category)}`}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
                    >
                        {product.category}
                    </Link>

                    {/* Price Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Best Price</p>
                            <p className={`text-lg font-bold text-${getSupermarketColor(cheapestSupermarket)}`}>
                                KES {cheapestPrice}
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Average</p>
                            <p className="text-lg font-bold text-gray-900">KES {averagePrice}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Highest</p>
                            <p className="text-lg font-bold text-gray-900">KES {highestPrice}</p>
                        </div>
                    </div>
                </div>

                {/* Price Comparison */}
                {pricesLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : prices ? (
                    <div className="mt-6 space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Price Comparison</h2>

                        {Object.entries(prices).map(([supermarketId, priceData]) => {
                            const supermarket = SUPERMARKETS.find(s => s.id === supermarketId);
                            const isCheapest = supermarketId === cheapestSupermarket;
                            const colorClass = getSupermarketColor(supermarketId);

                            return (
                                <div
                                    key={supermarketId}
                                    className={`bg-white rounded-xl p-4 border-2 transition-all ${isCheapest
                                        ? `border-${colorClass} bg-${colorClass}/5`
                                        : 'border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-full bg-${colorClass} flex items-center justify-center text-white font-bold text-lg`}>
                                                {supermarket?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                    {supermarket?.name || supermarketId}
                                                    {isCheapest && (
                                                        <span className={`px-2 py-0.5 bg-${colorClass} text-white text-xs rounded-full flex items-center gap-1`}>
                                                            <TrendingUp className="h-3 w-3" />
                                                            Best Price
                                                        </span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {priceData.location || 'Location not specified'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${isCheapest ? `text-${colorClass}` : 'text-gray-900'}`}>
                                                KES {priceData.price}
                                            </p>
                                            {!isCheapest && cheapestPrice > 0 && (
                                                <p className="text-xs text-red-600">
                                                    +KES {priceData.price - cheapestPrice} more
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 mt-6">
                        <p className="text-gray-500">No prices available for this product yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
