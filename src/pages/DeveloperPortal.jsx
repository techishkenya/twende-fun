import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Code,
    Key,
    Database,
    Zap,
    CheckCircle,
    ArrowRight,
    Copy,
    ExternalLink,
    Play,
    BookOpen,
    Rocket,
    Shield,
    Clock,
    BarChart3,
    Mail,
    ChevronDown,
    ChevronUp,
    Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeveloperPortal() {
    // const [openSection, setOpenSection] = useState('getting-started');
    // const [copiedCode, setCopiedCode] = useState(null);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        // setCopiedCode(label);
        toast.success(`${label} copied!`);
        // setTimeout(() => setCopiedCode(null), 2000);
    };

    // const toggleSection = (section) => {
    //     setOpenSection(openSection === section ? null : section);
    // };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
                <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
                            <Code className="h-5 w-5" />
                            <span className="text-sm font-semibold">Tracker KE Developer Portal</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Integrate Your Supermarket with Tracker KE
                        </h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                            Connect your pricing system to reach thousands of customers.
                            Update prices in real-time and showcase your best deals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="#getting-started"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
                            >
                                <Rocket className="h-5 w-5" />
                                Get Started
                            </a>
                            <a
                                href="#api-reference"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-all border-2 border-white/30"
                            >
                                <BookOpen className="h-5 w-5" />
                                API Documentation
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{'< 1 Hour'}</div>
                        <div className="text-sm text-gray-600">Integration Time</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">FREE</div>
                        <div className="text-sm text-gray-600">No Integration Costs</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">Real-time</div>
                        <div className="text-sm text-gray-600">Price Updates</div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                            <BarChart3 className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">1000s</div>
                        <div className="text-sm text-gray-600">Potential Customers</div>
                    </div>
                </div>

                {/* Getting Started Section */}
                <section id="getting-started" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Rocket className="h-6 w-6 text-primary-600" />
                        </div>
                        Getting Started
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Step 1 */}
                        <StepCard
                            number="1"
                            title="Request API Access"
                            icon={Mail}
                            color="blue"
                        >
                            <p className="text-gray-700 mb-4">
                                Contact our team to get your API credentials:
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900 mb-1">Email us at:</p>
                                        <a href="mailto:api@tracker.ke" className="text-blue-600 hover:text-blue-700 font-medium">
                                            api@tracker.ke
                                        </a>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Include: Supermarket name, contact person, email, phone number
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700">
                                    <strong className="text-green-800">Response time:</strong> Within 24 hours, you'll receive:
                                </p>
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        API Key (for authentication)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        API Secret (for secure requests)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Demo credentials (for testing)
                                    </li>
                                </ul>
                            </div>
                        </StepCard>

                        {/* Step 2 */}
                        <StepCard
                            number="2"
                            title="Test in Demo Mode"
                            icon={Play}
                            color="purple"
                        >
                            <p className="text-gray-700 mb-4">
                                We provide a <strong>sandbox environment</strong> so you can test safely without affecting live data:
                            </p>

                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Demo Environment Features:</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-purple-600" />
                                        Isolated test data (won't appear on live site)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-purple-600" />
                                        Full API functionality
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-purple-600" />
                                        No rate limits
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-purple-600" />
                                        Free forever
                                    </li>
                                </ul>
                            </div>

                            <CodeBlock
                                language="bash"
                                code={`# Test API connection
curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/health" \\
  -H "Authorization: Bearer pk_demo_yourstore_xxxxx"

# Expected response:
# {"status":"healthy","version":"1.0.0"}`}
                                onCopy={() => copyToClipboard('curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/health"', 'Health check')}
                            />
                        </StepCard>

                        {/* Step 3 */}
                        <StepCard
                            number="3"
                            title="Organize Your Data"
                            icon={Database}
                            color="green"
                        >
                            <p className="text-gray-700 mb-4">
                                Your price data should be formatted like this:
                            </p>

                            <CodeBlock
                                language="json"
                                code={`{
  "product_id": "prod_123456",      // Product ID from Tracker KE
  "price": 60.00,                   // Your current price (KES)
  "location": "Westlands Branch",   // Branch location (optional)
  "stock_status": "in_stock",       // in_stock | out_of_stock | limited_stock
  "metadata": {                     // Optional extra info
    "promotion": false,
    "discount_percentage": 0
  }
}`}
                                onCopy={() => copyToClipboard('{"product_id":"prod_123456","price":60.00,"location":"Westlands Branch","stock_status":"in_stock"}', 'Data format')}
                            />

                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-gray-700">
                                    <strong className="text-yellow-800">Note:</strong> First, fetch our product catalog
                                    to map your SKUs to our product IDs. See <a href="#product-mapping" className="text-blue-600 hover:underline">Product Mapping</a> below.
                                </p>
                            </div>
                        </StepCard>

                        {/* Step 4 */}
                        <StepCard
                            number="4"
                            title="Integrate Your System"
                            icon={Code}
                            color="orange"
                        >
                            <p className="text-gray-700 mb-4">
                                Choose your integration method:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                        Scheduled Sync (Recommended)
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Update prices every hour via cron job
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>✓ Simple to implement</li>
                                        <li>✓ Low server load</li>
                                        <li>✓ Reliable</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-purple-600" />
                                        Real-time Updates
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Instant API call when price changes
                                    </p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        <li>✓ Immediate updates</li>
                                        <li>✓ Always current</li>
                                        <li>✓ Best customer experience</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-semibold text-gray-900 mb-2">Sample Integration Code:</p>
                                <CodeBlock
                                    language="python"
                                    code={`import requests

API_KEY = "pk_live_yourstore_xxxxx"
BASE_URL = "https://us-central1-twende-a3958.cloudfunctions.net/api/v1"

# Update prices (batch)
def update_prices(prices):
    response = requests.post(
        f"{BASE_URL}/prices/batch",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"prices": prices}
    )
    return response.json()

# Example usage
prices = [
    {"product_id": "prod_123", "price": 60.00, "stock_status": "in_stock"},
    {"product_id": "prod_456", "price": 45.00, "stock_status": "in_stock"}
]

result = update_prices(prices)
print(f"Updated {result['data']['successful']} prices")`}
                                    onCopy={() => copyToClipboard('Full code available in documentation', 'Python code')}
                                />
                            </div>
                        </StepCard>

                        {/* Step 5 */}
                        <StepCard
                            number="5"
                            title="Go Live!"
                            icon={Rocket}
                            color="pink"
                            isLast={true}
                        >
                            <p className="text-gray-700 mb-4">
                                Ready to go live? Here's what happens:
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                        1
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Switch to Live API Key</p>
                                        <p className="text-sm text-gray-600">We'll provide your production credentials</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                        2
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Your Prices Go Live in {'< 1 Minute'}</p>
                                        <p className="text-sm text-gray-600">Updates appear immediately on Tracker.ke</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                        3
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Customers See Your Best Deals</p>
                                        <p className="text-sm text-gray-600">Products with lowest prices get highlighted!</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                        4
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Monitor via Dashboard</p>
                                        <p className="text-sm text-gray-600">Track views, clicks, and customer engagement</p>
                                    </div>
                                </div>
                            </div>
                        </StepCard>
                    </div>
                </section>

                {/* Where Your Data Appears */}
                <section id="data-visibility" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Eye className="h-6 w-6 text-green-600" />
                        </div>
                        Where Your Data Appears
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🏠</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Homepage</h3>
                                <p className="text-sm text-gray-600">
                                    Your best deals appear in trending section
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🔍</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Search Results</h3>
                                <p className="text-sm text-gray-600">
                                    Customers searching products see your prices
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Product Pages</h3>
                                <p className="text-sm text-gray-600">
                                    Price comparisons show your competitive pricing
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                When You Have the Best Price
                            </h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-blue-600" />
                                    <strong>Highlighted in green</strong> on product pages
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-purple-600" />
                                    <strong>Featured in "Best Deals"</strong> section
                                </li>
                                <li className="flex items-center gap-2">
                                    <ArrowRight className="h-4 w-4 text-green-600" />
                                    <strong>Shown first</strong> in price comparisons
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* API Reference Quick Links */}
                <section id="api-reference" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                        </div>
                        API Reference
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <APIEndpointCard
                            method="GET"
                            endpoint="/products"
                            description="Fetch product catalog to map your SKUs"
                            example='curl -H "Authorization: Bearer API_KEY" https://...api/v1/products'
                        />
                        <APIEndpointCard
                            method="POST"
                            endpoint="/prices/single"
                            description="Update price for one product"
                            example='{"product_id":"prod_123","price":60.00}'
                        />
                        <APIEndpointCard
                            method="POST"
                            endpoint="/prices/batch"
                            description="Update up to 100 prices at once"
                            example='{"prices":[{...},{...}]}'
                        />
                        <APIEndpointCard
                            method="GET"
                            endpoint="/health"
                            description="Check API status and connectivity"
                            example='curl https://...api/v1/health'
                        />
                    </div>
                </section>

                {/* Product Mapping Section */}
                <section id="product-mapping" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Database className="h-6 w-6 text-orange-600" />
                        </div>
                        Product Mapping Guide
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8">
                            <p className="text-gray-700 mb-6">
                                Before you can update prices, you need to <strong>map your product SKUs to Tracker KE product IDs</strong>.
                                Here's how to do it:
                            </p>

                            {/* Step-by-step mapping guide */}
                            <div className="space-y-6">
                                {/* Step 1: Fetch Product Catalog */}
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
                                        Fetch Our Product Catalog
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Get the complete list of products available on Tracker KE:
                                    </p>
                                    <CodeBlock
                                        language="bash"
                                        code={`curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/products?limit=100" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Response includes:
# {
#   "data": {
#     "products": [
#       {
#         "id": "prod_123456",
#         "name": "Coca Cola 500ml",
#         "category": "Beverages",
#         "barcode": "5449000000996"
#       }
#     ]
#   }
# }`}
                                        onCopy={() => copyToClipboard('curl command', 'Fetch products')}
                                    />
                                </div>

                                {/* Step 2: Create Mapping Table */}
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
                                        Create a Mapping Table
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Store the mapping in your database or configuration file:
                                    </p>
                                    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Your SKU</th>
                                                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Tracker Product ID</th>
                                                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Product Name</th>
                                                    <th className="px-4 py-2 text-left font-semibold text-gray-900">Match Method</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                <tr>
                                                    <td className="px-4 py-2 font-mono text-gray-700">SKU-001</td>
                                                    <td className="px-4 py-2 font-mono text-blue-600">prod_123456</td>
                                                    <td className="px-4 py-2 text-gray-700">Coca Cola 500ml</td>
                                                    <td className="px-4 py-2 text-gray-600">Barcode</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 font-mono text-gray-700">SKU-002</td>
                                                    <td className="px-4 py-2 font-mono text-blue-600">prod_789012</td>
                                                    <td className="px-4 py-2 text-gray-700">Bread White 400g</td>
                                                    <td className="px-4 py-2 text-gray-600">Name Match</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-2 font-mono text-gray-700">SKU-003</td>
                                                    <td className="px-4 py-2 font-mono text-blue-600">prod_345678</td>
                                                    <td className="px-4 py-2 text-gray-700">Milk Full Cream 1L</td>
                                                    <td className="px-4 py-2 text-gray-600">Manual</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Step 3: Matching Strategies */}
                                <div className="border-l-4 border-green-500 pl-4">
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
                                        Matching Strategies
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Use these methods to match your products:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                                Barcode Match
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                Most accurate. Match using EAN/UPC barcodes.
                                            </p>
                                            <code className="text-xs text-gray-700 mt-2 block">
                                                if product.barcode == your_barcode
                                            </code>
                                        </div>
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-purple-600" />
                                                Name Match
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                Good fallback. Fuzzy match product names.
                                            </p>
                                            <code className="text-xs text-gray-700 mt-2 block">
                                                if similarity(names) {'>'} 0.8
                                            </code>
                                        </div>
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-orange-600" />
                                                Manual Mapping
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                For unique items. Create manual mappings.
                                            </p>
                                            <code className="text-xs text-gray-700 mt-2 block">
                                                mapping['SKU-003'] = 'prod_345678'
                                            </code>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4: Sample Code */}
                                <div className="border-l-4 border-orange-500 pl-4">
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
                                        Sample Mapping Code
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Here's a complete Python example:
                                    </p>
                                    <CodeBlock
                                        language="python"
                                        code={`import requests
from difflib import SequenceMatcher

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://us-central1-twende-a3958.cloudfunctions.net/api/v1"

def fetch_tracker_products():
    """Fetch all products from Tracker KE"""
    response = requests.get(
        f"{BASE_URL}/products?limit=1000",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    return response.json()['data']['products']

def create_product_mapping(your_products, tracker_products):
    """Create mapping between your SKUs and Tracker product IDs"""
    mapping = {}
    
    for your_product in your_products:
        # Try barcode match first (most accurate)
        if your_product.get('barcode'):
            for tracker_product in tracker_products:
                if tracker_product.get('barcode') == your_product['barcode']:
                    mapping[your_product['sku']] = tracker_product['id']
                    print(f"✓ Barcode match: {your_product['name']}")
                    break
        
        # Fallback to name matching
        if your_product['sku'] not in mapping:
            best_match = None
            best_score = 0
            
            for tracker_product in tracker_products:
                score = SequenceMatcher(
                    None,
                    your_product['name'].lower(),
                    tracker_product['name'].lower()
                ).ratio()
                
                if score > best_score and score > 0.8:
                    best_score = score
                    best_match = tracker_product
            
            if best_match:
                mapping[your_product['sku']] = best_match['id']
                print(f"✓ Name match ({best_score:.0%}): {your_product['name']}")
            else:
                print(f"✗ No match found for: {your_product['name']}")
    
    return mapping

# Example usage
tracker_products = fetch_tracker_products()
your_products = [
    {"sku": "SKU-001", "name": "Coca Cola 500ml", "barcode": "5449000000996"},
    {"sku": "SKU-002", "name": "White Bread 400g", "barcode": None}
]

mapping = create_product_mapping(your_products, tracker_products)

# Save mapping to file
with open('product_mapping.json', 'w') as f:
    json.dump(mapping, f, indent=2)

print(f"\\nMapped {len(mapping)}/{len(your_products)} products")`}
                                        onCopy={() => copyToClipboard('Python mapping code', 'Mapping script')}
                                    />
                                </div>
                            </div>

                            {/* Important Notes */}
                            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <h4 className="font-semibold text-gray-900 mb-2">📝 Important Notes</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">•</span>
                                        <span>Save your mapping to a database or configuration file</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">•</span>
                                        <span>Update mapping when you add new products</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">•</span>
                                        <span>If a product isn't in our catalog, contact us to add it</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-yellow-600 mt-0.5">•</span>
                                        <span>Barcode matching is most reliable when available</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        <FAQItem
                            question="How long does integration take?"
                            answer="Most supermarkets complete integration in under 1 hour. Our step-by-step guide and code examples make it straightforward even for small teams."
                        />
                        <FAQItem
                            question="What if a product isn't in your catalog?"
                            answer="Contact us at api@tracker.ke and we'll add it within 24 hours. You can also use the /products/sync endpoint to submit new products."
                        />
                        <FAQItem
                            question="How often can I update prices?"
                            answer="As often as you like! Most supermarkets update hourly. Rate limits are generous (60 requests/minute by default)."
                        />
                        <FAQItem
                            question="What happens if integration fails?"
                            answer="Our API returns detailed error messages. Log all responses and contact support if you need help troubleshooting."
                        />
                        <FAQItem
                            question="Can I test without affecting live data?"
                            answer="Yes! We provide demo credentials that work in a completely isolated sandbox environment."
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join leading supermarkets already using Tracker KE to reach more customers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:api@tracker.ke?subject=API Access Request"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg"
                        >
                            <Mail className="h-5 w-5" />
                            Request API Access
                        </a>
                        <a
                            href="/help"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-all border-2 border-white/30"
                        >
                            <ExternalLink className="h-5 w-5" />
                            Contact Support
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}

