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
  const [checkingPincode, setCheckingPincode] = useState(false);

  async function handleSave() {
    const cleanPincode = pincode.trim();

    // Basic PIN code validation
    if (!/^\d{6}$/.test(cleanPincode)) {
      alert("Please enter a valid 6-digit Indian pincode.");
      return;
    }

    // Verify that the PIN code actually exists in India
    try {
      setCheckingPincode(true);

      const response = await fetch(
        `https://api.postalpincode.in/pincode/${cleanPincode}`
      );

      if (!response.ok) {
        throw new Error("Pincode verification failed");
      }

      const data = await response.json();

      if (
        !Array.isArray(data) ||
        data.length === 0 ||
        data[0]?.Status !== "Success" ||
        !Array.isArray(data[0]?.PostOffice) ||
        data[0].PostOffice.length === 0
      ) {
        alert(
          "This pincode is not eligible for delivery. We currently deliver only within India."
        );
        return;
      }

      const firstPostOffice = data[0].PostOffice[0];

      const verifiedCity =
        firstPostOffice?.District ||
        firstPostOffice?.Division ||
        city;

      const verifiedState =
        firstPostOffice?.State ||
        state;

      const newAddress = {
        id: Date.now(),
        name,
        mobile,
        house,
        area,
        landmark,
        pincode: cleanPincode,
        city: verifiedCity,
        state: verifiedState,
        type,
        isDefault: addresses.length === 0,
      };

      setAddresses([...addresses, newAddress]);

      alert("Address Saved Successfully!");

      navigate("/saved-addresses");
    } catch (error) {
      console.error("Pincode verification error:", error);

      alert(
        "Unable to verify this pincode right now. Please check the pincode and try again."
      );
    } finally {
      setCheckingPincode(false);
    }
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
      <Input
        label="House / Flat / Building"
        value={house}
        setValue={setHouse}
      />
      <Input
        label="Area / Street / Locality"
        value={area}
        setValue={setArea}
      />
      <Input
        label="Landmark (Optional)"
        value={landmark}
        setValue={setLandmark}
      />
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
        disabled={checkingPincode}
        style={{
          ...buttonStyle,
          opacity: checkingPincode ? 0.6 : 1,
          cursor: checkingPincode ? "not-allowed" : "pointer",
        }}
      >
        {checkingPincode ? "Checking Pincode..." : "Save Address"}
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