import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
 const { cart, setCart } = useCart();
 const navigate = useNavigate();
 const total = cart.reduce(
  (sum: number, item: any) => sum + item.price * item.quantity,
  0
);
 function removeItem(index: number) {
  const updatedCart = cart.filter((_: any, i: number) => i !== index);
  setCart(updatedCart);
}

function increaseQuantity(index: number) {
  const updatedCart = [...cart];

  updatedCart[index].quantity += 1;

  setCart(updatedCart);
}

function decreaseQuantity(index: number) {
  const updatedCart = [...cart];

 if (updatedCart[index].quantity > 1) {
  updatedCart[index].quantity -= 1;
  setCart(updatedCart);
} else {
  const confirmRemove = window.confirm(
    "Remove this item from cart?"
  );

  if (confirmRemove) {
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  }
}
}

console.log("Cart Page:", cart);

  return (
    <main
      style={{
        padding: "20px",
        maxWidth: "450px",
        margin: "0 auto",
      }}
    >
      <h1>My Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />

            <h3>{item.name}</h3>

            <p>Size: {item.size}</p>

            <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
    marginBottom: "10px",
  }}
>
  <button
    onClick={() => decreaseQuantity(index)}
    style={{
      width: "32px",
      height: "32px",
      cursor: "pointer",
    }}
  >
    −
  </button>

  <strong>{item.quantity}</strong>

  <button
    onClick={() => increaseQuantity(index)}
    style={{
      width: "32px",
      height: "32px",
      cursor: "pointer",
    }}
  >
    +
  </button>
</div>

            <h2>₹{item.price}</h2>
            <button
  onClick={() => removeItem(index)}
  style={{
    marginTop: "12px",
    padding: "10px 16px",
    background: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  🗑 Remove
</button>
          </div>
        ))
      )}
      {cart.length > 0 && (
      <div
  style={{
    marginTop: "25px",
    padding: "20px",
    borderTop: "2px solid #ddd",
  }}
>
  <h2>Total: ₹{total}</h2>

  <button
   onClick={() => navigate("/checkout")}
    style={{
      width: "100%",
      padding: "16px",
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "15px",
    }}
  >
    Proceed to Checkout
  </button>
</div>
      )}
    </main>
  );
}