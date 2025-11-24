import { CATEGORIES } from '../lib/types';
import { Milk, Coffee, Cookie, Home, User, ShoppingBag, Apple } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Map categories to icons
const categoryIcons = {
    'Dairy': Milk,
    'Beverages': Coffee,
    'Snacks': Cookie,
    'Household': Home,
    'Personal Care': User,
    'Pantry': ShoppingBag,
    'Fresh Produce': Apple
};

export default function CategoryGrid() {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {CATEGORIES.map((category) => {
                const Icon = categoryIcons[category] || ShoppingBag;
                return (
                    <button
                        key={category}
                        onClick={() => navigate(`/search?category=${encodeURIComponent(category)}`)}
                        className="flex flex-col items-center justify-center p-3 md:p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                        <div className="p-3 md:p-4 bg-primary-50 text-primary-600 rounded-full mb-2 group-hover:bg-primary-100 transition-colors">
                            <Icon className="h-6 w-6 md:h-7 md:w-7" />
                        </div>
                        <span className="text-xs md:text-sm font-medium text-gray-600 text-center group-hover:text-gray-900">{category}</span>
                    </button>
                );
            })}
        </div>
    );
}
