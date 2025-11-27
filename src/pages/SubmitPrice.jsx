import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, Camera, MapPin, Search, Loader2, Upload, Plus } from 'lucide-react';
import { SUPERMARKETS } from '../lib/types';
import toast from 'react-hot-toast';
import NewProductModal from '../components/NewProductModal';

export default function SubmitPrice() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedProductId = searchParams.get('productId');

    const [step, setStep] = useState(preselectedProductId ? 2 : 1);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewProductModal, setShowNewProductModal] = useState(false);

    // Form State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        supermarketId: '',
        branch: '',
        price: '',
        imageUrl: '', // For now, we'll just use a placeholder or text input if needed, or skip
        location: null
    });

    // Fetch products for search
    useEffect(() => {
        const fetchProducts = async () => {
            const q = query(collection(db, 'products'), where('active', '==', true));
            const snapshot = await getDocs(q);
            const prods = snapshot.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(p => p.isDemo !== true); // Filter out demo products
            setProducts(prods);

            if (preselectedProductId) {
                const found = prods.find(p => p.id === preselectedProductId);
                if (found) setSelectedProduct(found);
            }
        };
        fetchProducts();
    }, [preselectedProductId]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setStep(2);
    };

    const handleNewProductSubmit = async (productData) => {
        try {
            await addDoc(collection(db, 'product_submissions'), {
                userId: currentUser.uid,
                userName: currentUser.displayName,
                userEmail: currentUser.email,
                productName: productData.productName,
                barcode: productData.barcode || '',
                category: productData.category,
                newCategory: productData.isNewCategory ? productData.category : null,
                imageUrl: productData.imageUrl,
                status: 'pending',
                createdAt: new Date()
            });

            toast.success('Product submitted for review! Admins will review it soon.');
            setShowNewProductModal(false);
        } catch (error) {
            console.error('Error submitting product:', error);
            toast.error('Failed to submit product');
        }
    };

    const handleLocationClick = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            return;
        }

        toast.loading('Getting location...', { id: 'location' });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }));
                toast.success('Location added!', { id: 'location' });
            },
            () => {
                toast.error('Unable to retrieve your location', { id: 'location' });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error('You must be logged in to submit prices');
            navigate('/profile');
            return;
        }

        if (!selectedProduct || !formData.supermarketId || !formData.price) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'submissions'), {
                userId: currentUser.uid,
                userDisplayName: currentUser.displayName,
                userPhotoURL: currentUser.photoURL,
                productId: selectedProduct.id,
                productName: selectedProduct.name,
                productImage: selectedProduct.image,
                supermarketId: formData.supermarketId,
                branch: formData.branch,
                price: Number(formData.price),
                location: formData.location,
                status: 'pending',
                createdAt: new Date()
            });

            toast.success('Price submitted for review! +10 Points (pending)');
            navigate('/profile');
        } catch (error) {
            console.error('Error submitting price:', error);
            toast.error('Failed to submit price');
        } finally {
            setLoading(false);
        }
    };

    // Show login prompt if not authenticated
    if (!currentUser) {
        return (
            <div className="h-full bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
                    <p className="text-gray-600 mb-6">
                        Please log in to submit prices and help the community
                    </p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        Go to Login
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full mt-3 text-gray-600 font-medium py-3 hover:text-gray-900 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="text-gray-600">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Submit Price</h1>
                </div>
            </div>

            <div className="p-4 max-w-lg mx-auto">
                {step === 1 ? (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for a product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                autoFocus
                            />
                        </div>

                        <div className="space-y-2">
                            {/* Add New Product Button */}
                            <button
                                onClick={() => setShowNewProductModal(true)}
                                className="w-full bg-primary-50 border border-primary-200 text-primary-700 p-3 rounded-xl flex items-center gap-3 hover:bg-primary-100 transition-colors"
                            >
                                <div className="h-12 w-12 bg-primary-200 rounded-lg flex items-center justify-center">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-medium">Add New Product</h3>
                                    <p className="text-xs text-primary-600">Product not listed? Submit it for review</p>
                                </div>
                            </button>

                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductSelect(product)}
                                    className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 active:bg-gray-50 cursor-pointer"
                                >
                                    <img src={product.image} alt={product.name} className="h-12 w-12 object-contain" />
                                    <div>
                                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                                        <p className="text-xs text-gray-500">{product.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Selected Product */}
                        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                            <img src={selectedProduct.image} alt={selectedProduct.name} className="h-16 w-16 object-contain" />
                            <div>
                                <h3 className="font-bold text-gray-900">{selectedProduct.name}</h3>
                                <p className="text-sm text-gray-500">{selectedProduct.category}</p>
                            </div>
                        </div>

                        {/* Supermarket */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Supermarket</label>
                            <div className="grid grid-cols-2 gap-3">
                                {SUPERMARKETS.map(market => (
                                    <button
                                        key={market.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, supermarketId: market.id })}
                                        className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.supermarketId === market.id
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {market.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Branch (Optional) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Branch / Location Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Westlands, CBD, Karen"
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Price (KES)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">KES</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-lg font-bold"
                                    required
                                />
                            </div>
                        </div>

                        {/* Evidence (Optional) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Evidence (Optional)</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="p-4 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-primary-500 transition-colors"
                                    onClick={() => toast('Photo upload coming soon!')}
                                >
                                    <Camera className="h-6 w-6 mb-1" />
                                    <span className="text-xs">Take Photo</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLocationClick}
                                    className={`p-4 border border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${formData.location
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-primary-500'
                                        }`}
                                >
                                    <MapPin className="h-6 w-6 mb-1" />
                                    <span className="text-xs">{formData.location ? 'Location Added' : 'Add Location'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit Price'}
                        </button>
                    </form>
                )}
            </div>

            {/* New Product Modal */}
            {showNewProductModal && (
                <NewProductModal
                    onClose={() => setShowNewProductModal(false)}
                    onSubmit={handleNewProductSubmit}
                />
            )}
        </div>
    );
}
