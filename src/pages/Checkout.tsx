import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAddress } from "../context/AddressContext";
export default function Checkout() {
    const { cart } = useCart();
    const navigate = useNavigate();
    const { addresses } = useAddress();

const selectedAddress =
  addresses.find((address: any) => address.isDefault) ||
  addresses[0];
   
if (cart.length === 0) {
  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2>Your cart is empty.</h2>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "14px 24px",
          marginTop: "20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Continue Shopping
      </button>
    </main>
  );
}
   const subtotal = cart.reduce(
  (sum: number, item: any) => sum + item.price * item.quantity,
  0
);
const gstEnabled = false;


const isDelhiNCR = selectedAddress?.pincode?.startsWith("11");
let deliveryCharge = 100;
let deliveryDays = "5–6 Business Days";

if (isDelhiNCR) {
  deliveryCharge = subtotal >= 3000 ? 0 : 50;
  deliveryDays = "2–3 Business Days";
} else {
  if (subtotal >= 5000) {
    deliveryCharge = 0;
  } else if (subtotal >= 3000) {
    deliveryCharge = 50;
  } else {
    deliveryCharge = 100;
  }
}



const gstAmount = gstEnabled ? subtotal * 0.18 : 0;

const grandTotal =
  subtotal + deliveryCharge + gstAmount;
  let deliveryMessage = "";

if (isDelhiNCR) {
  if (subtotal < 3000) {
    deliveryMessage = `Add products worth ₹${3000 - subtotal} more to get FREE Delivery.`;
  } else {
    deliveryMessage = "🎉 Congratulations! You unlocked FREE Delivery.";
  }
} else {
  if (subtotal < 3000) {
    deliveryMessage = `Add products worth ₹${3000 - subtotal} more to reduce your delivery charge from ₹100 to ₹50.`;
  } else if (subtotal < 5000) {
    deliveryMessage = `Add products worth ₹${5000 - subtotal} more to get FREE Delivery.`;
  } else {
    deliveryMessage = "🎉 Congratulations! You unlocked FREE Delivery.";
  }
}
function handleContinue() {
  if (!selectedAddress) {
  alert("Please add a delivery address.");
  navigate("/add-address");
  return;
}

 navigate("/payment");
}
  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Checkout</h1>

      <h3>Delivery Address</h3>

{selectedAddress && (
  <div
    style={{
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "16px",
      marginTop: "15px",
      marginBottom: "20px",
    }}
  >
    <h4>
      {selectedAddress.type}
      {selectedAddress.isDefault ? " ⭐ Default" : ""}
    </h4>

    <p>{selectedAddress.name}</p>

    <p>{selectedAddress.mobile}</p>

    <p>{selectedAddress.house}</p>

    <p>{selectedAddress.area}</p>

    <p>
      {selectedAddress.city}, {selectedAddress.state}
    </p>

    <p>{selectedAddress.pincode}</p>

    <button
      onClick={() => navigate("/saved-addresses")}
      style={{
        marginTop: "12px",
        border: "none",
        background: "#111",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Change Address
    </button>
  </div>
)}
 
<hr style={{ margin: "30px 0" }} />

<h3>Order Summary</h3>

<p>Subtotal: ₹{subtotal}</p>


<p>Delivery Charge: ₹{deliveryCharge}</p>

{gstEnabled && (
  <p>GST: ₹{gstAmount}</p>
)}

<h2>Total: ₹{grandTotal}</h2>

<p
  style={{
    color: "#ff8800",
    fontWeight: "bold",
    marginTop: "15px",
  }}
>
  {deliveryMessage}
</p>

<p>
Estimated Delivery:
<b> {deliveryDays}</b>
</p>
      <button
       onClick={handleContinue}
        style={{
          width: "100%",
          padding: "16px",
          marginTop: "25px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Continue
      </button>
    </main>
  );
}
