import { useNavigate } from "react-router-dom";

export default function ReturnExchangePolicy() {
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
        Return & Exchange Policy
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
        At <strong>Bindra Hosiery</strong>, we want you
        to be satisfied with your purchase. Our
        return and exchange policy is designed to
        make the process simple and transparent.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        1. Exchange Policy
      </h2>

      <p style={{ color: "#222" }}>
        Eligible products may be exchanged if they
        meet the conditions mentioned in this
        policy.
      </p>

      <p style={{ color: "#222" }}>
        Exchange requests should be raised within
        the applicable exchange period from the
        date of delivery.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        2. Product Eligibility
      </h2>

      <p style={{ color: "#222" }}>
        To be eligible for an exchange, the product
        should generally be unused, unworn, and in
        its original condition with the original
        packaging, tags, and accessories where
        applicable.
      </p>

      <p style={{ color: "#222" }}>
        Products showing signs of use, damage,
        washing, alteration, or missing original
        packaging may not be eligible for exchange.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        3. Wrong or Damaged Product
      </h2>

      <p style={{ color: "#222" }}>
        If you receive a wrong, defective, or
        damaged product, please contact us as soon
        as possible after delivery with your order
        details and relevant photographs.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        4. Return Policy
      </h2>

      <p style={{ color: "#222" }}>
        Returns are currently not available unless
        specifically approved by Bindra Hosiery for an eligible case.
      </p>

      <p style={{ color: "#222" }}>
        Any approved return and refund will be
        processed according to the applicable
        cancellation and refund terms.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        5. Refund for Approved Returns
      </h2>

      <p style={{ color: "#222" }}>
        Where a return is approved and a refund is
        applicable, the refund amount may be subject
        to applicable deductions or charges as
        communicated at the time of approval.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        6. Exchange Availability
      </h2>

      <p style={{ color: "#222" }}>
        Exchanges are subject to availability of the
        requested product, size, and/or variant.
        If the requested replacement is unavailable,
        we may provide an alternative resolution
        where applicable.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        7. How to Request an Exchange
      </h2>

      <p style={{ color: "#222" }}>
        To request an exchange, contact Bindra Hosiery through the contact details
        provided in the app and provide your order
        number and the reason for the exchange.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        8. Shipping for Exchange
      </h2>

      <p style={{ color: "#222" }}>
        Exchange pickup and delivery arrangements
        may depend on the delivery location and
        courier availability. Any applicable charges
        will be communicated to the customer before
        the exchange is processed.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        9. Final Decision
      </h2>

      <p style={{ color: "#222" }}>
        Eligibility for an exchange or approved
        return will be determined after reviewing
        the product condition and the details of the
        request.
      </p>

      <h2 style={{ color: "#111", marginTop: "30px" }}>
        10. Contact Us
      </h2>

      <p style={{ color: "#222" }}>
        For return or exchange-related questions,
        please contact Bindra Hosiery through the contact details provided in the
        app.
      </p>
    </main>
  );
}