import {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

export const CartContext = createContext<any>(null);

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<any[]>(() => {
    try {
      const savedCart = localStorage.getItem("cart");

      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to load cart:", error);
      return [];
    }
  });

  const [isGuest, setIsGuest] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error(
        "Cart could not be saved to localStorage:",
        error
      );

      // Cart will still work during the current session
    }
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        isGuest,
        setIsGuest,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () =>
  useContext(CartContext);