import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Bell } from 'lucide-react';
import PriceCard from '../components/PriceCard';
import { ArrowLeft, MapPin, TrendingUp, TrendingDown, Minus, Share2, AlertCircle } from 'lucide-react';
import { useProduct, usePrices } from '../hooks/useFirestore';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { product, loading: productLoading, error: productError } = useProduct(id);
    const { prices, loading: pricesLoading } = usePrices(id);

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

    // Calculate price stats
    const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
    const lowestPrice = sortedPrices[0]?.price || 0;
    const highestPrice = sortedPrices[sortedPrices.length - 1]?.price || 0;
    const averagePrice = prices.length > 0
        ? Math.round(prices.reduce((acc, curr) => acc + curr.price, 0) / prices.length)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Image */}
            <div className="relative h-72 bg-white">
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6 text-gray-700" />
                        </button>
                        <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                            <Share2 className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="-mt-6 relative z-20 bg-gray-50 rounded-t-[2rem] px-6 pt-8">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {product.category}
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900 mt-3 mb-1">{product.name}</h1>
                        <p className="text-gray-500 text-sm">{product.size || 'Standard Size'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Best Price</p>
                        <p className="text-2xl font-bold text-green-600">KES {lowestPrice}</p>
                    </div>
                </div>

                {/* Price Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 mb-1">Average</p>
                        <p className="font-bold text-gray-900">{averagePrice}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 mb-1">Highest</p>
                        <p className="font-bold text-gray-900">{highestPrice}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-xs text-gray-500 mb-1">Entries</p>
                        <p className="font-bold text-gray-900">{prices.length}</p>
                    </div>
                </div>

                {/* Price List */}
                <h2 className="text-lg font-bold text-gray-900 mb-4">Current Prices</h2>
                <div className="space-y-4">
                    {pricesLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        </div>
                    ) : prices.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No prices found for this product yet.</p>
                            <button
                                onClick={() => navigate('/add-price')}
                                className="mt-4 text-primary-600 font-semibold hover:text-primary-700"
                            >
                                Be the first to add a price
                            </button>
                        </div>
                    ) : (
                        prices.map((price) => (
                            <div key={price.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100`}>
                                        <Store className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 capitalize">{price.supermarketId}</h3>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {price.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-gray-900">KES {price.price}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(price.timestamp?.toDate()).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper component for store icon (if needed)
function Store({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
        </svg>
    );
}
