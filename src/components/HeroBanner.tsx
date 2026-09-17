import hero from "../assets/banners/hero.png";
export default function HeroBanner() {
  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        borderRadius: "20px",
        padding: "30px 20px",
        marginBottom: "20px",
        textAlign: "center",
      }}
    >
      <img
  src={hero}
 alt="Bindra Hosiery Banner"
  style={{
    width: "100%",
    borderRadius: "16px",
    marginBottom: "20px",
  }}
/>
      <p
        style={{
          marginTop: "10px",
          color: "#ddd",
        }}
      >
        Comfortable • Stylish • Affordable
      </p>

      <button
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          borderRadius: "10px",
          border: "none",
          background: "#fff",
          color: "#111",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Shop Now
      </button>
    </div>
  );
}