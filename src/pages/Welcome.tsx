import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Welcome() {
  const navigate = useNavigate();

  const { setIsGuest, setIsLoggedIn } = useAuth();

  const handleGuest = () => {
    setIsGuest(true);
    setIsLoggedIn(false);
    navigate("/home");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #111111 0%, #191919 55%, #24201b 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "rgba(255,255,255,0.97)",
          borderRadius: "24px",
          padding: "45px 30px 35px",
          boxSizing: "border-box",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          textAlign: "center",
        }}
      >
        {/* Brand */}
        <div style={{ marginBottom: "42px" }}>
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "4px",
              fontWeight: "700",
              color: "#777",
              marginBottom: "8px",
            }}
          >
            BINDRA
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              letterSpacing: "1px",
              color: "#111",
              fontWeight: "700",
            }}
          >
            HOSIERY
          </h1>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: "13px",
              color: "#8a8178",
              fontStyle: "italic",
            }}
          >
            Where luxury meets comfort.
          </p>
        </div>

        {/* Welcome Message */}
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "25px",
              color: "#171717",
              fontWeight: "650",
            }}
          >
            Welcome
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              color: "#777",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Shop comfortably with Bindra Hosiery.
          </p>
        </div>

        {/* Login */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "13px",
            border: "none",
            background: "#111",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            letterSpacing: "0.3px",
          }}
        >
          Login
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "22px 0",
            color: "#aaa",
            fontSize: "12px",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#e5e1dc",
            }}
          />

          OR

          <div
            style={{
              flex: 1,
              height: "1px",
              background: "#e5e1dc",
            }}
          />
        </div>

        {/* Guest */}
        <button
          onClick={handleGuest}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "13px",
            border: "1px solid #cfc9c2",
            background: "#fff",
            color: "#222",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Continue as Guest
        </button>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            margin: "22px 0 0",
            fontSize: "11px",
            color: "#999",
            lineHeight: "1.5",
          }}
        >
          Your comfort, our priority.
        </p>
      </div>
    </main>
  );
}