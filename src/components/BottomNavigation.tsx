import { useNavigate } from "react-router-dom";
export default function BottomNavigation() {
  const navigate = useNavigate();
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: "450px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-around",
        padding: "14px 0",
        background: "#ffffff",
        borderTop: "1px solid #e5e5e5",
      }}
    >
      <span
  onClick={() => navigate("/home")}
  style={{ cursor: "pointer" }}
>
  🏠 Home
</span>
      <span
  onClick={() => navigate("/wishlist")}
  style={{ cursor: "pointer" }}
>
  ❤️ Wishlist
</span>
      <span
  onClick={() => navigate("/cart")}
  style={{ cursor: "pointer" }}
>
  🛒 Cart
</span>
     <span
  onClick={() => navigate("/profile")}
  style={{ cursor: "pointer" }}
>
  👤 Profile
</span>
    </nav>
  );
}