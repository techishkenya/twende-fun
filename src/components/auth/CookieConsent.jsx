import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-4xl mx-auto bg-gray-900/95 backdrop-blur-md text-white p-4 md:p-5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 border border-white/10">
                <div className="p-3 bg-white/10 rounded-xl shrink-0">
                    <Cookie className="h-6 w-6 text-yellow-400" />
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">We use cookies</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Tracker KE uses cookies to enhance your experience, analyze site traffic, and assist in our marketing efforts.
                        By continuing to visit this site you agree to our use of cookies.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-6 py-2 bg-white text-gray-900 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
