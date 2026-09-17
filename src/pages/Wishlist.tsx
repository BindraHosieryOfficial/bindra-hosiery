import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, setWishlist } = useWishlist();
  const navigate = useNavigate();
function removeFromWishlist(
  e: React.MouseEvent,
  id: number
) {
  e.stopPropagation();

  setWishlist(
    wishlist.filter((item: any) => item.id !== id)
  );
}
  if (wishlist.length === 0) {
    return (
      <main
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>🤍 Your Wishlist is Empty</h2>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Save your favourite products here.
        </p>

        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "14px 24px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </main>
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
      <h2>❤️ My Wishlist</h2>

      {wishlist.map((item: any) => (
        <div
          key={item.id}
          onClick={() => navigate(`/product/${item.id}`)}
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "20px",
            padding: "12px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            cursor: "pointer",
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />

          <div
  style={{
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  }}
>
  <div>
    <h3>{item.name}</h3>
    <p>₹{item.price}</p>
  </div>

  <button
    onClick={(e) => removeFromWishlist(e, item.id)}
    style={{
      border: "none",
      background: "transparent",
      fontSize: "26px",
      cursor: "pointer",
    }}
  >
    ❤️
  </button>
</div>
        </div>
      ))}
    </main>
  );
}