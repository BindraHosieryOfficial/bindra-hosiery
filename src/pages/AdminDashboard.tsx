import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

type Role = "admin" | "manager" | null;

type Permissions = {
  products: boolean;
  orders: boolean;
  categories: boolean;
  analytics: boolean;
};

type Customer = {
  id: number;
  mobile: string;
  name: string;
  email: string;
  first_login_at: string;
  last_login_at: string;
  marketing_consent: boolean;
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState<Role>(null);
  const [permissions, setPermissions] =
    useState<Permissions>({
      products: false,
      orders: false,
      categories: false,
      analytics: false,
    });

  const [checking, setChecking] = useState(true);
  const [isLoggingIn, setIsLoggingIn] =
    useState(false);

  const [showCustomers, setShowCustomers] =
    useState(false);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loadingCustomers, setLoadingCustomers] =
    useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setRole(null);
        setChecking(false);
        return;
      }

      await loadRoleAndPermissions(user.id);
    } catch (error) {
      console.error(
        "User access check error:",
        error
      );

      setRole(null);
    }

    setChecking(false);
  }

  async function loadRoleAndPermissions(
    userId: string
  ) {
    const {
      data: roleData,
      error: roleError,
    } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (roleError) {
      console.error(
        "Role check error:",
        roleError
      );

      setRole(null);
      return;
    }

    const userRole = roleData?.role as Role;

    if (
      userRole !== "admin" &&
      userRole !== "manager"
    ) {
      setRole(null);
      return;
    }

    setRole(userRole);

    if (userRole === "admin") {
      setPermissions({
        products: true,
        orders: true,
        categories: true,
        analytics: true,
      });

      return;
    }

    const {
      data: permissionData,
      error: permissionError,
    } = await supabase
      .from("manager_permissions")
      .select(
        "products, orders, categories, analytics"
      )
      .eq("user_id", userId)
      .single();

    if (permissionError) {
      console.error(
        "Permission check error:",
        permissionError
      );

      setPermissions({
        products: false,
        orders: false,
        categories: false,
        analytics: false,
      });

      return;
    }

    setPermissions({
      products:
        permissionData?.products ?? false,
      orders:
        permissionData?.orders ?? false,
      categories:
        permissionData?.categories ?? false,
      analytics:
        permissionData?.analytics ?? false,
    });
  }

  async function handleLogin() {
    if (!email || !password) {
      alert(
        "Please enter your email and password."
      );
      return;
    }

    setIsLoggingIn(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error || !data.user) {
        alert(
          error?.message ||
            "Unable to login."
        );

        setIsLoggingIn(false);
        return;
      }

      const {
        data: roleData,
        error: roleError,
      } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (roleError) {
        await supabase.auth.signOut();

        alert(
          "Unable to verify account role."
        );

        setIsLoggingIn(false);
        return;
      }

      const userRole = roleData?.role;

      if (
        userRole !== "admin" &&
        userRole !== "manager"
      ) {
        await supabase.auth.signOut();

        alert(
          "You do not have permission to access this panel."
        );

        setIsLoggingIn(false);
        return;
      }

      await loadRoleAndPermissions(
        data.user.id
      );

      setIsLoggingIn(false);
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      alert(
        "Unable to login. Please try again."
      );

      setIsLoggingIn(false);
    }
  }

  async function loadCustomers() {
    setLoadingCustomers(true);

    try {
      const {
        data,
        error,
      } = await supabase
        .from("customers")
        .select(
          "id, mobile, name, email, first_login_at, last_login_at, marketing_consent"
        )
        .order("last_login_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Customer loading error:",
          error
        );

        alert(
          "Unable to load customers."
        );

        return;
      }

      setCustomers(data || []);
    } catch (error) {
      console.error(
        "Customer loading error:",
        error
      );

      alert(
        "Unable to load customers."
      );
    } finally {
      setLoadingCustomers(false);
    }
  }

  async function handleCustomers() {
    setShowCustomers(true);
    await loadCustomers();
  }

  function formatDate(date: string) {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setRole(null);

    setPermissions({
      products: false,
      orders: false,
      categories: false,
      analytics: false,
    });

    setEmail("");
    setPassword("");

    navigate("/home");
  }

  if (checking) {
    return (
      <main
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p>Checking access...</p>
      </main>
    );
  }

  if (!role) {
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
            textAlign: "center",
          }}
        >
          Admin / Manager Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          style={{
            ...primaryButtonStyle,
            opacity: isLoggingIn ? 0.6 : 1,
          }}
        >
          {isLoggingIn
            ? "Logging in..."
            : "Login"}
        </button>
      </main>
    );
  }

  const isAdmin = role === "admin";

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
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        {isAdmin
          ? "Admin Dashboard"
          : "Manager Dashboard"}
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#777",
          marginBottom: "30px",
        }}
      >
        {isAdmin
          ? "Owner / Admin"
          : "Manager"}
      </p>

      {!showCustomers ? (
        <>
          {permissions.products && (
            <MenuButton
              title="📦 Products"
              onClick={() =>
                navigate("/admin/products")
              }
            />
          )}

          {permissions.orders && (
            <MenuButton
              title="🛒 Orders"
              onClick={() =>
                navigate("/admin/orders")
              }
            />
          )}

          {permissions.categories && (
            <MenuButton
              title="📂 Categories"
              onClick={() =>
                navigate("/admin/categories")
              }
            />
          )}

          {permissions.analytics && (
            <MenuButton
              title="📊 Analytics"
              onClick={() =>
                navigate("/admin/analytics")
              }
            />
          )}

          {isAdmin && (
            <>
              <MenuButton
                title="👥 Manage Managers"
                onClick={() =>
                  navigate("/admin/managers")
                }
              />

              <MenuButton
                title="📱 Customers / Leads"
                onClick={handleCustomers}
              />
            </>
          )}

          <MenuButton
            title="🚪 Logout"
            onClick={handleLogout}
          />
        </>
      ) : (
        <>
          <button
            onClick={() =>
              setShowCustomers(false)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "#fff",
              color: "#111",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ← Back to Dashboard
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "22px",
              }}
            >
              Customers / Leads
            </h2>

            <button
              onClick={loadCustomers}
              disabled={loadingCustomers}
              style={{
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
          </div>

          {loadingCustomers ? (
            <p
              style={{
                textAlign: "center",
                color: "#777",
              }}
            >
              Loading customers...
            </p>
          ) : customers.length === 0 ? (
            <div
              style={{
                padding: "25px 15px",
                borderRadius: "12px",
                background: "#f7f7f7",
                textAlign: "center",
                color: "#777",
              }}
            >
              No customers have logged in yet.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  style={{
                    padding: "16px",
                    border: "1px solid #e5e5e5",
                    borderRadius: "12px",
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "17px",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    📱 {customer.mobile}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      lineHeight: "1.7",
                    }}
                  >
                    <div>
                      <strong>Name:</strong>{" "}
                      {customer.name || "-"}
                    </div>

                    <div>
                      <strong>First Login:</strong>{" "}
                      {formatDate(
                        customer.first_login_at
                      )}
                    </div>

                    <div>
                      <strong>Last Login:</strong>{" "}
                      {formatDate(
                        customer.last_login_at
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

function MenuButton({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "18px",
        marginBottom: "15px",
        border: "none",
        borderRadius: "12px",
        background: "#111",
        color: "#fff",
        fontSize: "17px",
        cursor: "pointer",
      }}
    >
      {title}
    </button>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  boxSizing: "border-box" as const,
};

const primaryButtonStyle = {
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