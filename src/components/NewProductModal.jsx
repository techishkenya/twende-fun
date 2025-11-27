import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { CATEGORIES } from '../lib/types';

export default function NewProductModal({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        productName: '',
        barcode: '',
        category: '',
        newCategory: '',
        imageUrl: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const category = formData.category === '__new__' ? formData.newCategory : formData.category;

        if (!formData.productName || !category || !formData.barcode) {
            return;
        }

        onSubmit({
            productName: formData.productName,
            barcode: formData.barcode,
            category,
            imageUrl: formData.imageUrl || 'https://via.placeholder.com/150',
            isNewCategory: formData.category === '__new__'
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="e.g., Coca Cola 500ml"
                            required
                        />
                    </div>

                    {/* Barcode (Optional but recommended) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Barcode (EAN/UPC)
                        </label>
                        <input
                            type="text"
                            value={formData.barcode}
                            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
                            placeholder="e.g., 6161234567890"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                        >
                            <option value="">Select category</option>
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                            <option value="__new__">+ Add New Category</option>
                        </select>
                    </div>

                    {/* New Category Input */}
                    {formData.category === '__new__' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Category Name *
                            </label>
                            <input
                                type="text"
                                value={formData.newCategory}
                                onChange={(e) => setFormData({ ...formData, newCategory: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g., Pet Food"
                                required
                            />
                        </div>
                    )}

                    {/* Image URL (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Your product will be reviewed by admins before appearing on the platform.
                        </p>
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
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                        >
                            Submit for Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
