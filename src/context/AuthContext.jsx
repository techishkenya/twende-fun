import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, RecaptchaVerifier, signInWithPhoneNumber as firebaseSignIn, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            // Mock mode: stop loading immediately
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    function logout() {
        if (!auth) {
            setCurrentUser(null);
            return Promise.resolve();
        }
        return signOut(auth);
    }

    function setupRecaptcha(elementId) {
        if (!auth) return; // Skip in mock mode
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
                'size': 'invisible',
            });
        }
    }

    async function signInWithPhoneNumber(phoneNumber, appVerifier) {
        if (!auth) {
            // Mock Sign In
            return {
                confirm: async (otp) => {
                    if (otp === '123456') {
                        setCurrentUser({
                            uid: 'mock-user-123',
                            phoneNumber: phoneNumber,
                            displayName: 'Mock User'
                        });
                        return Promise.resolve();
                    }
                    throw new Error('Invalid OTP');
                }
            };
        }
        return firebaseSignIn(auth, phoneNumber, appVerifier);
    }

    function loginWithGoogle() {
        if (!auth) {
            setCurrentUser({
                uid: 'mock-google-user',
                displayName: 'Mock Google User',
                email: 'mock@example.com',
                photoURL: 'https://via.placeholder.com/150'
            });
            return Promise.resolve();
        }
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    const value = {
        currentUser,
        logout,
        setupRecaptcha,
        signInWithPhoneNumber,
        loginWithGoogle
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
