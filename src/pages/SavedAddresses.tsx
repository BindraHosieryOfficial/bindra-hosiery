import { useNavigate } from "react-router-dom";
import { useAddress } from "../context/AddressContext";
export default function SavedAddresses() {
  const navigate = useNavigate();
const { addresses, setAddresses } = useAddress();
function handleSetDefault(id: number) {
  const updatedAddresses = addresses.map((address: any) => ({
    ...address,
    isDefault: address.id === id,
  }));

  setAddresses(updatedAddresses);
}

function handleDelete(id: number) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this address?"
  );

  if (!confirmDelete) return;

  setAddresses(
    addresses.filter((address: any) => address.id !== id)
  );
}
  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Saved Addresses</h1>

      {addresses.length === 0 ? (
  <div
    style={{
      padding: "18px",
      borderRadius: "12px",
      border: "1px solid #ddd",
      marginTop: "20px",
      marginBottom: "20px",
    }}
  >
    <h3>No Saved Address</h3>

    <p style={{ color: "#666" }}>
      Add your delivery address to continue shopping.
    </p>
  </div>
) : (
  addresses.map((address: any) => (
    <div
      key={address.id}
       onClick={() => {
    const updatedAddresses = addresses.map((item: any) => ({
      ...item,
      isDefault: item.id === address.id,
    }));

    setAddresses(updatedAddresses);

    navigate("/checkout");
  }}
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "18px",
        marginTop: "20px",
        cursor: "pointer",
      }}
    >
     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  }}
>
  <h3>
    {address.type}
    {address.isDefault ? " ⭐ Default" : ""}
  </h3>

  {!address.isDefault && (
    <button
      onClick={() => handleSetDefault(address.id)}
      style={{
        border: "none",
        background: "#111",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
      }}
    >
      Set Default
    </button>
  )}
</div>

      <p>{address.name}</p>

      <p>{address.mobile}</p>

      <p>{address.house}</p>

      <p>{address.area}</p>

      <p>
        {address.city}, {address.state}
      </p>

      <p>{address.pincode}</p>
      <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "15px",
  }}
>
  <button
    onClick={() => handleDelete(address.id)}
    style={{
      padding: "8px 16px",
      border: "none",
      borderRadius: "8px",
      background: "#ff4d4f",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    🗑 Delete
  </button>
</div>
    </div>
  ))
)}

      <button
        onClick={() => navigate("/add-address")}
        style={{
          width: "100%",
          padding: "16px",
          border: "none",
          borderRadius: "12px",
          background: "#111",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        + Add New Address
      </button>
    </main>
  );
}