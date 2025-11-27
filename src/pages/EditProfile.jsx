import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function EditProfile() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [name, setName] = useState(currentUser?.displayName || 'Guest User');
    const [phone, setPhone] = useState(currentUser?.phoneNumber || '+254 7XX XXX XXX');

    const handleSave = () => {
        // Mock save - in real app would update via Firebase
        alert('Profile updated successfully!');
        navigate('/profile');
    };

    return (
        <div className="bg-gray-50">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-display font-bold text-gray-900">Edit Profile</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold">
                            <User className="h-12 w-12" />
                        </div>
                        <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg">
                            <Camera className="h-4 w-4" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Tap to change photo</p>
                </div>

                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Phone Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                        placeholder="+254 7XX XXX XXX"
                    />
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-700 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
