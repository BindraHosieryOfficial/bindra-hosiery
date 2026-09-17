import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const OrderContext = createContext<any>(null);

const MAX_ORDERS = 50;

export default function OrderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orders, setOrdersState] = useState<any[]>(() => {
    try {
      const savedOrders = localStorage.getItem("orders");

      if (!savedOrders) {
        return [];
      }

      const parsedOrders = JSON.parse(savedOrders);

      if (!Array.isArray(parsedOrders)) {
        return [];
      }

      // Keep only the latest 50 orders.
      // This also removes old duplicate orders that may have
      // filled the browser's localStorage.
      return parsedOrders.slice(-MAX_ORDERS);
    } catch (error) {
      console.error("Failed to load orders:", error);
      return [];
    }
  });

  const setOrders = (
    value:
      | any[]
      | ((previousOrders: any[]) => any[])
  ) => {
    setOrdersState((previousOrders) => {
      const nextOrders =
        typeof value === "function"
          ? value(previousOrders)
          : value;

      const limitedOrders = nextOrders.slice(-MAX_ORDERS);

      return limitedOrders;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem(
        "orders",
        JSON.stringify(orders)
      );
    } catch (error) {
      console.error(
        "Unable to save orders to localStorage:",
        error
      );
    }
  }, [orders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrder must be used inside OrderProvider"
    );
  }

  return context;
}