import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
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
        Terms & Conditions
      </h1>

      <p
        style={{
          color: "#555",
          marginBottom: "30px",
        }}
      >
        <strong>Last Updated:</strong> August 2026
      </p>

      <p style={{ color: "#222" }}>
        Welcome to <strong>Bindra Hosiery</strong>, a unit
        of Bindra Hosiery. By accessing or using
        our app, you agree to these Terms &
        Conditions.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        1. Use of Our App
      </h2>

      <p style={{ color: "#222" }}>
        You agree to use the Bindra Hosiery app only for
        lawful purposes and in accordance with
        these Terms & Conditions.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        2. Products and Pricing
      </h2>

      <p style={{ color: "#222" }}>
        We make reasonable efforts to ensure that
        product descriptions, images, prices, sizes,
        and availability are accurate. However,
        minor variations in colour, appearance, or
        packaging may occur.
      </p>

      <p style={{ color: "#222" }}>
        Product prices and availability may change
        without prior notice.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        3. Orders
      </h2>

      <p style={{ color: "#222" }}>
        When you place an order through Bindra Hosiery,
        you agree to provide accurate and complete
        information required for processing and
        delivery.
      </p>

      <p style={{ color: "#222" }}>
        An order is considered successfully placed
        after the payment has been successfully
        completed and verified.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        4. Payments
      </h2>

      <p style={{ color: "#222" }}>
        Payments are processed through our
        authorized payment gateway. We do not
        directly store your complete card, UPI, or
        banking credentials.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        5. Delivery
      </h2>

      <p style={{ color: "#222" }}>
        Delivery charges and delivery timelines may
        vary depending on the order value and
        delivery location.
      </p>

      <p style={{ color: "#222" }}>
        Delivery timelines are estimates and may be
        affected by circumstances beyond our
        control, including courier delays,
        weather, or other unforeseen events.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        6. Cancellation
      </h2>

      <p style={{ color: "#222" }}>
        Orders may be eligible for cancellation
        before they are processed or dispatched.
        Once an order has been dispatched,
        cancellation may no longer be possible.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        7. Returns and Exchanges
      </h2>

      <p style={{ color: "#222" }}>
        Returns and exchanges are subject to the
        Return & Exchange Policy provided by
        Bindra Hosiery.
      </p>

      <p style={{ color: "#222" }}>
        Products must meet the applicable
        eligibility requirements for an exchange or
        return.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        8. Account Information
      </h2>

      <p style={{ color: "#222" }}>
        You are responsible for providing accurate
        information when creating or using your
        account and for keeping your account
        information up to date.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        9. Intellectual Property
      </h2>

      <p style={{ color: "#222" }}>
        All content available through the Bindra Hosiery
        app, including logos, text, images, graphics,
        designs, and branding, belongs to Bindra Hosiery
        or its respective owners and may not be
        reproduced or used without permission.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        10. Limitation of Liability
      </h2>

      <p style={{ color: "#222" }}>
        Bindra Hosiery will make reasonable efforts to
        provide accurate information and reliable
        services. However, we are not responsible
        for delays, interruptions, or issues caused
        by circumstances outside our reasonable
        control.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        11. Changes to These Terms
      </h2>

      <p style={{ color: "#222" }}>
        We may update these Terms & Conditions
        from time to time. Changes will be posted
        on this page along with the updated date.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        12. Contact Us
      </h2>

      <p style={{ color: "#222" }}>
        If you have any questions about these Terms
        & Conditions, please contact Bindra Hosierythrough the contact details
        provided in the app.
      </p>
    </main> 
  );
}