import { useNavigate } from "react-router-dom";

export default function ContactUs() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#fff",
        color: "#111",
        maxWidth: "850px",
        margin: "0 auto",
        padding: "30px 20px 60px",
        lineHeight: "1.7",
        boxSizing: "border-box",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 16px",
          marginBottom: "30px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
          color: "#111",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        ← Back
      </button>

      <h1
        style={{
          color: "#111",
          fontSize: "32px",
          marginBottom: "10px",
        }}
      >
        Contact Us
      </h1>

      <p
        style={{
          color: "#555",
          marginBottom: "30px",
        }}
      >
        We’re here to help with your orders,
        products, delivery, payments, and other
        questions.
      </p>

      <section
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            color: "#111",
            marginTop: 0,
          }}
        >
          Bindra Hosiery
        </h2>

        <p style={{ color: "#222" }}>
          For customer support, please contact us
          through the contact details provided by
          Bindra Hosiery.
        </p>
      </section>

      <h2
        style={{
          color: "#111",
          marginTop: "30px",
        }}
      >
        Customer Support
      </h2>

      <p style={{ color: "#222" }}>
        For assistance regarding an order, please
        keep your order number ready when
        contacting us.
      </p>

      <ul style={{ color: "#222" }}>
        <li>Order and payment related queries</li>
        <li>Delivery related queries</li>
        <li>Product related questions</li>
        <li>Return and exchange requests</li>
        <li>Cancellation and refund queries</li>
      </ul>

      <h2
        style={{
          color: "#111",
          marginTop: "30px",
        }}
      >
        Business Information
      </h2>

      <p style={{ color: "#222" }}>
        <strong>Business:</strong> Bindra Hosiery
      </p>

      <p style={{ color: "#222" }}>
        <strong>Type:</strong> Kidswear & related
        products
      </p>

      <p
        style={{
          color: "#555",
          marginTop: "35px",
          fontSize: "14px",
        }}
      >
        Please use the official contact details
        provided by Bindra Hosiery for
        customer support.
      </p>
    </main>
  );
}