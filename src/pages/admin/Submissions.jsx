import { useState } from 'react';
import { Package, DollarSign } from 'lucide-react';
import ProductSubmissions from './ProductSubmissions';
import SubmissionsManagement from './SubmissionsManagement';

export default function Submissions() {
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="space-y-6">
            {/* Header with Tabs */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Submissions</h1>

                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'products'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                            }`}
                    >
                        <Package className="h-5 w-5" />
                        Product Submissions
                    </button>
                    <button
                        onClick={() => setActiveTab('prices')}
                        className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'prices'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                            }`}
                    >
                        <DollarSign className="h-5 w-5" />
                        Price Submissions
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'products' ? (
                    <ProductSubmissions />
                ) : (
                    <SubmissionsManagement />
                )}
            </div>
        </div>
    );
}
