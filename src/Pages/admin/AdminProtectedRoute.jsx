import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

export default function AdminProtectedRoute({
  children,
}) {
  const [loading, setLoading] =
    useState(true);

  const [authorized, setAuthorized] =
    useState(false);

  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAdminAccess = async () => {
      // Re-check both session state and the admin RPC result before rendering.
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (
        sessionError ||
        !session
      ) {
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
        }

        return;
      }

      const {
        data: isAdmin,
        error: adminError,
      } = await supabase.rpc(
        "is_admin"
      );

      if (adminError) {
        console.error(
          "Admin authorization error:",
          adminError
        );

        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
        }

        return;
      }

      if (isMounted) {
        setAuthorized(
          isAdmin === true
        );

        setLoading(false);
      }
    };

    checkAdminAccess();

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        () => {
          checkAdminAccess();
        }
      );

    return () => {
      isMounted = false;

      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#efe6d7",
          color: "#4d4638",
          fontFamily:
            "'Inter', sans-serif",
        }}
      >
        Checking administrator access...
      </div>
    );
  }

  if (!authorized) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}