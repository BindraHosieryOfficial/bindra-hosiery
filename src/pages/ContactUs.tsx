
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
  const navigate = useNavigate();

  const whatsappNumber = "917838611404";
  const whatsappMessage = encodeURIComponent(
    "Hello Bindra Hosiery, I need help with my order/product."
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

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
          Have a question? Chat with us directly on WhatsApp.
          We’ll be happy to help you.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
          padding: "10px 14px",
maxWidth: "320px",
margin: "20px auto 0",
            marginTop: "20px",
            boxSizing: "border-box",
            borderRadius: "10px",
            background: "#25D366",
            color: "#fff",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "700",
          }}
        >
          <span style={{ fontSize: "20px" }}>☏</span>
          Chat with us on WhatsApp
        </a>

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
        For customer support, please contact us
        using the WhatsApp button above.
      </p>
    </main>
  );
}
