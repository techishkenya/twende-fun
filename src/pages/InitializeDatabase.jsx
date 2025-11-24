import { useState } from 'react';
import { initializeFirestore } from '../lib/initializeFirestore';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function InitializeDatabase() {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCreateAdmin = async () => {
        setLoading(true);
        setError(null);
        setStatus('Creating admin account...');

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, 'admin@twende.fun', 'Pass1234');
            const user = userCredential.user;

            // Create admin user document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                email: 'admin@twende.fun',
                role: 'admin',
                displayName: 'System Admin',
                createdAt: new Date(),
                badges: ['admin']
            });

            setStatus('✅ Admin account created successfully! (admin@twende.fun)');
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            console.error('Error creating admin:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Admin account already exists. You can proceed to initialize data.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInitialize = async () => {
        setLoading(true);
        setError(null);
        setStatus('Starting database initialization...');

        try {
            const result = await initializeFirestore();

            if (result.success) {
                setStatus('✅ Database initialized successfully!');
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setError(result.error || 'Unknown error occurred');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Initialize Database</h1>
                    <p className="text-gray-600">Set up Firestore with initial data</p>
                </div>

                {!loading && !status && (
                    <div className="space-y-6">
                        {/* Admin Account Section */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">1. Create Admin Account</h3>
                            <p className="text-sm text-blue-700 mb-3">
                                Create the main admin user (admin@twende.fun / Pass1234)
                            </p>
                            <button
                                onClick={handleCreateAdmin}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Create Admin User
                            </button>
                        </div>

                        {/* Database Init Section */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h3 className="font-semibold text-yellow-800 mb-2">2. Populate Database</h3>
                            <p className="text-sm text-yellow-700">
                                This will populate your Firestore database with:
                            </p>
                            <ul className="text-sm text-yellow-700 list-disc list-inside mt-2 mb-3">
                                <li>230+ FMCG products</li>
                                <li>4 supermarkets with branches</li>
                                <li>Sample price data</li>
                            </ul>
                            <button
                                onClick={handleInitialize}
                                className="w-full bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                            >
                                Initialize Data
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-gray-200 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">{status}</p>
                    </div>
                )}

                {status && !loading && !error && (
                    <div className="text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <p className="text-green-600 font-semibold">{status}</p>
                        <p className="text-sm text-gray-500 mt-2">Redirecting to home...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-800 mb-2">❌ Error</h3>
                        <p className="text-sm text-red-700">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                setStatus('');
                            }}
                            className="mt-4 w-full bg-red-600 text-white py-2 rounded-full text-sm hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
