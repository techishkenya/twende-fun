import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Calendar, MapPin } from 'lucide-react';

export default function Submissions() {
    const navigate = useNavigate();

    const mockSubmissions = [
        { id: 1, product: 'Jogoo Maize Meal 2kg', price: 230, supermarket: 'Naivas', location: 'Westlands', date: '2024-11-20' },
        { id: 2, product: 'Kabras Sugar 1kg', price: 210, supermarket: 'Carrefour', location: 'Junction', date: '2024-11-19' },
        { id: 3, product: 'Fresh Fri Cooking Oil 1L', price: 340, supermarket: 'Quickmart', location: 'CBD', date: '2024-11-18' },
    ];

    return (
        <div className="pb-20 min-h-screen bg-gray-50">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-display font-bold text-gray-900">My Submissions</h1>
            </div>

            <div className="p-4 space-y-3">
                {mockSubmissions.map((submission) => (
                    <div key={submission.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 bg-primary-50 rounded-lg flex items-center justify-center">
                                    <Package className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">{submission.product}</h3>
                                    <p className="text-xs text-gray-500">{submission.supermarket}</p>
                                </div>
                            </div>
                            <span className="font-bold text-primary-600 text-sm">KES {submission.price}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{submission.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{submission.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
