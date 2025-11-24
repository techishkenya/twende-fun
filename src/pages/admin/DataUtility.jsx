import { useState } from 'react';
import { initializeFirestore } from '../../lib/initializeFirestore';
import { Database, Check, AlertCircle, Loader } from 'lucide-react';

export default function DataUtility() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleInitialize = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await initializeFirestore();
            if (response.success) {
                setResult('✅ Data initialized successfully! Categories, products, and pricing have been added to Firestore.');
            } else {
                setError(response.error || 'Initialization failed');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Data Utility</h1>
                <p className="text-gray-600 mt-2">Initialize or reset Firestore data</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">Initialize Firestore Data</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            This will populate Firestore with:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-4 ml-4">
                            <li>• 4 Supermarkets (Carrefour, Naivas, QuickMart, Magunas)</li>
                            <li>• 8 Product Categories</li>
                            <li>• Sample products with images</li>
                            <li>• Pricing data for all supermarkets</li>
                        </ul>
                        <p className="text-xs text-amber-600 mb-4">
                            ⚠️ This uses setDoc which will overwrite existing data with the same IDs
                        </p>

                        {result && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-700">{result}</p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleInitialize}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Initializing...
                                </>
                            ) : (
                                <>
                                    <Database className="h-4 w-4" />
                                    Initialize Data
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">Important Notes:</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                    <li>• This should typically only be run once during initial setup</li>
                    <li>• Running it again will update existing data but won't duplicate</li>
                    <li>• User-submitted data and custom entries won't be affected</li>
                </ul>
            </div>
        </div>
    );
}
