import { useNavigate } from "react-router-dom";

export default function CancellationRefundPolicy() {
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
        Cancellation & Refund Policy
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
        1. Order Cancellation
      </h2>

      <p style={{ color: "#222" }}>
        Customers may request cancellation of an
        order before the order has been processed
        or dispatched.
      </p>

      <p style={{ color: "#222" }}>
        Once an order has been dispatched, it may
        not be possible to cancel the order.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        2. Cancellation Request
      </h2>

      <p style={{ color: "#222" }}>
        To request cancellation, please contact
        Bindra Hosiery through the
        contact details provided in the app as soon
        as possible.
      </p>

      <p style={{ color: "#222" }}>
        Cancellation requests are subject to order
        processing status and may not always be
        accepted after processing has started.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        3. Refund Eligibility
      </h2>

      <p style={{ color: "#222" }}>
        If an eligible order is successfully
        cancelled after payment, the applicable
        refund will be processed to the original
        payment method or through the payment
        mechanism available to us.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        4. Refund Processing Time
      </h2>

      <p style={{ color: "#222" }}>
        Once a refund is approved, the time taken
        for the amount to reflect in the customer's
        account may depend on the payment gateway,
        bank, or financial institution.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        5. Failed Payments
      </h2>

      <p style={{ color: "#222" }}>
        If a payment is unsuccessful but the amount
        has been deducted from your bank account,
        please contact us with the relevant payment
        details. We will verify the transaction and
        assist accordingly.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        6. Duplicate Payments
      </h2>

      <p style={{ color: "#222" }}>
        If you believe that you have been charged
        more than once for the same order, please
        contact us with the transaction details so
        that we can verify the payment.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        7. Returns and Exchanges
      </h2>

      <p style={{ color: "#222" }}>
        Refunds related to eligible returns or
        exchanges are subject to our Return &
        Exchange Policy.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        8. Contact Us
      </h2>

      <p style={{ color: "#222" }}>
        For cancellation or refund-related
        questions, please contact Bindra Hosiery through the contact details
        provided in the app.
      </p>
    </main>
  );
}