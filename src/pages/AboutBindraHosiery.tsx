import { useNavigate } from "react-router-dom";

export default function AboutBindraHosiery() {
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
        About Bindra Hosiery
      </h1>


      <p style={{ color: "#222" }}>
        Welcome to <strong>Bindra Hosiery</strong>, a
        trusted kidswear Shop
      </p>

      <p style={{ color: "#222" }}>
        Bindra Hosiery is created with a simple goal —
        to make shopping for kidswear and everyday
        essentials convenient, reliable, and
        comfortable for parents and families.
      </p>

      <h2
        style={{
          color: "#111",
          marginTop: "30px",
        }}
      >
        Our Products
      </h2>

      <p style={{ color: "#222" }}>
        We offer a range of kidswear and related
        essentials selected with comfort,
        practicality, and everyday use in mind.
      </p>

      <p style={{ color: "#222" }}>
        Our product range may include clothing,
        innerwear, socks, thermal wear, newborn
        accessories, and other seasonal essentials.
      </p>

      <h2
        style={{
          color: "#111",
          marginTop: "30px",
        }}
      >
        Our Promise
      </h2>

      <p style={{ color: "#222" }}>
        We aim to provide a simple shopping
        experience, clear product information,
        reliable order processing, and helpful
        customer support.
      </p>

      <h2
        style={{
          color: "#111",
          marginTop: "30px",
        }}
      >
        Bindra Hosiery
      </h2>

      <p style={{ color: "#222" }}>
      Our experience in retail helps us
        understand the everyday needs of parents
        and families while selecting products for
        our customers.
      </p>

      <h2
        style={{
          color: "#111",
          marginTop: "30px",
        }}
      >
        Thank You
      </h2>

      <p style={{ color: "#222" }}>
        Thank you for choosing Bindra Hosiery. We
        appreciate your trust and look forward to
        serving you.
      </p>
    </main>
  );
}