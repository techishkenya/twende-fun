import { SUPERMARKETS } from '../lib/types';
import { MapPin, Clock, ThumbsUp } from 'lucide-react';
import clsx from 'clsx';

export default function PriceCard({ price, isCheapest }) {
    const supermarket = SUPERMARKETS.find(s => s.id === price.supermarket_id);

    // Format price to KES
    const formattedPrice = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0
    }).format(price.price);

    return (
        <div className={clsx(
            "relative p-4 rounded-2xl border transition-all duration-200",
            isCheapest
                ? "bg-green-50 border-green-200 shadow-md ring-1 ring-green-100"
                : "bg-white border-gray-100 shadow-sm hover:shadow-md"
        )}>
            {isCheapest && (
                <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    Best Price
                </div>
            )}

            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <div className={clsx(
                        "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm",
                        `bg-${supermarket?.color || 'gray-500'}`
                    )}>
                        {supermarket?.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{supermarket?.name}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                            <MapPin className="h-3 w-3 mr-1" />
                            {price.location_id}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className={clsx(
                        "text-xl font-bold font-display",
                        isCheapest ? "text-green-600" : "text-gray-900"
                    )}>
                        {formattedPrice}
                    </div>
                    <div className="flex items-center justify-end text-xs text-gray-400 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(price.timestamp).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {price.verified && (
                <div className="mt-3 flex items-center text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded-lg w-fit">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Verified by {price.confidence_score} users
                </div>
            )}
        </div>
    );
}
