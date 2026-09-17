import { useLocation, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  if (!order) {
    return (
      <main
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>Order Not Found</h2>

        <button
          onClick={() => navigate("/my-orders")}
          style={{
            marginTop: "20px",
            padding: "14px 24px",
            border: "none",
            borderRadius: "10px",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Back to Orders
        </button>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Order Details</h1>

      <p>
        <strong>Order ID:</strong> #{order.id}
      </p>

      <p>
        <strong>Date:</strong> {order.date}
      </p>

      <p>
        <strong>Status:</strong> {order.status}
      </p>

      {order.status === "Cancelled" && (
        <section
          style={{
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            background: "#fafafa",
          }}
        >
          <p>
            <strong>Cancellation Reason:</strong>{" "}
            {order.cancelReason || "Other"}
          </p>

          <p
            style={{
              marginTop: "12px",
              color: "#444",
              lineHeight: "1.5",
            }}
          >
            <strong>Message:</strong>{" "}
            {order.cancelMessage ||
              "Your order has been cancelled. We apologize for the inconvenience."}
          </p>

          <p style={{ marginTop: "12px" }}>
            <strong>Refund Status:</strong>{" "}
            {order.refundStatus || "Pending"}
          </p>

          <p
            style={{
              marginTop: "12px",
              color: "#444",
            }}
          >
            Your prepaid payment is eligible for a refund. Our team will
            contact you if any additional information is required.
          </p>

          <p
            style={{
              fontWeight: "600",
              marginTop: "8px",
            }}
          >
            Expected refund time: 5–7 Business Days.
          </p>
        </section>
      )}

      <hr style={{ margin: "25px 0" }} />

      <h2>Items Ordered</h2>

      {order.items && order.items.length > 0 ? (
        order.items.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
              borderBottom: "1px solid #eee",
              paddingBottom: "15px",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ marginTop: 0 }}>{item.name}</h3>

              <p>Size: {item.size || "N/A"}</p>

              <p>Qty: {item.quantity}</p>

              <p>Price: ₹{item.price}</p>

              <p>
                <strong>
                  Item Total: ₹{item.price * item.quantity}
                </strong>
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No items found for this order.</p>
      )}

      <hr />

      <h2>Total: ₹{order.total}</h2>

      <button
        onClick={() => navigate("/my-orders")}
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "20px",
          border: "none",
          borderRadius: "10px",
          background: "#111",
          color: "#fff",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Back to Orders
      </button>
    </main>
  );
}