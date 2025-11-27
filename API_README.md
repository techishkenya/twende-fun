# 🚀 Tracker KE - Supermarket API System

## Overview

Complete API infrastructure for supermarkets to integrate with Tracker KE. This system includes:

- **📚 Documentation**: Comprehensive API docs with code examples
- **🎛️ Admin Dashboard**: Web-based API key management
- **⚡ Cloud Functions**: Serverless API endpoints
- **🧪 Testing Tools**: Postman collection for easy testing
- **🔒 Security**: API key authentication & rate limiting

---

## 📁 Project Structure

```
twende-fun/
├── API_DOCUMENTATION.md          # Full API reference
├── INTEGRATION_GUIDE.md          # Step-by-step integration guide
├── tracker-ke-api.postman_collection.json  # Postman collection
├── functions/
│   ├── package.json              # Dependencies
│   └── index.js                  # Cloud Functions (API Layer)
└── src/
    └── pages/
        └── admin/
            └── APIManagement.jsx  # Admin dashboard for API keys
```

---

## 🎯 Quick Start

### 1. **For Administrators**

#### Deploy Firebase Functions (API Layer)

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Deploy functions (uses free tier)
firebase deploy --only functions

# Your API will be available at:
# https://us-central1-twende-a3958.cloudfunctions.net/api/v1
```

#### Access Admin Dashboard

1. Go to `http://localhost:5173/admin/api` (or your live URL)
2. Generate API keys for supermarkets
3. Monitor usage and analytics

### 2. **For Supermarkets**

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for complete integration steps.

Quick test:

```bash
# Test authentication
curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/health" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Update a price
curl -X POST "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/prices/single" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_123456",
    "price": 60.00,
    "location": "Westlands Branch",
    "stock_status": "in_stock"
  }'
```

---

## 🔧 Features

### ✅ What's Included

- [x] RESTful API with Express.js
- [x] API Key authentication
- [x] Rate limiting (60 req/min default)
- [x] Permission-based access control
- [x] Demo/Live mode separation
- [x] Batch operations (up to 100 items)
- [x] Comprehensive error handling
- [x] API usage analytics
- [x] Admin dashboard for key management
- [x] Postman collection for testing
- [x] Complete documentation

### ⚡ API Endpoints

| Endpoint | Method | Description | Permission |
|----------|--------|-------------|------------|
| `/health` | GET | Health check | None |
| `/products` | GET | Get products | `products:read` |
| `/products/:id` | GET | Get single product | `products:read` |
| `/prices/single` | POST | Update one price | `prices:write` |
| `/prices/batch` | POST | Update multiple prices | `prices:write` |
| `/products/sync` | POST | Sync catalog | `products:write` |

---

## 💰 Cost Analysis

### Firebase Free Tier (Spark Plan)

**Cloud Functions:**
- ✅ 2M invocations/month - **FREE**
- ✅ 400K GB-seconds - **FREE**
- ✅ 200K CPU-seconds - **FREE**

**Firestore:**
- ✅ 50K reads/day - **FREE**
- ✅ 20K writes/day - **FREE**
- ✅ 1 GB storage - **FREE**

### Estimated Usage (4 Supermarkets, Hourly Updates)

- **API Calls**: ~2,880/month (4 stores × 24 hours × 30 days)
- **Firestore Writes**: ~2,880/month
- **Storage**: ~10 MB

**Total Cost**: **$0/month** ✅ (Well within free tier!)

### When You Go Live

**Blaze Plan** (Pay-as-you-go):
- First 2M invocations FREE, then $0.40/million
- With 100K requests/month: Still **$0/month**
- With 1M requests/month: ~**$5/month**

**Conclusion**: API layer is FREE for now and scales affordably! 🎉

---

## 🔐 Security

### Built-in Security Features

1. **API Key Authentication**
   - Bearer token authentication
   - Optional HMAC request signing
   - Automatic key validation

2. **Rate Limiting**
   - Per-supermarket limits
   - Configurable thresholds
   - 429 error responses

3. **Permission System**
   - Role-based access (read/write)
   - Granular permissions
   - Scope enforcement

4. **Data Isolation**
   - Demo/Live mode separation
   - Per-supermarket data filtering
   - Audit logging

