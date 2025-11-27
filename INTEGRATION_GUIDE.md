# Tracker KE - Supermarket Integration Guide

## 🎯 Quick Start Guide for Supermarkets

This guide will help you integrate your supermarket with Tracker KE in **less than 1 hour**.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- [ ] Admin credentials from Tracker KE team
- [ ] Your product catalog ready (CSV or JSON format)
- [ ] Technical contact person assigned
- [ ] Development environment ready

---

## 🚀 Integration Steps

### Step 1: Get Your API Credentials (5 minutes)

1. Log into Tracker KE Admin Dashboard
2. Navigate to **Settings → API Management**
3. Click **"Generate API Key"**
4. Save your credentials securely:
   - API Key: `pk_demo_yourstore_xxxxx`
   - API Secret: `sk_secret_xxxxx`

⚠️ **Important**: Store these securely. We won't show them again.

---

### Step 2: Test Authentication (5 minutes)

Test your credentials with a simple health check:

```bash
curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/health" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-11-28T00:45:38+03:00"
}
```

✅ If you get this response, authentication is working!

---

### Step 3: Fetch Product Catalog (10 minutes)

Get the current product list from Tracker KE:

```bash
curl -X GET "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/products?limit=100" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Save the response** - you'll need the `product_id` values for price updates.

#### Map Your Products

Create a mapping between your SKUs and Tracker KE product IDs:

| Your SKU | Tracker KE Product ID | Product Name |
|----------|------------------------|--------------|
| SKU-001 | prod_123456 | Coca Cola 500ml |
| SKU-002 | prod_789012 | Bread White 400g |
| SKU-003 | prod_345678 | Milk Full Cream 1L |

💡 **Tip**: Save this mapping in your database for future use.

---

### Step 4: Send Your First Price Update (10 minutes)

#### Option A: Update Single Price

```bash
curl -X POST "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/prices/single" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": "prod_123456",
    "price": 60.00,
    "currency": "KES",
    "location": "Westlands Branch",
    "stock_status": "in_stock"
  }'
```

#### Option B: Batch Update (Recommended)

```bash
curl -X POST "https://us-central1-twende-a3958.cloudfunctions.net/api/v1/prices/batch" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prices": [
      {
        "product_id": "prod_123456",
        "price": 60.00,
        "currency": "KES",
        "location": "Westlands Branch",
        "stock_status": "in_stock"
      },
      {
        "product_id": "prod_789012",
        "price": 45.00,
        "currency": "KES",
        "location": "Westlands Branch",
        "stock_status": "in_stock"
      }
    ]
  }'
```

---

### Step 5: Set Up Automated Updates (30 minutes)

Create a scheduled job to send price updates regularly.

#### Python Example (Recommended)

```python
#!/usr/bin/env python3
"""
Tracker KE Price Sync Script
Runs every hour to update prices
"""

import requests
import json
import os
from datetime import datetime

# Configuration
API_KEY = os.getenv('TRACKER_API_KEY', 'pk_demo_yourstore_xxxxx')
API_SECRET = os.getenv('TRACKER_API_SECRET', 'sk_secret_xxxxx')
BASE_URL = 'https://us-central1-twende-a3958.cloudfunctions.net/api/v1'
BRANCH_NAME = 'Westlands Branch'

def get_current_prices_from_your_pos():
    """
    Replace this with your actual POS integration
    This should return a list of products with current prices
    """
    # Example: Query your database
    # Example: Call your POS API
    # Example: Read from CSV file
    
    return [
        {
            'sku': 'SKU-001',
            'price': 60.00,
            'stock_status': 'in_stock'
        },
        {
            'sku': 'SKU-002',
            'price': 45.00,
            'stock_status': 'limited_stock'
        }
    ]

def get_product_mapping():
    """
    Map your SKUs to Tracker KE product IDs
    Store this in a database or config file
    """
    return {
        'SKU-001': 'prod_123456',
        'SKU-002': 'prod_789012',
        'SKU-003': 'prod_345678'
    }

def sync_prices():
    """Main sync function"""
    print(f"[{datetime.now()}] Starting price sync...")
    
    # Get current prices from your system
    current_prices = get_current_prices_from_your_pos()
    product_mapping = get_product_mapping()
    
    # Transform to Tracker KE format
    prices_payload = []
    for item in current_prices:
        tracker_id = product_mapping.get(item['sku'])
        if tracker_id:
            prices_payload.append({
                'product_id': tracker_id,
                'price': item['price'],
                'currency': 'KES',
                'location': BRANCH_NAME,
                'stock_status': item['stock_status']
            })
    
    if not prices_payload:
        print("No prices to update")
        return
    
    # Send batch update
    response = requests.post(
        f'{BASE_URL}/prices/batch',
        headers={
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        },
        json={'prices': prices_payload}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Success! Updated {result['data']['successful']} prices")
        if result['data']['failed'] > 0:
            print(f"⚠️  Failed: {result['data']['failed']} prices")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)

