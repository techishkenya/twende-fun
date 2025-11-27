import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../lib/types';
import { Milk, Coffee, Cookie, Home, User, ShoppingBag, Apple, Baby } from 'lucide-react';

// Map categories to icons
const categoryIcons = {
    'Dairy': Milk,
    'Beverages': Coffee,
    'Snacks': Cookie,
    'Household': Home,
    'Personal Care': User,
    'Pantry': ShoppingBag,
    'Fresh Produce': Apple,
    'Baby Products': Baby
};

export default function CategoryGrid() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                if (!querySnapshot.empty) {
                    const cats = querySnapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        .filter(cat => cat.isDemo !== true) // Filter out demo categories
                        .map(cat => cat.name);
                    setCategories(cats.length > 0 ? cats : DEFAULT_CATEGORIES);
                } else {
                    setCategories(DEFAULT_CATEGORIES);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories(DEFAULT_CATEGORIES);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {categories.map((category) => {
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
