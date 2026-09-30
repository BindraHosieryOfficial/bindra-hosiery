import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProtectedAdminRoute() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkAccess() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setAllowed(false);
        setLoading(false);
        return;
      }

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (
        error ||
        (roleData?.role !== "admin" &&
          roleData?.role !== "manager")
      ) {
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