if __name__ == '__main__':
    sync_prices()
```

#### Set Up Cron Job (Linux/Mac)

```bash
# Run every hour
0 * * * * /usr/bin/python3 /path/to/tracker_sync.py >> /var/log/tracker_sync.log 2>&1

# Run every 30 minutes
*/30 * * * * /usr/bin/python3 /path/to/tracker_sync.py >> /var/log/tracker_sync.log 2>&1

# Run every day at 6 AM
0 6 * * * /usr/bin/python3 /path/to/tracker_sync.py >> /var/log/tracker_sync.log 2>&1
```

#### Set Up Scheduled Task (Windows)

1. Open **Task Scheduler**
2. Create **New Task**
3. Set trigger: **Daily at 6:00 AM** (or hourly)
4. Set action: Run `python.exe C:\path\to\tracker_sync.py`
5. Save and enable

---

## 🏗️ Integration Patterns

### Pattern 1: Real-Time Updates (Best for Small Stores)

Update prices immediately when changed in your POS:

```javascript
// In your POS system, when price changes:
async function onPriceChange(sku, newPrice) {
  const trackerProductId = await getTrackerProductId(sku);
  
  await fetch('https://us-central1-twende-a3958.cloudfunctions.net/api/v1/prices/single', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product_id: trackerProductId,
      price: newPrice,
      currency: 'KES',
      location: 'Main Branch',
      stock_status: 'in_stock'
    })
  });
}
```

### Pattern 2: Batch Updates (Best for Large Stores)

Sync all prices once per hour:

```python
# Recommended for stores with 100+ products
def hourly_sync():
    all_prices = get_all_prices_from_database()
    
    # Split into batches of 100 (API limit)
    for i in range(0, len(all_prices), 100):
        batch = all_prices[i:i+100]
        send_batch_update(batch)
        time.sleep(1)  # Rate limiting
```

### Pattern 3: Webhook-Based (Advanced)

Set up webhooks to get notifications:

```javascript
// Your webhook endpoint
app.post('/webhooks/tracker', (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'price.updated') {
    console.log(`Price updated for ${data.product_id}: ${data.price}`);
    // Update your local records
    updateLocalDatabase(data);
  }
  
  res.status(200).send('OK');
});
```

---

## 🔧 Integration Architecture

### Recommended Setup

```
┌─────────────────────────┐
│   Your POS System       │
│   - Inventory DB        │
│   - Price Management    │
└───────────┬─────────────┘
            │
            │ (Hourly Sync)
            ▼
┌─────────────────────────┐
│   Sync Service          │
│   - Python Script       │
│   - Cron Job            │
│   - Error Handling      │
└───────────┬─────────────┘
            │
            │ (HTTPS API)
            ▼
┌─────────────────────────┐
│   Tracker KE API        │
│   - Validation          │
│   - Rate Limiting       │
│   - Storage             │
└─────────────────────────┘
```

---

## 📊 Data Flow

### 1. Initial Catalog Sync

```mermaid
Your POS → Extract Products → Map to Tracker IDs → POST /products/sync
```

### 2. Price Updates

```mermaid
POS Price Change → Sync Service → POST /prices/batch → Tracker KE → Live Site
```

### 3. Inventory Updates

```mermaid
Stock Change → Sync Service → Update stock_status → Customer sees availability
```

---

## ✅ Testing Checklist

Before going live, test:

- [ ] **Authentication**: Can you connect to the API?
- [ ] **Product Mapping**: Are all your products mapped correctly?
- [ ] **Single Update**: Can you update one price?
- [ ] **Batch Update**: Can you update 10+ prices at once?
- [ ] **Error Handling**: What happens if a product doesn't exist?
- [ ] **Rate Limiting**: Can you handle 429 errors gracefully?
- [ ] **Monitoring**: Are you logging all API calls?
- [ ] **Alerts**: Will you know if syncing fails?

---

## 🚨 Error Handling Best Practices

### Retry Logic

```python
import time

