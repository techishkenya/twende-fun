import { useNavigate } from 'react-router-dom';
import { usePrices, getCheapestPrice, getSupermarketColor } from '../hooks/useFirestore';
import { SUPERMARKETS } from '../lib/types';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { prices } = usePrices(product.id);

    // Get cheapest price
    const cheapest = prices ? getCheapestPrice(prices) : null;
    const cheapestPrice = cheapest?.price || 0;
    const cheapestSupermarket = cheapest?.supermarket || '';
    const supermarketName = SUPERMARKETS.find(s => s.id === cheapestSupermarket)?.name || '';
    const colorClass = getSupermarketColor(cheapestSupermarket);

    return (
        <div
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
        >
            {/* Product Image */}
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                />
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{product.category}</p>

                {cheapestPrice > 0 ? (
                    <div>
                        <p className={`text-lg font-bold text-${colorClass}`}>
                            From KES {cheapestPrice}
                        </p>
                        <p className="text-xs text-gray-500">
                            at {supermarketName}
                        </p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">Price not available</p>
                )}
            </div>
        </div>
    );
}
