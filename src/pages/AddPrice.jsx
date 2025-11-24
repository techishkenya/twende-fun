import { useState, useEffect } from 'react';
import { Camera, Upload, MapPin, Loader2, Search, Check, ArrowLeft, LogIn, User } from 'lucide-react';
import { SUPERMARKETS } from '../lib/types';
import { FMCG_PRODUCTS } from '../lib/products';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AddPrice() {
    const navigate = useNavigate();
    const { currentUser, loginWithGoogle } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    // Form State
    const [productName, setProductName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [price, setPrice] = useState('');
    const [supermarket, setSupermarket] = useState('');
    const [location, setLocation] = useState('');

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Failed to login', error);
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-24">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-primary-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-500 mb-6">You need to be logged in to contribute prices to the community.</p>

                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    const handleProductSearch = (e) => {
        const value = e.target.value;
        setProductName(value);

        if (value.length > 1) {
            const filtered = FMCG_PRODUCTS.filter(p =>
                p.name.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectProduct = (product) => {
        setProductName(product.name);
        setShowSuggestions(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                // Simulate OCR
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    setStep(2);
                    // Mock OCR result
                    setProductName('Jogoo Maize Meal 2kg');
                    setPrice('230');
                }, 2000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate('/');
        }, 1500);
    };

    return (
        <div className="pb-20">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-display font-bold text-gray-900">Add New Price</h1>
            </div>

            <div className="p-4 max-w-md mx-auto">
                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center">
                            <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <Camera className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Scan Price Tag</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-6">Take a photo to automatically extract details</p>

                            <label className="block w-full">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                <span className="block w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg active:scale-95 transition-transform cursor-pointer">
                                    Take Photo
                                </span>
                            </label>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-50 text-gray-500">Or enter manually</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Skip to Form
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {image && (
                            <div className="h-32 w-full rounded-xl overflow-hidden mb-6 relative">
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => { setImage(null); setStep(1); }}
                                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full"
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={productName}
                                    onChange={handleProductSearch}
                                    className="block w-full p-3 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. Jogoo Maize Meal"
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute z-20 w-full bg-white mt-1 rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                                        {suggestions.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => selectProduct(p)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm border-b border-gray-50 last:border-0"
                                            >
                                                <div className="font-medium text-gray-900">{p.name}</div>
                                                <div className="text-xs text-gray-500">{p.category}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="0"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supermarket</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                                    value={supermarket}
                                    onChange={e => setSupermarket(e.target.value)}
                                >
                                    <option value="">Select...</option>
                                    {SUPERMARKETS.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Branch</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                    placeholder="e.g. Westlands"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                                <>
                                    <Check className="h-5 w-5 mr-2" />
                                    Submit Price
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
