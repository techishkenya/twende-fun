import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, TrendingUp, TrendingDown, Minus, Share2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PriceCard from '../components/PriceCard';
import { useProduct, usePrices } from '../hooks/useFirestore';
import { SUPERMARKETS } from '../lib/types';

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

    // Prepare price history data for chart
    const priceHistory = prices
        .map(price => ({
            date: price.timestamp?.toDate?.()?.toLocaleDateString() || 'N/A',
            price: price.price,
            supermarket: SUPERMARKETS.find(s => s.id === price.supermarketId)?.name || 'Unknown',
            timestamp: price.timestamp?.toDate?.() || new Date()
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Header Image */}
            <div className="relative h-72 bg-white">
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
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

                {/* Product Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-48 w-48 object-contain"
                    />
                </div>
            </div>

            {/* Product Info */}
            <div className="px-4 md:px-6 lg:px-8 -mt-6 relative z-10">
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {product.category}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Price History Graph */}
                {priceHistory.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mt-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Price History</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={priceHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    label={{ value: 'Price (KES)', angle: -90, position: 'insideLeft' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    dot={{ fill: '#2563eb', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Price (KES)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Current Prices */}
                <div className="mt-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Current Prices</h2>
                    {pricesLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : prices.length > 0 ? (
                        <div className="space-y-3">
                            {sortedPrices.map((price, index) => (
                                <PriceCard
                                    key={price.id}
                                    price={price}
                                    isCheapest={index === 0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                            <p className="text-gray-500">No prices available for this product yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
