import { Link } from 'react-router-dom';
import { Search, DollarSign, TrendingUp, Users, Shield, Smartphone, Award } from 'lucide-react';
import SEO from '../components/SEO';

export default function HowItWorks() {
    return (
        <div className="bg-gray-50">
            <SEO
                title="How It Works - Community-Driven Price Tracking"
                description="Learn how TRACKER KE helps you save money through community-driven price tracking. Join thousands of Kenyans sharing real-time supermarket prices."
            />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">How TRACKER KE Works</h1>
                    <p className="text-xl text-primary-100">
                        Empowering Kenyan shoppers through community-driven price transparency
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">

                {/* The Problem */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">The Problem We're Solving</h2>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-lg text-gray-700 mb-4">
                            Shopping for groceries can be expensive, and prices vary significantly between supermarkets.
                            Without real-time price information, you might be overpaying for everyday items.
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>TRACKER KE</strong> solves this by creating an open community where shoppers like you
                            share real-time prices, helping everyone make smarter purchasing decisions and save money.
                        </p>
                    </div>
                </section>

                {/* How It Works - User Journey */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Journey with TRACKER KE</h2>

                    <div className="space-y-8">
                        {/* Step 1: Search & Compare */}
                        <div className="flex gap-6 items-start">
                            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Search className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">1. Search & Compare Prices</h3>
                                <p className="text-gray-700 mb-3">
                                    Use our search bar to find any product you're looking for. We'll show you real-time
                                    prices from multiple supermarkets including Carrefour, Naivas, QuickMart, and more.
                                </p>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">
                                        <strong>Example:</strong> Search for "Milk 1L" and instantly see that it costs KES 155
                                        at Carrefour but only KES 148 at Naivas - saving you KES 7 per liter!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Submit Prices */}
                        <div className="flex gap-6 items-start">
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">2. Contribute Price Updates</h3>
                                <p className="text-gray-700 mb-3">
                                    While shopping, spotted a price? Share it! Click "Add Price", select the product and
                                    supermarket, enter the price, and help your fellow shoppers.
                                </p>
                                <div className="bg-green-50 rounded-lg p-4">
                                    <p className="text-sm text-green-700">
                                        <strong>Earn Points:</strong> Every price you submit earns you points. The more you
                                        contribute, the higher you climb on our leaderboard!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Add Products */}
                        <div className="flex gap-6 items-start">
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">3. Expand Our Database</h3>
                                <p className="text-gray-700 mb-3">
                                    Don't see a product listed? You can submit it! Add the product name, category, and image.
                                    Our admin team will review and approve it within 24 hours.
                                </p>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-sm text-blue-700">
                                        <strong>Big Rewards:</strong> Get 20 bonus points when your product submission is approved!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Community Impact */}
                        <div className="flex gap-6 items-start">
                            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">4. Build a Stronger Community</h3>
                                <p className="text-gray-700">
                                    Every contribution you make helps thousands of other Kenyan families save money.
                                    Together, we create transparency in the market and empower smart shopping decisions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Community-Driven? */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Community-Driven Works</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Always Up-to-Date</h3>
                            <p className="text-gray-600">
                                Unlike static price lists, our community ensures data is fresh and reflects current market prices.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Wider Coverage</h3>
                            <p className="text-gray-600">
                                With thousands of contributors, we cover more products, locations, and supermarkets than any single company could.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Control</h3>
                            <p className="text-gray-600">
                                All submissions are reviewed by our admin team to ensure accuracy and prevent spam.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <Award className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Incentivized Accuracy</h3>
                            <p className="text-gray-600">
                                Our points system rewards contributors, encouraging consistent and accurate price updates.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mobile-First Design */}
                <section>
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Designed for Your Phone</h2>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Smartphone className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Shop Smarter On-the-Go</h3>
                                <p className="text-gray-700 mb-4">
                                    TRACKER KE is a Progressive Web App (PWA), meaning you can install it on your phone
                                    just like a regular app - no app store needed!
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-primary-600 rounded-full"></div>
                                        Works offline once installed
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-primary-600 rounded-full"></div>
                                        Fast loading, even on slow connections
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-primary-600 rounded-full"></div>
                                        Submit prices while shopping in-store
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-primary-600 rounded-full"></div>
                                        Compare prices before heading to the supermarket
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
                    <p className="text-xl text-primary-100 mb-6">
                        Join our community of smart shoppers today
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/search"
                            className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors"
                        >
                            Search Prices Now
                        </Link>
                        <Link
                            to="/profile"
                            className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-400 transition-colors border-2 border-white"
                        >
                            Sign Up & Contribute
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
