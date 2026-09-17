import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import CartProvider from "./context/CartContext";
import OrderProvider from "./context/OrderContext";
import AuthProvider from "./context/AuthContext";
import WishlistProvider from "./context/WishlistContext";
import AddressProvider from "./context/AddressContext";
import ProductProvider from "./context/ProductContext";
import CategoryProvider from "./context/CategoryContext";
import PaymentProvider from "./context/PaymentContext";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <CartProvider>
  <WishlistProvider>
    <OrderProvider>
      <PaymentProvider>
        <AuthProvider>
          <AddressProvider>
            <CategoryProvider>
              <ProductProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </ProductProvider>
            </CategoryProvider>
          </AddressProvider>
        </AuthProvider>
      </PaymentProvider>
    </OrderProvider>
  </WishlistProvider>
</CartProvider>
</StrictMode>
)
