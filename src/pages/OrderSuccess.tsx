import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "70px",
          marginBottom: "20px",
        }}
      >
        ✅
      </div>

      <h1
  style={{
    fontSize: "28px",
    lineHeight: "36px",
    marginBottom: "15px",
  }}
>
  Order Placed Successfully!
</h1>

      <p style={{ marginTop: "15px" }}>
        Thank you for shopping with Bindra Hosiery.
      </p>

      <p style={{ marginTop: "10px" }}>
        Your order has been received successfully.
      </p>

      <button
        onClick={() => navigate("/")}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "35px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Continue Shopping
      </button>
    </main>
  );
}