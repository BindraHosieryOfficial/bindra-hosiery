import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function MyOrders() {
  const { orders, setOrders } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();
    const myOrders = orders.filter(
    (order: any) =>
      order.customer?.mobile === user?.mobile
  );
  function handleCancelOrder(orderId: number) {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmCancel) return;

  const updatedOrders = orders.map((order: any) =>
    order.id === orderId
      ? {
          ...order,
          status: "Cancelled",
        }
      : order
  );

  setOrders(updatedOrders);

  alert("Your order has been cancelled.");
}

  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>My Orders</h1>

      {myOrders.length === 0 ? (
        <div
          style={{
            padding: "20px",
            marginTop: "20px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h3>No Orders Yet</h3>

          <p style={{ color: "#666" }}>
            Your orders will appear here after you place one.
          </p>
        </div>
      ) : (
        [...myOrders].reverse().map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "14px",
              padding: "18px",
              marginTop: "20px",
              background: "#fff",
            }}
          >
            <h3>📦 Order #{order.id}</h3>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Date:</strong> {order.date}
            </p>

            <p>
              <strong>Items:</strong> {order.items.length}
            </p>

            <h2>₹{order.total}</h2>

            <button
              onClick={() =>
                navigate("/order-details", {
                  state: { order },
                })
              }
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "15px",
                border: "none",
                borderRadius: "10px",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              View Order Details
            </button>
            {(order.status === "Order Placed" ||
  order.status === "Confirmed") && (
  <button
    onClick={() => handleCancelOrder(order.id)}
    style={{
      width: "100%",
      padding: "14px",
      marginTop: "10px",
      border: "1px solid #d32f2f",
      borderRadius: "10px",
      background: "#fff",
      color: "#d32f2f",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    Cancel Order
  </button>
)}
          </div>
        ))
      )}
    </main>
  );
}