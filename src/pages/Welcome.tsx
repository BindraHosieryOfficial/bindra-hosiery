import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Welcome() {
  const navigate = useNavigate();

const {
  setIsGuest,
  setIsLoggedIn,
} = useAuth();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* Logo will come here later */}

      <h1>Bindra Hosiery</h1>

      <h2
        style={{
          fontWeight: "700",
          marginTop: "-10px",
        }}
      >
        A Unit of Bindra Hosiery
      </h2>

      <p
        style={{
          marginTop: "20px",
          color: "#666",
        }}
      >
        Welcome to your trusted kidswear store.
      </p>

      <button
       onClick={() => {
  setIsGuest(true);
  setIsLoggedIn(false);
  navigate("/home");
}}
        style={{
          width: "100%",
          maxWidth: "320px",
          marginTop: "40px",
          padding: "16px",
          borderRadius: "12px",
          border: "none",
          background: "#111",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Open as Guest
      </button>

      <button
       onClick={() => navigate("/login")}
        style={{
          width: "100%",
          maxWidth: "320px",
          marginTop: "15px",
          padding: "16px",
          borderRadius: "12px",
          border: "2px solid #111",
          background: "#fff",
          color: "#111",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </main>
  );
}