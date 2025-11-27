import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Plus, Edit2, Trash2, Search, X, MapPin, Loader2, Globe } from 'lucide-react';
import { getSupermarketInitials } from '../../lib/stringUtils';
import { searchSupermarketLocations } from '../../services/mapsService';

export default function SupermarketsManagement() {
    const [supermarkets, setSupermarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSupermarket, setEditingSupermarket] = useState(null);

    useEffect(() => {
        const fetchSupermarkets = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'supermarkets'));
                const supermarketsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSupermarkets(supermarketsList);
                setLoading(false);
            } catch {
                // console.error('Error fetching supermarkets:', error);
                setLoading(false);
            }
        };

        fetchSupermarkets();
    }, []);

    const filteredSupermarkets = useMemo(() => {
        return supermarkets.filter(supermarket =>
            supermarket.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [supermarkets, searchTerm]);

    const handleDelete = async (supermarketId) => {
        if (confirm('Are you sure you want to delete this supermarket? This will affect all associated prices.')) {
            try {
                await deleteDoc(doc(db, 'supermarkets', supermarketId));
                setSupermarkets(supermarkets.filter(s => s.id !== supermarketId));
            } catch {
                // console.error('Error deleting supermarket:', error);
                alert('Failed to delete supermarket');
            }
        }
    };

    const handleSave = async (supermarketData) => {
        try {
            if (editingSupermarket) {
                // Update existing supermarket
                await updateDoc(doc(db, 'supermarkets', editingSupermarket.id), {
                    ...supermarketData,
                    updatedAt: new Date()
                });
                setSupermarkets(supermarkets.map(s => s.id === editingSupermarket.id ? { ...s, ...supermarketData } : s));
                setEditingSupermarket(null);
            } else {
                // Add new supermarket
                const docRef = await addDoc(collection(db, 'supermarkets'), {
                    ...supermarketData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                setSupermarkets([...supermarkets, { id: docRef.id, ...supermarketData }]);
                setShowAddModal(false);
            }
        } catch {
            // console.error('Error saving supermarket:', error);
            alert('Failed to save supermarket');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Supermarkets Management</h1>
                    <p className="text-gray-600 mt-1">{supermarkets.length} total supermarkets</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Supermarket
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search supermarkets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
            </div>

            {/* Supermarkets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSupermarkets.map((supermarket) => (
                    <div key={supermarket.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className={`h-2 bg-${supermarket.color || 'blue-600'}`}></div>
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-full bg-${supermarket.color || 'blue-600'} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                                        {getSupermarketInitials(supermarket.name, supermarkets.map(s => s.name))}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-gray-900 truncate" title={supermarket.name}>{supermarket.name}</h3>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-2">
                                    <button
                                        onClick={() => setEditingSupermarket(supermarket)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(supermarket.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Locations */}
                            {supermarket.locations && supermarket.locations.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span className="font-medium">Locations:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {supermarket.locations.map((location, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                            >
                                                {location}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredSupermarkets.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <p className="text-gray-500">No supermarkets found</p>
                </div>
            )}

            {/* Add/Edit Modal */}
            {(showAddModal || editingSupermarket) && (
                <SupermarketModal
                    supermarket={editingSupermarket}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingSupermarket(null);
                    }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function SupermarketModal({ supermarket, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: supermarket?.name || '',
        color: supermarket?.color || 'blue-600',
        locations: supermarket?.locations || []
    });
    const [newLocation, setNewLocation] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const handleFetchLocations = async () => {
        if (!formData.name.trim()) {
            alert('Please enter a supermarket name first');
            return;
        }

        setIsFetching(true);
        try {
            const locations = await searchSupermarketLocations(formData.name);
            if (locations.length > 0) {
                // Filter out duplicates
                const uniqueNewLocations = locations.filter(loc => !formData.locations.includes(loc));

                if (uniqueNewLocations.length === 0) {
                    alert('No new locations found.');
                } else {
                    setFormData(prev => ({
                        ...prev,
                        locations: [...prev.locations, ...uniqueNewLocations]
                    }));
                    alert(`Found and added ${uniqueNewLocations.length} locations.`);
                }
            } else {
                alert('No locations found. Please ensure the Google Maps API Key is configured.');
            }
        } catch {
            // console.error('Error fetching locations:', error);
            alert('Failed to fetch locations');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const addLocation = () => {
        if (newLocation.trim()) {
            setFormData({
                ...formData,
                locations: [...formData.locations, newLocation.trim()]
            });
            setNewLocation('');
        }
    };

    const removeLocation = (index) => {
        setFormData({
            ...formData,
            locations: formData.locations.filter((_, i) => i !== index)
        });
    };

    const colorOptions = [
        { value: 'blue-600', label: 'Blue' },
        { value: 'green-600', label: 'Green' },
        { value: 'red-600', label: 'Red' },
        { value: 'yellow-600', label: 'Yellow' },
        { value: 'purple-600', label: 'Purple' },
        { value: 'pink-600', label: 'Pink' },
        { value: 'indigo-600', label: 'Indigo' },
        { value: 'orange-600', label: 'Orange' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {supermarket ? 'Edit Supermarket' : 'Add New Supermarket'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supermarket Name
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., Carrefour"
                                required
                            />
                            <button
                                type="button"
                                onClick={handleFetchLocations}
                                disabled={isFetching || !formData.name}
                                className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                title="Search for branches on Google Maps"
                            >
                                {isFetching ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Globe className="h-5 w-5" />
                                )}
                                <span className="hidden sm:inline">Find Branches</span>
                            </button>
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Brand Color
                        </label>
                        <select
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            {colorOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Locations */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Locations
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Add location (e.g., Two Rivers)"
                            />
                            <button
                                type="button"
                                onClick={addLocation}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.locations.map((location, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                >
                                    {location}
                                    <button
                                        type="button"
                                        onClick={() => removeLocation(index)}
                                        className="hover:text-blue-900"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            {supermarket ? 'Update' : 'Add'} Supermarket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
