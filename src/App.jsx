import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import SubmitPrice from './pages/SubmitPrice';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import MySubmissions from './pages/profile/MySubmissions';
import SearchPage from './pages/Search';
import SubmissionModeration from './pages/admin/SubmissionModeration';
import EditProfile from './pages/EditProfile';
import Achievements from './pages/Achievements';
import HelpSupport from './pages/HelpSupport';
import SupermarketTrending from './pages/SupermarketTrending';

import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductsManagement = lazy(() => import('./pages/admin/ProductsManagement'));
const SupermarketsManagement = lazy(() => import('./pages/admin/SupermarketsManagement'));
const Submissions = lazy(() => import('./pages/admin/Submissions'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));
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
            <Route path="/" element={<Home />} />
            <Route path="/product/:category/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/supermarket/:id" element={<SupermarketTrending />} />
            <Route path="/add-price" element={<SubmitPrice />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/submissions" element={<MySubmissions />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/achievements" element={<Achievements />} />
            <Route path="/help" element={<HelpSupport />} />
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
