# Twende Fun - Price Comparison Platform

**🏗️ Built by:** Dickson Otieno  
**🤖 AI Assistant:** Google Antigravity with Gemini 3 Pro  
**📅 Year:** 2025

> This project demonstrates the power of human-AI collaborative development, combining creative vision with AI-accelerated implementation.

---

## 🎯 Features

- **Real-time Price Comparison**: Compare prices across multiple supermarkets
- **User Submissions**: Community-driven price updates
- **Admin Panel**: Complete management system with data separation
- **Trending Products**: Track popular items
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🔐 Data Separation Architecture

This application implements a **strict data separation system** between Live and Demo environments:

### For Developers
- **Live Data**: Production data visible to public users (`isDemo !== true`)
- **Demo Data**: Test/training data for admin testing only (`isDemo === true`)
- Public site **ALWAYS** shows live data only
- Admin panel can toggle between modes

📚 **Complete Documentation**: See [`docs/DATA_SEPARATION.md`](docs/DATA_SEPARATION.md)

### For Admins
- Look for the **orange banner** in admin panel when in Demo Mode
- Switch modes in the **Data Management** page
- Test safely without affecting production

📖 **Quick Guide**: See [`src/pages/admin/README.md`](src/pages/admin/README.md)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Firebase account
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd twende-fun

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm run dev
```

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication (Email/Password, Google)
4. Copy your Firebase config to `.env`

## 📂 Project Structure

```
twende-fun/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/         # React contexts (Auth, Admin)
│   ├── hooks/           # Custom hooks (useFirestore, etc.)
│   ├── lib/             # Utilities and configurations
│   ├── pages/           # Page components
│   │   ├── admin/      # Admin panel pages
│   │   └── ...         # Public pages
│   └── ...
├── docs/               # Documentation
│   └── DATA_SEPARATION.md
└── ...
```

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Auth)
- **Icons**: Lucide React
- **Routing**: React Router

## 📖 Key Documentation

- **[Data Separation Architecture](docs/DATA_SEPARATION.md)** - Complete technical documentation
- **[Admin Guide](src/pages/admin/README.md)** - Quick reference for admin users

## 🔑 Admin Access

Default admin account (for development):
- Email: `admin@twende.fun`
- Password: Set during first Firebase initialization

⚠️ **Change default credentials in production!**

## 🧪 Testing the Data Separation

1. **Initialize Demo Data**: Use the "Initialize Data" button in Data Management (Demo Mode)
2. **Create Live Data**: Switch to Live Mode and add products/supermarkets
3. **Verify Public Site**: Check that only live data appears at `http://localhost:5173/`
4. **Verify Admin Panel**: Confirm statistics and data lists update when switching modes

## 📝 Development Guidelines

### Creating New Admin Features

When adding admin features that handle data:

1. Import `useAdmin` to access `viewMode`
2. Filter queries based on `isDemoMode`
3. Tag new data with `isDemo: true` when in Demo Mode
4. Add clear comments explaining the separation logic

Example:
```javascript
import { useAdmin } from '../../context/AdminContext';

function MyAdminComponent() {
  const { viewMode } = useAdmin();
  const isDemoMode = viewMode === 'demo';
  
  // Filter data by mode
  const filteredData = data.filter(item => 
    isDemoMode ? item.isDemo === true : item.isDemo !== true
  );
  
  // Tag new data when creating
  const newItem = {
    ...itemData,
    ...(isDemoMode && { isDemo: true })
  };
}
```

### Creating Public Features

Public features should **ALWAYS** filter out demo data:

```javascript
// Example: Fetching products for public display
const products = allProducts.filter(p => p.isDemo !== true);
```

## 🚢 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
firebase deploy
```

## 🏆 Credits & Attribution

### Developer
**Dickson Otieno** - Project Creator & Lead Developer
- Conceptualized and designed the entire application
- Defined architecture and requirements
- Directed all implementation decisions
- Conducted quality assurance and testing

### AI Development Assistant
**Google Antigravity with Gemini 3 Pro**
- AI-powered code generation and implementation
- Automated documentation creation
- Debugging assistance and optimization
- Best practices enforcement

### Development Methodology
This project showcases **human-AI collaborative development**:
- 🧠 **Human**: Vision, architecture, decisions, oversight
- 🤖 **AI**: Implementation, optimization, documentation, acceleration

For detailed attribution, see [`CREDITS.md`](CREDITS.md)

## 📄 License

© 2025 Dickson Otieno. All rights reserved.

**Technology Attribution:**
- Built using Google Antigravity AI coding assistant
- Powered by Gemini 3 Pro model
- Developed with human oversight and direction

## 🆘 Support

For issues or questions:
- Check documentation in `docs/`
- Review inline code comments
- See `CREDITS.md` for attribution details
- Contact: Dickson Otieno

---

**Note on AI Usage:** This codebase was developed using Google's Antigravity AI assistant. 
All code has been reviewed and approved by Dickson Otieno. The AI served as an accelerator 
tool while maintaining human creative control and decision-making authority.

*Last Updated: 2025-11-28*
