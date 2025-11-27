# Admin Panel - Data Mode System

## Quick Reference

### Current Mode Indicator
Look for the **orange banner** at the top of any admin page:
- **Visible**: You're in **Demo Mode** (testing data)
- **Not visible**: You're in **Live Mode** (production data)

### Switching Modes
1. Go to **Data Management** page
2. Use the toggle switch to change between Demo and Live
3. All admin pages will update automatically

### What Each Mode Shows

**Demo Mode** 🟠
- Shows test/training data (`isDemo === true`)
- Safe for experimentation
- **NOT** visible to public users
- New data created here is tagged as demo

**Live Mode** 🟢
- Shows production data (`isDemo !== true`)
- What public users see
- Changes affect the live website
- New data created here is live/production

### Data Creation Rules

When you create new data (products, supermarkets, etc.), it's automatically tagged based on your current mode:

```javascript
// In Demo Mode
{ name: "Test Product", isDemo: true }  // Won't appear on public site

// In Live Mode
{ name: "Real Product" }  // Will appear on public site
```

### Important Notes

⚠️ **The public website ALWAYS shows Live data only**
- Public site is NOT affected by your admin mode
- Demo data is NEVER visible to regular users
- Only affects what YOU see in the admin panel

📊 **Statistics update when you switch modes**
- Dashboard counts reflect current mode
- Recent activity shows current mode data only

🔄 **Mode is saved in your browser**
- Your mode choice persists between sessions
- Stored in localStorage

### Common Tasks

**Testing a new feature:**
1. Switch to Demo Mode
2. Create test data
3. Test the feature
4. Switch to Live Mode when ready for production

**Training a new admin:**
1. Keep them in Demo Mode
2. Let them practice without risk
3. Switch to Live when they're ready

**Making live changes:**
1. Switch to Live Mode
2. Make your changes
3. Verify on the public site

### Questions?

See `docs/DATA_SEPARATION.md` for complete technical documentation.
