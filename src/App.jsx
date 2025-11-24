import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import AddPrice from './pages/AddPrice';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import SearchPage from './pages/Search';
import EditProfile from './pages/EditProfile';
import Submissions from './pages/Submissions';
import Achievements from './pages/Achievements';
import HelpSupport from './pages/HelpSupport';
import SupermarketTrending from './pages/SupermarketTrending';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/supermarket/:id" element={<SupermarketTrending />} />
            <Route path="/add-price" element={<AddPrice />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/submissions" element={<Submissions />} />
            <Route path="/profile/achievements" element={<Achievements />} />
            <Route path="/profile/stats" element={<Submissions />} />
            <Route path="/help" element={<HelpSupport />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
