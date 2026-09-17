import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

type Manager = {
  user_id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  products: boolean;
  orders: boolean;
  categories: boolean;
  analytics: boolean;
};

type Permission =
  | "products"
  | "orders"
  | "categories"
  | "analytics";

export default function ManagerManagement() {
  const navigate = useNavigate();

  const [managers, setManagers] = useState<Manager[]>(
    []
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [savingPermission, setSavingPermission] =
    useState<string | null>(null);

  useEffect(() => {
    checkAdminAndLoadManagers();
  }, []);

  async function checkAdminAndLoadManagers() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/admin-login");
        return;
      }

      const { data: roleData, error: roleError } =
        await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

      if (
        roleError ||
        roleData?.role !== "admin"
      ) {
        navigate("/admin-login");
        return;
      }

      await loadManagers();
    } catch (error) {
      console.error(
        "Manager access error:",
        error
      );

      navigate("/admin-login");
    } finally {
      setLoading(false);
    }
  }

  async function loadManagers() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        navigate("/admin-login");
        return;
      }

      const response = await fetch(
        "http://localhost:5001/managers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Unable to load managers."
        );
        return;
      }

      const managerList: Manager[] =
        (result.managers || []).map(
          (manager: Manager) => ({
            user_id: manager.user_id,
            email: manager.email || "",
            name: manager.name || "",
            role: "manager",
            created_at:
              manager.created_at || "",

            products:
              manager.products === true,

            orders:
              manager.orders === true,

            categories:
              manager.categories === true,

            analytics:
              manager.analytics === true,
          })
        );

      setManagers(managerList);
    } catch (error) {
      console.error(
        "Manager loading error:",
        error
      );

      alert(
        "Unable to connect to the admin server."
      );
    }
  }

  async function createManager() {
    if (!name.trim()) {
      alert("Please enter manager name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter manager email.");
      return;
    }

    if (!password) {
      alert(
        "Please enter a temporary password."
      );
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    setCreating(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        alert(
          "Admin session expired. Please login again."
        );

        navigate("/admin-login");
        return;
      }

      const response = await fetch(
        "http://localhost:5001/create-manager",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ||
            "Unable to create manager."
        );
        return;
      }

      alert(
        "Manager created successfully."
      );

      setName("");
      setEmail("");
      setPassword("");

      await loadManagers();
    } catch (error) {
      console.error(
        "Create manager error:",
        error
      );

      alert(
        "Unable to connect to the admin server."
      );
    } finally {
      setCreating(false);
    }
  }

  async function togglePermission(
    manager: Manager,
    permission: Permission
  ) {
    const newValue = !manager[permission];

    setSavingPermission(
      `${manager.user_id}-${permission}`
    );

    try {
      const { data, error } =
        await supabase.rpc(
          "set_manager_permission",
          {
            target_user_id:
              manager.user_id,
            permission_name:
              permission,
            permission_value:
              newValue,
          }
        );

      if (error) {
        console.error(
          "Permission update error:",
          error
        );

        alert(
          error.message ||
            "Unable to update permission."
        );

        return;
      }

      console.log(
        "Permission saved:",
        data
      );

      // Update local state only after
      // Supabase confirms the save.
      setManagers((currentManagers) =>
        currentManagers.map((item) =>
          item.user_id === manager.user_id
            ? {
                ...item,
                [permission]: newValue,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Permission update error:",
        error
      );

      alert(
        "Unable to update manager permission."
      );
    } finally {
      setSavingPermission(null);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "450px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p>Loading managers...</p>
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
      <button
        onClick={() => navigate("/admin")}
        style={backButtonStyle}
      >
        ← Back to Admin Dashboard
      </button>

      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        Manager Management
      </h1>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          Create New Manager
        </h2>

        <input
          type="text"
          placeholder="Employee Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Manager Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Temporary Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={createManager}
          disabled={creating}
          style={{
            ...primaryButtonStyle,
            opacity: creating ? 0.6 : 1,
          }}
        >
          {creating
            ? "Creating Manager..."
            : "Create Manager"}
        </button>
      </section>

      <section style={cardStyle}>
        <h2 style={sectionTitleStyle}>
          Existing Managers
        </h2>

        {managers.length === 0 ? (
          <p
            style={{
              color: "#777",
              textAlign: "center",
            }}
          >
            No managers created yet.
          </p>
        ) : (
          managers.map((manager) => (
            <div
              key={manager.user_id}
              style={managerCardStyle}
            >
              <strong
                style={{
                  fontSize: "18px",
                }}
              >
                {manager.name ||
                  "Manager"}
              </strong>

              <p
                style={{
                  margin: "6px 0",
                  color: "#555",
                  fontSize: "14px",
                }}
              >
                {manager.email}
              </p>

              <p
                style={{
                  margin: "4px 0 15px",
                  fontSize: "13px",
                  color: "#999",
                }}
              >
                Role: Manager
              </p>

              <p
                style={{
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                Permissions
              </p>

              <PermissionRow
                label="📦 Products"
                enabled={manager.products}
                saving={
                  savingPermission ===
                  `${manager.user_id}-products`
                }
                onClick={() =>
                  togglePermission(
                    manager,
                    "products"
                  )
                }
              />

              <PermissionRow
                label="🛒 Orders"
                enabled={manager.orders}
                saving={
                  savingPermission ===
                  `${manager.user_id}-orders`
                }
                onClick={() =>
                  togglePermission(
                    manager,
                    "orders"
                  )
                }
              />

              <PermissionRow
                label="📂 Categories"
                enabled={
                  manager.categories
                }
                saving={
                  savingPermission ===
                  `${manager.user_id}-categories`
                }
                onClick={() =>
                  togglePermission(
                    manager,
                    "categories"
                  )
                }
              />

              <PermissionRow
                label="📊 Analytics"
                enabled={
                  manager.analytics
                }
                saving={
                  savingPermission ===
                  `${manager.user_id}-analytics`
                }
                onClick={() =>
                  togglePermission(
                    manager,
                    "analytics"
                  )
                }
              />
            </div>
          ))
        )}
      </section>
    </main>
  );
}

function PermissionRow({
  label,
  enabled,
  saving,
  onClick,
}: {
  label: string;
  enabled: boolean;
  saving: boolean;
  onClick: () => void;
}) {
  return (
    <div style={permissionRowStyle}>
      <span>{label}</span>

      <button
        onClick={onClick}
        disabled={saving}
        style={{
          ...toggleButtonStyle,
          background: enabled
            ? "#111"
            : "#ddd",
          color: enabled
            ? "#fff"
            : "#555",
          opacity: saving ? 0.5 : 1,
        }}
      >
        {saving
          ? "Saving..."
          : enabled
          ? "ON"
          : "OFF"}
      </button>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: "14px",
  padding: "18px",
  marginBottom: "20px",
};

const managerCardStyle = {
  padding: "18px 0",
  borderBottom: "1px solid #eee",
};

const sectionTitleStyle = {
  fontSize: "18px",
  marginTop: "0",
  marginBottom: "18px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  boxSizing: "border-box" as const,
  fontSize: "15px",
};

const primaryButtonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "5px",
  border: "none",
  borderRadius: "10px",
  background: "#111",
  color: "#fff",
  fontSize: "16px",
  cursor: "pointer",
};

const backButtonStyle = {
  border: "none",
  background: "transparent",
  padding: "0",
  marginBottom: "20px",
  fontSize: "15px",
  cursor: "pointer",
};

const permissionRowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 0",
  borderTop: "1px solid #f0f0f0",
};

const toggleButtonStyle = {
  minWidth: "65px",
  padding: "8px 12px",
  border: "none",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
};