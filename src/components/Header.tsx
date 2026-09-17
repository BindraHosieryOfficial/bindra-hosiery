export default function Header() {
  return (
    <header
      style={{
        padding: "24px 20px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        marginBottom: "20px",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "30px",
          fontWeight: "bold",
          color: "#111",
          textAlign: "center",
        }}
      >
       Bindra Hosiery
      </h1>

      <p
        style={{
          marginTop: "8px",
          marginBottom: 0,
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
        }}
      >
        Where Luxury Meets Comfort
      </p>
    </header>
  );
}