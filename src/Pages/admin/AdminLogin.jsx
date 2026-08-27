import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../../lib/supabaseClient";

import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const destination =
    location.state?.from ||
    "/admin";

  useEffect(() => {
    const checkExistingSession =
      async () => {
        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {
          setCheckingSession(false);
          return;
        }

        const {
          data: isAdmin,
          error: adminError,
        } = await supabase.rpc(
          "is_admin"
        );

        if (
          !adminError &&
          isAdmin === true
        ) {
          navigate(
            "/admin",
            {
              replace: true,
            }
          );

          return;
        }

        /*
          A logged-in non-admin should
          not remain authenticated inside
          the Admin interface.
        */
        await supabase.auth.signOut();

        setCheckingSession(false);
      };

    checkExistingSession();
  }, [navigate]);

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      const trimmedEmail =
        email.trim();

      if (
        !trimmedEmail ||
        !password
      ) {
        setError(
          "Please enter your email and password."
        );

        return;
      }

      setLoading(true);

      const {
        data,
        error: loginError,
      } =
        await supabase.auth
          .signInWithPassword({
            email: trimmedEmail,
            password,
          });

      if (loginError) {
        setError(
          "Invalid email or password."
        );

        setLoading(false);

        return;
      }

      if (!data.session) {
        setError(
          "Unable to create an administrator session."
        );

        setLoading(false);

        return;
      }

      const {
        data: isAdmin,
        error: adminError,
      } = await supabase.rpc(
        "is_admin"
      );

      if (
        adminError ||
        isAdmin !== true
      ) {
        await supabase.auth.signOut();

        setError(
          "This account does not have administrator access."
        );

        setLoading(false);

        return;
      }

      navigate(
        destination,
        {
          replace: true,
        }
      );
    };

  if (checkingSession) {
    return (
      <div className="admin-login-loading">
        Checking administrator session...
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-brand">
          <p>POLCHAT GARDEN RESORT</p>

          <h1>
            Admin Login
          </h1>

          <span>
            Sign in to access the resort
            management dashboard.
          </span>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div
              className="admin-login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="admin-login-field">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="Admin email"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

      </div>
    </div>
  );
}