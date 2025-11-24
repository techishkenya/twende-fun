import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, HelpCircle } from 'lucide-react';

export default function HelpSupport() {
    const navigate = useNavigate();

    return (
        <div className="pb-20 min-h-screen bg-gray-50">
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-3 mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-display font-bold text-gray-900">Help & Support</h1>
            </div>

            <div className="p-4 space-y-4">
                {/* Privacy Policy */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <Shield className="h-5 w-5 text-primary-600" />
                        <h2 className="font-bold text-gray-900">Privacy Policy</h2>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p>TRACKER KE respects your privacy. We collect minimal data necessary to provide our service:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Phone number for authentication</li>
                            <li>Price submissions (crowdsourced data)</li>
                            <li>Location data for price submissions</li>
                        </ul>
                        <p className="font-medium mt-3">We do not sell your personal data to third parties.</p>
                    </div>
                </div>

                {/* GDPR Compliance */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="h-5 w-5 text-primary-600" />
                        <h2 className="font-bold text-gray-900">GDPR Compliance</h2>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p>Your rights under GDPR:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Right to Access:</strong> View your data at any time</li>
                            <li><strong>Right to Rectification:</strong> Update or correct your data</li>
                            <li><strong>Right to Erasure:</strong> Request deletion of your account</li>
                            <li><strong>Right to Data Portability:</strong> Export your data</li>
                        </ul>
                        <p className="mt-3">Contact us at privacy@trackerke.com for data requests.</p>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <HelpCircle className="h-5 w-5 text-primary-600" />
                        <h2 className="font-bold text-gray-900">Terms & Conditions</h2>
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>Data Source:</strong> All price data on TRACKER KE is crowdsourced from community contributions. We make reasonable efforts to verify accuracy but cannot guarantee 100% accuracy at all times.</p>

                        <p className="mt-3"><strong>User Responsibilities:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Submit accurate price information</li>
                            <li>Respect intellectual property rights</li>
                            <li>Use the service for personal, non-commercial purposes</li>
                        </ul>

                        <p className="mt-3"><strong>Disclaimer:</strong> TRACKER KE is an informational platform. Prices may change without notice. Always verify prices at the point of sale.</p>

                        <p className="mt-3 font-medium">By using TRACKER KE, you agree to these terms and acknowledge that data is crowdsourced.</p>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="bg-primary-50 p-5 rounded-xl border border-primary-100">
                    <h2 className="font-bold text-gray-900 mb-2">Need Help?</h2>
                    <p className="text-sm text-gray-600 mb-3">Contact our support team for assistance.</p>
                    <a href="mailto:support@trackerke.com" className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                        Email Support
                    </a>
                </div>
            </div>
        </div>
    );
}
