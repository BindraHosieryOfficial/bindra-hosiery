import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  function handleSave() {
    setUser({
      ...user,
      name,
      email,
    });

    alert("Profile Updated Successfully");
    navigate("/profile");
  }

  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h2>Edit Profile</h2>

      <p>Name</p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <p>Mobile Number</p>

      <input
        value={user.mobile}
        disabled
        style={inputStyle}
      />

      <p>Email (Optional)</p>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      <button
        onClick={handleSave}
        style={buttonStyle}
      >
        Save Changes
      </button>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginBottom: "20px",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  background: "#111",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};