### Best Practices

- ✅ Use HTTPS only (enforced)
- ✅ Store API secrets securely
- ✅ Rotate keys quarterly
- ✅ Monitor usage analytics
- ✅ Set up alerts for anomalies

---

## 📊 Monitoring & Analytics

### API Usage Dashboard

The admin panel (`/admin/api`) shows:

- Total requests
- Requests in last 24 hours
- Success rate
- Active API keys
- Per-endpoint statistics

### Logging

All API calls are automatically logged to `api_usage_logs` collection:

```javascript
{
  supermarketId: "carrefour",
  endpoint: "/prices/batch",
  method: "POST",
  status: 200,
  duration: 145,  // milliseconds
  timestamp: "2025-11-28T00:45:38Z",
  isDemo: false
}
```

Query logs to:
- Track usage patterns
- Identify errors
- Optimize performance
- Generate reports

---

## 🧪 Testing

### Using Postman

1. Import `tracker-ke-api.postman_collection.json`
2. Set environment variables:
   - `base_url`: Your Firebase Function URL
   - `api_key`: Your API key
3. Run requests!

### Using cURL

See examples in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Integration Tests

```javascript
// Example test script
const client = new TrackerKEClient(apiKey, apiSecret);

// Test authentication
await client.getProducts();

// Test price update
await client.updatePrice('prod_123', 60.00);

// Test batch update
await client.batchUpdatePrices([...]);
```

---

## 🚀 Deployment

### Initial Deployment

```bash
# 1. Install Firebase CLI (if not already)
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Deploy functions
cd functions
npm install
cd ..
firebase deploy --only functions

# 4. Deploy frontend (optional)
npm run build
firebase deploy --only hosting
```

### Updates

```bash
# Deploy only functions
firebase deploy --only functions

# Deploy everything
firebase deploy
```

### Rollback

```bash
# List previous deployments
firebase functions:log

# Rollback to specific version
# (Use Firebase Console for easy rollback)
```

---

## 📖 Documentation

### For Developers

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Step-by-step integration
- **Postman Collection** - Interactive API testing

### For Admins

- **Admin Dashboard** - `/admin/api`
- **Data Management** - `/admin/data-management`
- **Analytics** - Built into admin panel

---

## 🆘 Troubleshooting

### Common Issues

**Functions not deploying?**
```bash
# Check Node version (should be 18)
node --version

# Check Firebase project
firebase use

# Check credentials
firebase login --reauth
```

**API returns 401 Unauthorized?**
- Verify API key is correct
- Check key hasn't been revoked
- Ensure using correct environment (demo vs live)

**Rate limit errors?**
- Reduce request frequency
- Use batch endpoints
- Contact admin for higher limits

**Prices not updating?**
- Check demo/live mode
- Verify API response is successful
- Check product exists
- Wait 1 minute for cache

---

## 🎓 Learning Resources

### Video Tutorials (Coming Soon)
- API Overview & Setup
- Generating API Keys
- First Integration
- Troubleshooting Guide

### Code Examples

See `/examples` folder for:
- Python sync script
- Node.js integration
- PHP implementation
- Webhook handler

---

## 🔄 Roadmap

### Phase 1: Foundation ✅ (Complete)
- [x] API endpoints
- [x] Authentication
- [x] Admin dashboard
- [x] Documentation

### Phase 2: Enhancement (Next)
- [ ] Webhook notifications
- [ ] Advanced analytics
- [ ] IP whitelisting
- [ ] API versioning (v2)

### Phase 3: Scale (Future)
- [ ] GraphQL endpoint
- [ ] Real-time WebSocket
- [ ] Multi-region deployment
- [ ] Enterprise features

---

## 📞 Support

### Getting Help

- **Email**: api-support@tracker.ke
- **Documentation**: See docs above
- **Issues**: Report bugs in admin panel

### Response Times

- **Critical Issues**: 2 hours
- **General Support**: 24 hours
- **Feature Requests**: 1 week

---

## 📜 License

© 2025 Tracker KE. All rights reserved.

---

## 🎉 Credits

Built with:
- Firebase Cloud Functions
- Express.js
- React
- Firestore

---

**Ready to integrate?** Start with [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)! 🚀
