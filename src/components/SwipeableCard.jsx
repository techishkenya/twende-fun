import { useState, useRef } from 'react';
import { X } from 'lucide-react';

export default function SwipeableCard({ children, onDismiss, className = '' }) {
    const [offset, setOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startX = useRef(0);
    const cardRef = useRef(null);

    const handleTouchStart = (e) => {
        setIsDragging(true);
        startX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX.current;
        // Only allow swiping right or left
        setOffset(diff);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (Math.abs(offset) > 100) {
            // Dismiss threshold
            setOffset(offset > 0 ? 500 : -500); // Animate out
            setTimeout(() => {
                onDismiss && onDismiss();
            }, 300);
        } else {
            // Reset
            setOffset(0);
        }
    };

    return (
        <div
            ref={cardRef}
            className={`relative transition-transform duration-300 ease-out ${className}`}
            style={{
                transform: `translateX(${offset}px)`,
                opacity: Math.abs(offset) > 100 ? 0 : 1
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {children}
            {/* Visual cue for dismissal */}
            {Math.abs(offset) > 20 && (
                <div className={`absolute inset-y-0 flex items-center px-4 ${offset > 0 ? 'left-0 bg-red-500/10' : 'right-0 bg-red-500/10'} rounded-xl -z-10 w-full`}>
                    <X className="text-red-500" />
                </div>
            )}
        </div>
    );
}
