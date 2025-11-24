import { useNavigate } from 'react-router-dom';
import { Store, MapPin } from 'lucide-react';

export default function SupermarketCard({ supermarket }) {
    const navigate = useNavigate();

    // Get color classes based on supermarket
    const getColors = () => {
        switch (supermarket.id) {
            case 'carrefour':
                return {
                    bgLight: 'bg-blue-50',
                    bg: 'bg-blue-600',
                    text: 'text-blue-600'
                };
            case 'naivas':
                return {
                    bgLight: 'bg-orange-50',
                    bg: 'bg-orange-500',
                    text: 'text-orange-500'
                };
            case 'quickmart':
                return {
                    bgLight: 'bg-yellow-50',
                    bg: 'bg-yellow-500',
                    text: 'text-yellow-600'
                };
            case 'magunas':
                return {
                    bgLight: 'bg-red-50',
                    bg: 'bg-red-600',
                    text: 'text-red-600'
                };
            default:
                return {
                    bgLight: 'bg-primary-50',
                    bg: 'bg-primary-600',
                    text: 'text-primary-600'
                };
        }
    };

    const colors = getColors();

    return (
        <div
            onClick={() => navigate(`/supermarket/${supermarket.id}`)}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex items-start gap-4">
                {/* Logo */}
                <div className={`w-16 h-16 rounded-xl ${colors.bgLight} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                        <Store className="h-6 w-6 text-white" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{supermarket.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{supermarket.description}</p>

                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        <span>{supermarket.locations.length} branches</span>
                    </div>
                </div>

                {/* Arrow */}
                <div className={`${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
