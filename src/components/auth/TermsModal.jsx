import { useState } from 'react';
import { X, Shield, FileText, Check } from 'lucide-react';

export default function TermsModal({ isOpen, onClose, onAccept }) {
    const [hasRead, setHasRead] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-lg">
                            <Shield className="h-6 w-6 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div
                    className="p-6 overflow-y-auto text-sm text-gray-600 space-y-4 leading-relaxed"
                    onScroll={(e) => {
                        const { scrollTop, scrollHeight, clientHeight } = e.target;
                        if (scrollHeight - scrollTop <= clientHeight + 50) {
                            setHasRead(true);
                        }
                    }}
                >
                    <p className="font-medium text-gray-900">Last Updated: November 2025</p>

                    <p>
                        Welcome to Tracker KE! By accessing or using our platform, you agree to be bound by these Terms of Service and our Privacy Policy.
                    </p>

                    <h3 className="font-bold text-gray-900 mt-4">1. Community Guidelines</h3>
                    <p>
                        Tracker KE relies on accurate data from our community. You agree to submit only truthful and accurate price information. Deliberate submission of false data may result in account suspension.
                    </p>

                    <h3 className="font-bold text-gray-900 mt-4">2. Points & Rewards</h3>
                    <p>
                        Points earned for submissions have no cash value and are used solely for community ranking and unlocking platform features. We reserve the right to adjust point values or revoke points obtained through fraudulent means.
                    </p>

                    <h3 className="font-bold text-gray-900 mt-4">3. Data Privacy (GDPR)</h3>
                    <p>
                        We respect your privacy. We collect only the minimum data required (Name, Email, Profile Picture) to maintain your account. Your location data is only collected when you explicitly choose to share it with a submission. We do not sell your personal data to third parties.
                    </p>

                    <h3 className="font-bold text-gray-900 mt-4">4. Content Ownership</h3>
                    <p>
                        By submitting photos or prices, you grant Tracker KE a non-exclusive, royalty-free license to use, display, and distribute this content on our platform.
                    </p>

                    <div className="h-8"></div> {/* Spacer */}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4">
                        <input
                            type="checkbox"
                            id="accept-terms"
                            checked={hasRead}
                            onChange={(e) => setHasRead(e.target.checked)}
                            className="h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                        />
                        <label htmlFor="accept-terms" className="text-sm text-gray-700 cursor-pointer select-none">
                            I have read and agree to the Terms & Privacy Policy
                        </label>
                    </div>
                    <button
                        onClick={onAccept}
                        disabled={!hasRead}
                        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
                    >
                        <Check className="h-5 w-5" />
                        Accept & Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
