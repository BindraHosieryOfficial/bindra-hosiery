import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddress } from "../context/AddressContext";

export default function AddAddress() {
  const navigate = useNavigate();
  const { addresses, setAddresses } = useAddress();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [house, setHouse] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("Home");

  function handleSave() {
  const newAddress = {
    id: Date.now(),
    name,
    mobile,
    house,
    area,
    landmark,
    pincode,
    city,
    state,
    type,
    isDefault: addresses.length === 0,
  };

  setAddresses([...addresses, newAddress]);

  alert("Address Saved Successfully!");

  navigate("/saved-addresses");
}

  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Add Address</h1>

      <Input label="Full Name" value={name} setValue={setName} />
      <Input label="Mobile Number" value={mobile} setValue={setMobile} />
      <Input label="House / Flat / Building" value={house} setValue={setHouse} />
      <Input label="Area / Street / Locality" value={area} setValue={setArea} />
      <Input label="Landmark (Optional)" value={landmark} setValue={setLandmark} />
      <Input label="Pincode" value={pincode} setValue={setPincode} />
      <Input label="City" value={city} setValue={setCity} />
      <Input label="State" value={state} setValue={setState} />

      <p style={{ marginTop: "20px" }}>Address Type</p>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={inputStyle}
      >
        <option>Home</option>
        <option>Work</option>
        <option>Other</option>
      </select>

      <button
        onClick={handleSave}
        style={buttonStyle}
      >
        Save Address
      </button>
    </main>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
}) {
  return (
    <>
      <p>{label}</p>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={inputStyle}
      />
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
};

const buttonStyle = {
  width: "100%",
  padding: "16px",
  marginTop: "20px",
  border: "none",
  borderRadius: "12px",
  background: "#111",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};