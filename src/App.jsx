import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Leaderboard from './pages/Leaderboard';
import SubmissionModeration from './pages/admin/SubmissionModeration';
import EditProfile from './pages/EditProfile';
import Achievements from './pages/Achievements';
import HelpSupport from './pages/HelpSupport';
import SupermarketTrending from './pages/SupermarketTrending';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy Imports
const Home = lazy(() => import('./pages/Home'));
const SearchPage = lazy(() => import('./pages/Search'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const SubmitPrice = lazy(() => import('./pages/SubmitPrice'));
const Profile = lazy(() => import('./pages/Profile'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const MySubmissions = lazy(() => import('./pages/profile/MySubmissions'));

// Admin Lazy Imports
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductsManagement = lazy(() => import('./pages/admin/ProductsManagement'));
const SupermarketsManagement = lazy(() => import('./pages/admin/SupermarketsManagement'));
const Submissions = lazy(() => import('./pages/admin/Submissions'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
const DataManagement = lazy(() => import('./pages/admin/DataManagement'));
const DataUtility = lazy(() => import('./pages/admin/DataUtility'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));

import PrivateRoute from './components/PrivateRoute';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
  </div>
);

import { Toaster } from 'react-hot-toast';
import CookieConsent from './components/auth/CookieConsent';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />
        <CookieConsent />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            } />
            <Route path="/product/:category/:id" element={
              <Suspense fallback={<PageLoader />}>
                <ProductDetail />
              </Suspense>
            } />
            <Route path="/search" element={
              <Suspense fallback={<PageLoader />}>
                <Search />
              </Suspense>
            } />
            <Route path="/supermarket/:id" element={<SupermarketTrending />} />
            <Route path="/add-price" element={
              <Suspense fallback={<PageLoader />}>
                <SubmitPrice />
              </Suspense>
            } />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            } />
            <Route path="/profile/submissions" element={
              <Suspense fallback={<PageLoader />}>
                <MySubmissions />
              </Suspense>
            } />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/achievements" element={<Achievements />} />
            <Route path="/help" element={<HelpSupport />} />
            <Route path="/how-it-works" element={
              <Suspense fallback={<PageLoader />}>
                <HowItWorks />
              </Suspense>
            } />
          </Route>
          <Route path="/login" element={<Login />} />


          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={
            <Suspense fallback={<PageLoader />}>
              <AdminLogin />
            </Suspense>
          } />

          <Route path="/admin" element={
            <PrivateRoute>
              <Suspense fallback={<PageLoader />}>
                <AdminLayout />
              </Suspense>
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={
              <Suspense fallback={<PageLoader />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="products" element={
              <Suspense fallback={<PageLoader />}>
                <ProductsManagement />
              </Suspense>
            } />
            <Route path="supermarkets" element={
              <Suspense fallback={<PageLoader />}>
                <SupermarketsManagement />
              </Suspense>
            } />
            <Route path="submissions" element={
              <Suspense fallback={<PageLoader />}>
                <Submissions />
              </Suspense>
            } />
            <Route path="moderation" element={
              <Suspense fallback={<PageLoader />}>
                <SubmissionModeration />
              </Suspense>
            } />
            <Route path="users" element={
              <Suspense fallback={<PageLoader />}>
                <UsersManagement />
              </Suspense>
            } />
            <Route path="data-management" element={
              <Suspense fallback={<PageLoader />}>
                <DataManagement />
              </Suspense>
            } />
            <Route path="data-utility" element={
              <Suspense fallback={<PageLoader />}>
                <DataUtility />
              </Suspense>
            } />
            <Route path="profile" element={
              <Suspense fallback={<PageLoader />}>
                <AdminProfile />
              </Suspense>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
