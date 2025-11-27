import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, TrendingUp, Star, Target } from 'lucide-react';

export default function Achievements() {
    const navigate = useNavigate();

    const achievements = [
        { id: 1, title: 'First Submission', description: 'Submit your first price', icon: Star, earned: true, earnedDate: '2024-11-15' },
        { id: 2, title: 'Price Hunter', description: 'Submit 10 prices', icon: Target, earned: true, earnedDate: '2024-11-18' },
        { id: 3, title: 'Community Hero', description: 'Submit 50 prices', icon: TrendingUp, earned: false },
        { id: 4, title: 'Price Master', description: 'Submit 100 prices', icon: Award, earned: false },
    ];

    return (
        <div className="bg-gray-50">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-display font-bold text-gray-900">Achievements</h1>
            </div>

            <div className="p-4 space-y-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`bg-white p-5 rounded-xl shadow-sm border transition-all ${achievement.earned
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-gray-100 opacity-60'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`h-14 w-14 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                <achievement.icon className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                                {achievement.earned && achievement.earnedDate && (
                                    <p className="text-xs text-yellow-700 mt-2">Earned on {achievement.earnedDate}</p>
                                )}
                            </div>
                            {achievement.earned && (
                                <div className="text-yellow-500 text-2xl">🎖️</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