// Helper Components
function StepCard({ number, title, icon: Icon, color, children, isLast = false }) {
    const colorClasses = {
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        green: 'bg-green-600',
        orange: 'bg-orange-600',
        pink: 'bg-pink-600'
    };

    return (
        <div className={`p-6 md:p-8 ${!isLast ? 'border-b border-gray-200' : ''}`}>
            <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${colorClasses[color]} text-white rounded-full flex items-center justify-center flex-shrink-0 text-xl font-bold shadow-lg`}>
                    {number}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                        {title}
                        <Icon className="h-5 w-5 text-gray-400" />
                    </h3>
                    {children}
                </div>
            </div>
        </div>
    );
}

function CodeBlock({ language, code, onCopy }) {
    return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-xs text-gray-400 font-mono">{language}</span>
                <button
                    onClick={onCopy}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                    <Copy className="h-3 w-3" />
                    Copy
                </button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-100 font-mono">{code}</code>
            </pre>
        </div>
    );
}

function APIEndpointCard({ method, endpoint, description, example }) {
    const methodColors = {
        GET: 'bg-blue-100 text-blue-800',
        POST: 'bg-green-100 text-green-800',
        PUT: 'bg-orange-100 text-orange-800',
        DELETE: 'bg-red-100 text-red-800'
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3 mb-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${methodColors[method]}`}>
                    {method}
                </span>
                <code className="text-sm font-mono text-gray-900">{endpoint}</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <div className="bg-gray-50 rounded p-2">
                <code className="text-xs text-gray-700 font-mono break-all">{example}</code>
            </div>
        </div>
    );
}

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-gray-900 text-left">{question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
            </button>
            {isOpen && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700">{answer}</p>
                </div>
            )}
        </div>
    );
}
