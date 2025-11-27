import { Trophy, Medal, User } from 'lucide-react';

const MOCK_LEADERS = [
    { id: 1, name: 'Alice W.', points: 1250, contributions: 45, badge: 'Price Hunter' },
    { id: 2, name: 'John K.', points: 980, contributions: 32, badge: 'Magunas Maven' },
    { id: 3, name: 'Sarah M.', points: 850, contributions: 28, badge: 'Rookie' },
    { id: 4, name: 'David O.', points: 720, contributions: 25, badge: 'Rookie' },
    { id: 5, name: 'Grace N.', points: 650, contributions: 20, badge: 'Rookie' },
];

export default function Leaderboard() {
    return (
        <div>
            <div className="bg-primary-600 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg mb-6">
                <h1 className="text-2xl font-display font-bold text-center">Leaderboard</h1>
                <p className="text-primary-100 text-sm text-center mt-1">Top contributors this week</p>

                <div className="flex justify-center mt-8 space-x-4 items-end">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-primary-400 border-2 border-white flex items-center justify-center text-xl font-bold mb-2">
                            J
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-1">2nd</div>
                        <span className="text-sm font-medium">John K.</span>
                        <span className="text-xs text-primary-200">980 pts</span>
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center -mt-4">
                        <Trophy className="h-8 w-8 text-yellow-300 mb-2 drop-shadow-md" />
                        <div className="w-20 h-20 rounded-full bg-white border-4 border-yellow-400 text-primary-600 flex items-center justify-center text-2xl font-bold mb-2 shadow-lg">
                            A
                        </div>
                        <div className="bg-yellow-400 text-primary-900 px-4 py-1 rounded-full text-xs font-bold mb-1 shadow-sm">1st</div>
                        <span className="text-lg font-bold">Alice W.</span>
                        <span className="text-sm text-primary-100 font-bold">1250 pts</span>
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-primary-400 border-2 border-white flex items-center justify-center text-xl font-bold mb-2">
                            S
                        </div>
                        <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-1">3rd</div>
                        <span className="text-sm font-medium">Sarah M.</span>
                        <span className="text-xs text-primary-200">850 pts</span>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-3">
                {MOCK_LEADERS.slice(3).map((user, index) => (
                    <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <span className="text-gray-400 font-bold w-8">{index + 4}</span>
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold mr-3">
                            {user.name[0]}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{user.name}</h3>
                            <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                                {user.badge}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-gray-900">{user.points}</div>
                            <div className="text-xs text-gray-400">pts</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
