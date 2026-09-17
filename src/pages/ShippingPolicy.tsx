import { useNavigate } from "react-router-dom";

export default function ShippingPolicy() {
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
        Shipping & Delivery Policy
      </h1>

      <p
        style={{
          color: "#555",
          marginBottom: "30px",
        }}
      >
        <strong>Last Updated:</strong> August 2026
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        1. Order Processing
      </h2>

      <p style={{ color: "#222" }}>
        Orders placed through Bindra Hosiery are
        processed after successful payment
        verification. We aim to process and
        dispatch orders as soon as reasonably
        possible.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        2. Delivery Areas
      </h2>

      <p style={{ color: "#222" }}>
        We currently provide delivery services to
        locations supported by our available
        delivery partners. Delivery availability
        may depend on the pincode entered during
        checkout.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        3. Delivery Charges
      </h2>

      <p style={{ color: "#222" }}>
        Delivery charges are calculated based on
        the order value and delivery location.
        Applicable delivery charges will be
        displayed during checkout before payment.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        4. Estimated Delivery Time
      </h2>

      <p style={{ color: "#222" }}>
        Delivery times may vary depending on the
        destination, courier availability, weather,
        and other circumstances.
      </p>

      <p style={{ color: "#222" }}>
        Any delivery timeline displayed during
        checkout is an estimate and not a guaranteed
        delivery date.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        5. Courier Delays
      </h2>

      <p style={{ color: "#222" }}>
        Delays caused by courier partners,
        transportation issues, weather conditions,
        strikes, natural events, or other
        circumstances beyond our reasonable control
        may occur.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        6. Incorrect Delivery Information
      </h2>

      <p style={{ color: "#222" }}>
        Customers are responsible for providing
        accurate name, mobile number, address, and
        pincode information during checkout.
      </p>

      <p style={{ color: "#222" }}>
        Bindra Hosiery may not be responsible for delays
        or failed delivery caused by incorrect or
        incomplete information provided by the
        customer.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        7. Delivery Attempts
      </h2>

      <p style={{ color: "#222" }}>
        Our delivery partner may make multiple
        delivery attempts according to its
        operational policies. Customers should
        remain available at the provided delivery
        address or coordinate with the courier when
        required.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        8. Damaged or Incorrect Package
      </h2>

      <p style={{ color: "#222" }}>
        If you receive a package that appears
        damaged, tampered with, or contains an
        incorrect product, please contact us as soon
        as possible after delivery.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        9. Contact Us
      </h2>

      <p style={{ color: "#222" }}>
        For questions regarding shipping or
        delivery, please contact Bindra Hosiery through the contact details
        provided in the app.
      </p>
    </main>
  );
}