def send_with_retry(url, data, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:  # Rate limit
                wait_time = int(response.headers.get('Retry-After', 60))
                print(f"Rate limited. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"Error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(2 ** attempt)  # Exponential backoff
    
    return None
```

### Logging

```python
import logging

logging.basicConfig(
    filename='/var/log/tracker_sync.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def sync_with_logging():
    logging.info("Starting price sync")
    try:
        result = sync_prices()
        logging.info(f"Synced {result['successful']} prices")
    except Exception as e:
        logging.error(f"Sync failed: {e}")
```

---

## 📈 Monitoring & Analytics

### Track These Metrics

1. **Sync Success Rate**: % of successful API calls
2. **Response Time**: Average API response time
3. **Error Rate**: Number of failed requests
4. **Data Freshness**: Time since last successful sync

### Simple Monitoring Script

```bash
#!/bin/bash
# monitor_sync.sh

LOG_FILE="/var/log/tracker_sync.log"
ALERT_EMAIL="admin@yourstore.com"

# Check if sync ran in last 2 hours
LAST_SYNC=$(grep "Success" $LOG_FILE | tail -1 | cut -d' ' -f1-2)
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M')

if [ -z "$LAST_SYNC" ]; then
    echo "WARNING: No successful sync found!" | mail -s "Tracker Sync Alert" $ALERT_EMAIL
fi
```

---

## 🎓 Common Scenarios

### Scenario 1: New Product Added to Your Store

```python
# 1. Get Tracker KE product catalog
products = get_tracker_products()

# 2. Search for your new product
new_sku = "SKU-999"
new_product_name = "New Energy Drink"

matching_product = find_matching_product(products, new_product_name)

if matching_product:
    # 3. Add to your mapping
    save_mapping(new_sku, matching_product['id'])
    
    # 4. Send initial price
    update_price(matching_product['id'], 120.00)
else:
    # 5. Contact Tracker KE to add product
    print("Product not in catalog. Contact support.")
```

### Scenario 2: Price Changed in POS

```python
# Option A: Real-time update
def on_price_change_in_pos(sku, new_price):
    tracker_id = get_tracker_id(sku)
    update_single_price(tracker_id, new_price)

# Option B: Wait for next scheduled sync
# (Recommended for busy stores)
```

### Scenario 3: Out of Stock

```python
def mark_out_of_stock(sku):
    tracker_id = get_tracker_id(sku)
    
    # Still send current price, but mark as out of stock
    update_price(
        tracker_id,
        current_price,
        stock_status='out_of_stock'
    )
```

---

## 🔐 Security Best Practices

1. **Store Credentials Securely**
   ```bash
   # Use environment variables
   export TRACKER_API_KEY="pk_live_xxxxx"
   export TRACKER_API_SECRET="sk_secret_xxxxx"
   
   # Never commit to Git!
   echo "credentials.json" >> .gitignore
   ```

2. **Use Request Signing for Production**
   - See API docs for HMAC signing example
   - Prevents request tampering

3. **IP Whitelisting** (Optional)
   - Contact us to whitelist your server IPs
   - Extra security layer

4. **Rotate API Keys Quarterly**
   - Generate new keys every 3 months
   - Update in your system
   - Revoke old keys

---

## 🆘 Troubleshooting

### Problem: "401 Unauthorized"

**Solution:**
- Check API key is correct
- Verify you're using demo key in demo mode
- Check Authorization header format

### Problem: "404 Product Not Found"

**Solution:**
- Verify product exists: `/products?search=product_name`
- Check your product mapping
- Contact support to add product

### Problem: "429 Rate Limit Exceeded"

**Solution:**
- Reduce request frequency
- Use batch endpoints
- Implement exponential backoff
- Contact us for higher limits

### Problem: Prices Not Updating on Site

**Solution:**
- Check you're using live API key (not demo)
- Verify successful API response
- Clear cache (prices update within 1 minute)
- Check product is active

---

## 📞 Support

### Getting Help

1. **Check Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. **Email Support**: api-support@tracker.ke
3. **Emergency Hotline**: +254-XXX-XXXXXX (24/7)
4. **Status Page**: https://status.tracker.ke

### When Contacting Support, Include:

- Your supermarket ID
- API request/response logs
- Error messages
- Steps to reproduce
- Expected vs actual behavior

---

## 🎉 Go Live Checklist

Before switching from demo to live:

- [ ] All products mapped correctly
- [ ] Test sync successful (10+ products)
- [ ] Automated sync scheduled (cron/task)
- [ ] Error handling implemented
- [ ] Monitoring/alerting set up
- [ ] Team trained on troubleshooting
- [ ] Support contacts saved
- [ ] Backup plan in place
- [ ] Switch to live API key
- [ ] Verify prices appear on site

---

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Full API reference
- [Code Examples](./examples/) - Sample implementations
- [Postman Collection](./tracker-ke-api.postman_collection.json) - Import and test
- [Video Tutorial](https://youtube.com/tracker-ke-integration) - Step-by-step walkthrough

---

**Need Help?** We're here to support your integration journey! 🚀

Contact: api-support@tracker.ke | +254-XXX-XXXXXX
