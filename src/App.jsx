import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useProfile } from "./context/ProfileContext";

import HomePage from "./pages/Homepage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { ProductProvider } from "./context/ProductSelectionContext";
import Productpage from "./pages/Productpage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Cart from "./pages/cart";
import SearchButton from "./pages/SearchPage";
import Order from "./pages/Order";
import BuyNow from "./components/BuyNow";
import AdminPanel from "./pages/AdminPanel";
import DeliveryBoy from "./components/Delivery";


function App() {
  const location = useLocation();
  const { user, loading } = useProfile();

  if (loading) return null;

  const path = location.pathname.toLowerCase();

  /* ================= NOT LOGGED IN ================= */
  if (!user && !["/login", "/register"].includes(path)) {
    return <Navigate to="/login" replace />;
  }

  /* ================= ALREADY LOGGED IN ================= */
  if (user && ["/login", "/register"].includes(path)) {
    return <Navigate to="/" replace />;
  }

  return (
    <ProductProvider>

      {/* Header Hide On Login/Register */}
      {!["/login", "/register"].includes(path) && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Productpage />} />
        <Route path="/search" element={<SearchButton />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/buy-now" element={<BuyNow />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/delivery" element={<DeliveryBoy />} />
      </Routes>

      {/* Footer Hide On Login/Register */}
      {!["/login", "/register"].includes(path) && <Footer />}

    </ProductProvider>
  );
}

export default App;