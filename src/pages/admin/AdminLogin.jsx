
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader, Database } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [initMode, setInitMode] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Sign in with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user is admin
            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists() && userDoc.data().role === 'admin') {
                // Store admin status
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin/dashboard');
            } else {
                console.error('Admin check failed: User document missing or role not admin');
                setError('Access Denied: You do not have administrator privileges.');
                await auth.signOut();
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError('Login failed: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInitialize = async () => {
        setLoading(true);
        setError('');
        setSuccess('Initializing system...');

        try {
            // 1. Create/Repair Admin Account
            let user;
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, 'admin@twende.fun', 'Pass1234');
                user = userCredential.user;
                setSuccess('Admin account created...');
            } catch (err) {
                if (err.code === 'auth/email-already-in-use') {
                    setSuccess('Admin account exists. Verifying...');
                    const userCredential = await signInWithEmailAndPassword(auth, 'admin@twende.fun', 'Pass1234');
                    user = userCredential.user;
                } else {
                    throw err;
                }
            }

            // 2. Force Admin Role
            await setDoc(doc(db, 'users', user.uid), {
                email: 'admin@twende.fun',
                role: 'admin',
                displayName: 'System Admin',
                createdAt: new Date(),
                badges: ['admin']
            }, { merge: true });
            setSuccess('Admin privileges verified...');

            // 3. Initialize Database Data
            const { initializeFirestore } = await import('../../lib/initializeFirestore');
            const result = await initializeFirestore();

            if (result.success) {
                setSuccess('✅ System initialized! Redirecting...');
                localStorage.setItem('isAdmin', 'true');
                setTimeout(() => navigate('/admin/dashboard'), 1500);
            } else {
                throw new Error(result.error || 'Database initialization failed');
            }

        } catch (err) {
            console.error('Init error:', err);
            setError('Initialization failed: ' + err.message);
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
                    <p className="text-gray-600">Sign in to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                            {success}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="admin@twende.fun"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 flex flex-col items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to App
                    </button>

                    <div className="w-full border-t pt-4">
                        <button
                            onClick={() => setInitMode(!initMode)}
                            className="text-xs text-gray-400 hover:text-primary-600 w-full text-center"
                        >
                            System Setup
                        </button>

                        {initMode && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-600 mb-3 text-center">
                                    First time? Initialize the system with default admin and data.
                                </p>
                                <button
                                    onClick={handleInitialize}
                                    disabled={loading}
                                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                >
                                    {loading ? 'Initializing...' : 'Initialize System'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
