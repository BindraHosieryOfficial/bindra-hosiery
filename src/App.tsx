import BottomNavigation from "./components/BottomNavigation";
import Productlist from "./components/Productlist";
import Header from "./components/Header";
import SearchBar from "./components/Searchbar";
import CategoryButtons from "./components/CategoryButtons";
import HeroBanner from "./components/HeroBanner";

import { Routes, Route } from "react-router-dom";

import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import EditProfile from "./pages/EditProfile";
import SavedAddresses from "./pages/SavedAddresses";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminCategories from "./pages/AdminCategories";
import AdminAnalytics from "./pages/AdminAnalytics";
import ManagerManagement from "./pages/ManagerManagement";

import CategoryProvider from "./context/CategoryContext";

import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import ShippingPolicy from "./pages/ShippingPolicy";
import CancellationRefundPolicy from "./pages/CancellationRefundPolicy";
import ReturnExchangePolicy from "./pages/ReturnExchangePolicy";
import ContactUs from "./pages/ContactUs";
import AboutBindraHosiery from "./pages/AboutBindraHosiery";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import { useState } from "react";

export default function App() {
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <CategoryProvider>
      <Routes>
        {/* Welcome */}
      <Route path="/" element={<Login />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Home */}
        <Route
          path="/home"
          element={
            <main
              style={{
                minHeight: "100vh",
                background: "#f5f5f5",
                padding: "20px",
                paddingBottom: "90px",
                fontFamily: "Arial, sans-serif",
                maxWidth: "450px",
                margin: "0 auto",
              }}
            >
              <Header />

              <HeroBanner />

              <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
              />

              <CategoryButtons
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              <Productlist
                searchText={searchText}
                selectedCategory={selectedCategory}
              />

              <BottomNavigation />
            </main>
          }
        />

        {/* Customer Pages */}
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/saved-addresses" element={<SavedAddresses />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-details" element={<OrderDetails />} />

        {/* Legal / Information Pages */}
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditions />}
        />

        <Route
          path="/shipping-policy"
          element={<ShippingPolicy />}
        />

        <Route
          path="/cancellation-refund-policy"
          element={<CancellationRefundPolicy />}
        />

        <Route
          path="/return-exchange-policy"
          element={<ReturnExchangePolicy />}
        />

        <Route
          path="/contact-us"
          element={<ContactUs />}
        />

      <Route
  path="/about-bindra-hosiery"
  element={<AboutBindraHosiery />}
/>
        {/* Admin Login */}
        <Route
          path="/admin-login"
          element={<AdminDashboard />}
        />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/products/add"
            element={<AddProduct />}
          />

          <Route
            path="/admin/products/edit/:id"
            element={<EditProduct />}
          />

          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />

          <Route
            path="/admin/managers"
            element={<ManagerManagement />}
          />
        </Route>
      </Routes>
    </CategoryProvider>
  );
}