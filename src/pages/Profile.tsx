import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export default function Profile() {
  const { isGuest, user, logout } = useAuth();
  const navigate = useNavigate();
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  checkAdmin();
}, []);

async function checkAdmin() {
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) {
    setIsAdmin(false);
    return;
  }

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", supabaseUser.id)
    .single();

  setIsAdmin(data?.role === "admin");
}
  return (
    <main
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1
        style={{
          marginBottom: "25px",
          textAlign: "center",
        }}
      >
        My Account
      </h1>

      {isGuest ? (
        <>
          <h3>Guest User</h3>

          <p
            style={{
              color: "#666",
              marginBottom: "20px",
            }}
          >
            Please login to access your account.
          </p>

          <button
            onClick={() => navigate("/login")}
            style={loginButtonStyle}
          >
            Login
          </button>
        </>
      ) : (
        <>
          <section style={infoCard}>
            <label style={labelStyle}>Name</label>
            <p style={valueStyle}>
              {user.name || "Not Added"}
            </p>

            <label style={labelStyle}>
              Mobile Number
            </label>
            <p style={valueStyle}>
              {user.mobile || "Not Added"}
            </p>

            <label style={labelStyle}>Email</label>
            <p style={valueStyle}>
              {user.email || "Not Added"}
            </p>
          </section>

          <section style={menuCard}>
            <MenuItem
              icon="✏️"
              title="Edit Profile"
              onClick={() => navigate("/edit-profile")}
            />

            <MenuItem
              icon="📦"
              title="My Orders"
              onClick={() => navigate("/my-orders")}
            />

            <MenuItem
              icon="📍"
              title="Saved Addresses"
              onClick={() => navigate("/saved-addresses")}
            />

            <MenuItem
              icon="❤️"
              title="My Wishlist"
              onClick={() => navigate("/wishlist")}
            />

            <MenuItem
              icon="🔒"
              title="Privacy Policy"
              onClick={() => navigate("/privacy-policy")}
            />

            <MenuItem
              icon="📄"
              title="Terms & Conditions"
              onClick={() =>
                navigate("/terms-and-conditions")
              }
            />

            <MenuItem
              icon="🚚"
              title="Shipping & Delivery"
              onClick={() =>
                navigate("/shipping-policy")
              }
            />

            <MenuItem
              icon="↩️"
              title="Cancellation & Refund"
              onClick={() =>
                navigate("/cancellation-refund-policy")
              }
            />

            <MenuItem
              icon="🔄"
              title="Return & Exchange"
              onClick={() =>
                navigate("/return-exchange-policy")
              }
            />

            <MenuItem
              icon="📞"
              title="Contact Us"
              onClick={() => navigate("/contact-us")}
            />

            <MenuItem
              icon="ℹ️"
              title="About Bindra Hosiery"
              onClick={() =>
                navigate("/about-bindra-hosiery")
              }
            />
{isAdmin && (
  <MenuItem
    icon="👑"
    title="Admin Panel"
    onClick={() => navigate("/admin")}
  />
)}
            <MenuItem
              icon="🚪"
              title="Logout"
              onClick={() => {
                logout();
                navigate("/home");
              }}
              last
            />
          </section>
        </>
      )}
    </main>
  );
}

function MenuItem({
  icon,
  title,
  onClick,
  last = false,
}: {
  icon: string;
  title: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 4px",
        cursor: "pointer",
        borderBottom: last
          ? "none"
          : "1px solid #eee",
      }}
    >
      <span
        style={{
          fontSize: "16px",
          fontWeight: "500",
        }}
      >
        {icon} {title}
      </span>

      <span
        style={{
          color: "#999",
          fontSize: "20px",
        }}
      >
        &gt;
      </span>
    </div>
  );
}

const infoCard = {
  background: "#fff",
  borderRadius: "14px",
  padding: "18px",
  marginBottom: "24px",
  border: "1px solid #eee",
};

const menuCard = {
  background: "#fff",
  borderRadius: "14px",
  padding: "0 18px",
  border: "1px solid #eee",
};

const labelStyle = {
  color: "#777",
  fontSize: "13px",
  marginTop: "14px",
};

const valueStyle = {
  fontSize: "16px",
  fontWeight: "600",
  marginTop: "4px",
  marginBottom: "4px",
};

const loginButtonStyle = {
  width: "100%",
  padding: "16px",
  border: "none",
  borderRadius: "12px",
  background: "#111",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};