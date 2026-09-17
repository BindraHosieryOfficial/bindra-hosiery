import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProtectedAdminRoute() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error || roleData?.role !== "admin") {
        setAllowed(false);
      } else {
        setAllowed(true);
      }
    } catch (error) {
      console.error("Admin access check failed:", error);
      setAllowed(false);
    }

    setLoading(false);
  }

  if (loading) {
    return <div>Checking access...</div>;
  }

  if (!allowed) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}