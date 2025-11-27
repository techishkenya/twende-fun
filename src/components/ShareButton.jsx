import { Share2, Check } from 'lucide-react';
import { useShare } from '../hooks/useShare';
import { useState } from 'react';
import { slugify } from '../lib/stringUtils';

export default function ShareButton({ product, price, supermarket, className = '' }) {
    const { handleShare, sharing } = useShare();
    const [showCopied, setShowCopied] = useState(false);

    const onShare = async (e) => {
        e.stopPropagation(); // Prevent parent click (e.g., card navigation)
        e.preventDefault();

        const shareData = {
            title: `Twende - ${product.name}`,
            text: `Check out ${product.name}! It's only KES ${price} at ${supermarket}. Compare prices here:`,
            url: `${window.location.origin}/product/${slugify(product.category)}/${product.id}`
        };

        const result = await handleShare(shareData);

        if (result.success && result.method === 'clipboard') {
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={onShare}
            disabled={sharing}
            className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center ${showCopied
                ? 'bg-green-100 text-green-600'
                : 'bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-primary-600 shadow-sm'
                } ${className}`}
            title="Share this deal"
        >
            {showCopied ? (
                <Check className="h-5 w-5" />
            ) : (
                <Share2 className="h-5 w-5" />
            )}
        </button>
    );
}
