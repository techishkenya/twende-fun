import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Bell } from 'lucide-react';
import PriceCard from '../components/PriceCard';
import { SUPERMARKETS } from '../lib/types';
import { FMCG_PRODUCTS } from '../lib/products';

// Mock Prices - in real app, these would be fetched from Firebase based on product_id
const MOCK_PRICES = [
    { id: 'p1', product_id: '1', supermarket_id: 'carrefour', location_id: 'Two Rivers', price: 65, timestamp: '2023-11-24', verified: true, confidence_score: 12 },
    { id: 'p2', product_id: '1', supermarket_id: 'naivas', location_id: 'Westlands', price: 68, timestamp: '2023-11-23', verified: true, confidence_score: 8 },
    { id: 'p3', product_id: '1', supermarket_id: 'quickmart', location_id: 'Kilimani', price: 65, timestamp: '2023-11-24', verified: false, confidence_score: 2 },
    { id: 'p4', product_id: '1', supermarket_id: 'magunas', location_id: 'Kahawa', price: 62, timestamp: '2023-11-22', verified: true, confidence_score: 15 },
];

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prices] = useState(MOCK_PRICES);

    // Find the actual product from the products list
    const product = FMCG_PRODUCTS.find(p => p.id === id);

    // If product not found, show error
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
                    <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
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

    // Find cheapest price
    const minPrice = Math.min(...prices.map(p => p.price));

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Image */}
            <div className="relative h-64 bg-gray-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/30 to-transparent">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 hover:bg-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex space-x-2">
                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 hover:bg-white transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-900 hover:bg-white transition-colors">
                            <Share2 className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="px-5 py-6 -mt-6 relative bg-white rounded-t-[2rem] shadow-sm">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <span className="text-xs font-bold tracking-wider text-primary-600 uppercase bg-primary-50 px-3 py-1 rounded-full">
                    {product.category}
                </span>

                <h1 className="mt-3 text-2xl font-display font-bold text-gray-900 leading-tight">
                    {product.name}
                </h1>

                <div className="mt-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Live Prices</h2>
                    <div className="space-y-3">
                        {prices
                            .sort((a, b) => a.price - b.price)
                            .map((price) => (
                                <PriceCard
                                    key={price.id}
                                    price={price}
                                    isCheapest={price.price === minPrice}
                                />
                            ))}
                    </div>
                </div>

                {/* History Graph Placeholder */}
                <div className="mt-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Price History</h2>
                    <div className="h-40 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        Price trend graph coming soon
                    </div>
                </div>
            </div>
        </div>
    );
}
