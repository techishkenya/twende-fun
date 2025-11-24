import { useNavigate } from 'react-router-dom';
import { Tag, Package } from 'lucide-react';

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 text-left w-full"
        >
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Package className="h-16 w-16 text-gray-300" />
                )}
                {/* Category Badge */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-primary-600" />
                        <span className="text-xs font-medium text-gray-700">{product.category}</span>
                    </div>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500">
                    Tap to compare prices
                </p>
            </div>
        </button>
    );
}
