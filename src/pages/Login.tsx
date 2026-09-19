import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const { login, setIsGuest, setIsLoggedIn } = useAuth();

  const handleLogin = () => {
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    login(mobile);
    navigate("/home");
  };

  const handleGuest = () => {
    setIsGuest(true);
    setIsLoggedIn(false);
    navigate("/home");
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
          padding: "38px 30px 32px",
          boxSizing: "border-box",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Brand */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "34px",
          }}
        >
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
              fontSize: "32px",
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

        {/* Welcome */}
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "24px",
              color: "#171717",
              fontWeight: "650",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              margin: "8px 0 0",
              color: "#777",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            Login to continue shopping with us.
          </p>
        </div>

        {/* Mobile Number */}
        <label
          style={{
            display: "block",
            marginBottom: "9px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#222",
          }}
        >
          Mobile Number
        </label>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #d7d2cc",
            borderRadius: "13px",
            overflow: "hidden",
            background: "#faf9f7",
          }}
        >
          <span
            style={{
              padding: "0 12px",
              fontSize: "15px",
              fontWeight: "600",
              color: "#555",
              borderRight: "1px solid #ddd",
              lineHeight: "52px",
            }}
          >
            +91
          </span>

          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, ""))
            }
            style={{
              flex: 1,
              minWidth: 0,
              padding: "16px 14px",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "16px",
              color: "#111",
            }}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: "20px",
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

        <p
          style={{
            textAlign: "center",
            margin: "20px 0 0",
            fontSize: "11px",
            color: "#999",
            lineHeight: "1.5",
          }}
        >
          Shop comfortably with Bindra Hosiery
        </p>
      </div>
    </main>
  );
}