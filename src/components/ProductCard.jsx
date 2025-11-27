import { useNavigate } from 'react-router-dom';
import { usePrices, getCheapestPrice } from '../hooks/useFirestore';
import { SUPERMARKETS } from '../lib/types';
import { getSupermarketBranding } from '../lib/supermarketUtils';
import { slugify } from '../lib/stringUtils';
import { TrendingUp } from 'lucide-react';
import ShareButton from './ShareButton';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { prices } = usePrices(product.id);

    // Get cheapest price
    const cheapest = prices ? getCheapestPrice(prices) : null;
    const cheapestPrice = cheapest?.price || 0;
    const cheapestSupermarket = cheapest?.supermarket || '';
    const supermarketName = SUPERMARKETS.find(s => s.id === cheapestSupermarket)?.name || '';

    const branding = getSupermarketBranding(cheapestSupermarket);
    const { colors } = branding;

    return (
        <div
            onClick={() => navigate(`/product/${slugify(product.category)}/${product.id}`)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative"
        >
            {/* Product Image */}
            <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors relative">
                {/* Share Button - Top Left */}
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ShareButton
                        product={product}
                        price={cheapestPrice}
                        supermarket={supermarketName}
                    />
                </div>

                {cheapestPrice > 0 && (
                    <div className={`absolute top-2 right-2 ${colors.bg} text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm z-10`}>
                        <TrendingUp className="h-3 w-3" />
                        BEST PRICE
                    </div>
                )}
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                />
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors text-sm">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{product.category}</p>

                {cheapestPrice > 0 ? (
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xs text-gray-500 font-medium">Best:</span>
                            <p className={`text-lg font-bold ${colors.text}`}>
                                KES {cheapestPrice}
                            </p>
                        </div>
                        <p className={`text-sm font-bold ${colors.text} mt-0.5`}>
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
