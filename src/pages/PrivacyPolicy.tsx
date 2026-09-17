import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
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
        Privacy Policy
      </h1>

      <p
        style={{
          color: "#555",
          marginBottom: "30px",
        }}
      >
        <strong>Last Updated:</strong>{" "}
        August 2026
      </p>

      <p style={{ color: "#222" }}>
        At <strong>Bindra Hosiery</strong>, we respect your privacy
        and are committed to protecting your
        personal information.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        1. Information We Collect
      </h2>

      <p style={{ color: "#222" }}>
        When you use our app or place an order,
        we may collect information such as:
      </p>

      <ul style={{ color: "#222" }}>
        <li>Name</li>
        <li>Mobile number</li>
        <li>Email address</li>
        <li>Delivery address</li>
        <li>Order and transaction details</li>
      </ul>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        2. How We Use Your Information
      </h2>

      <p style={{ color: "#222" }}>
        We use the information collected to:
      </p>

      <ul style={{ color: "#222" }}>
        <li>Process and deliver your orders</li>
        <li>Provide customer support</li>
        <li>Manage your account</li>
        <li>Process payments</li>
        <li>Improve our products and services</li>
      </ul>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        3. Payment Information
      </h2>

      <p style={{ color: "#222" }}>
        Payments made through our app are
        processed through our authorized payment
        gateway. We do not store your complete
        card, UPI, or banking credentials on our
        servers.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        4. Data Protection
      </h2>

      <p style={{ color: "#222" }}>
        We take reasonable measures to protect
        your personal information from
        unauthorized access, misuse, alteration,
        or disclosure.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        5. Sharing of Information
      </h2>

      <p style={{ color: "#222" }}>
        We do not sell or rent your personal
        information. Information may be shared
        with trusted service providers only when
        necessary to process payments, deliver
        orders, or provide required services.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        6. Cookies and Local Storage
      </h2>

      <p style={{ color: "#222" }}>
        Our app may use browser storage
        technologies such as local storage to
        remember information such as your cart
        and order data on your device.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        7. Your Choices
      </h2>

      <p style={{ color: "#222" }}>
        You may contact us if you want to update
        your personal information or have
        questions regarding how your information
        is handled.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        8. Children's Privacy
      </h2>

      <p style={{ color: "#222" }}>
        Bindra Hosiery sells kidswear and related
        products, but our services are intended
        for use by parents, guardians, and other
        adults. We do not knowingly collect
        personal information directly from
        children.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        9. Changes to This Policy
      </h2>

      <p style={{ color: "#222" }}>
        We may update this Privacy Policy from
        time to time. Any changes will be
        reflected on this page with an updated
        date.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        10. Contact Us
      </h2>

      <p style={{ color: "#222" }}>
        If you have any questions regarding this
        Privacy Policy or your personal
        information, please contact Bindra Hosiery through the contact
        details provided in the app.
      </p>
    </main>
  );
}