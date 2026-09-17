import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

const { login } = useAuth();
  return (
    <main
      style={{
        minHeight: "100vh",
        maxWidth: "450px",
        margin: "0 auto",
        padding: "30px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h1>Login</h1>

      <h2
        style={{
          fontSize: "18px",
          marginBottom: "30px",
        }}
      >
        Welcome back to Bindra Hosiery
      </h2>

      <label
        style={{
          marginBottom: "10px",
          fontWeight: "600",
        }}
      >
        Mobile Number
      </label>

      <input
        type="tel"
        placeholder="Enter your mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        style={{
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />

      <button
       onClick={() => {
    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

   login(mobile);

alert("Login Successful (Demo)");

navigate("/home");
  }}
        style={{
          marginTop: "25px",
          padding: "16px",
          borderRadius: "12px",
          border: "none",
          background: "#111",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Send OTP
      </button>
    </main>
  );
}
