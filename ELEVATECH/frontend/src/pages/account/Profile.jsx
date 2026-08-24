import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";

import ProfileCard from "../../components/account/ProfileCard";

export default function Profile() {
  const {
    user,
    token,
    isLoading,
    logout,
  } = useContext(AuthContext);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);


  const canSave = useMemo(() => {
    return form.first_name.trim() && form.last_name.trim();
  }, [form.first_name, form.last_name]);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const data =
          await accountService.getProfile(token);

        if (mounted && data) {
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
          });
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load profile"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (token && !isLoading) {
      loadProfile();
    }

    return () => {
      mounted = false;
    };
  }, [token, isLoading]);


  async function onSave(e) {
    e.preventDefault();
    if (!canSave || saving) return;

    setMessage("");
    setError("");

    try {
      setSaving(true);

      const updated =
        await accountService.updateProfile(
          token,
          form
        );

      if (updated) {
        setMessage(
          "Profile updated successfully"
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AccountLayout
      user={user}
      onLogout={logout}
    >
      <div>
        <h2 style={h2}>Profile</h2>

        {error && (
          <div style={errorBox}>
            {error}
          </div>
        )}

        {message && (
          <div style={successBox}>
            {message}
          </div>
        )}

        <div style={{ maxWidth: 900 }}>
          <ProfileCard user={user} />

          <form
            onSubmit={onSave}
            style={formBox}
          >
            <div style={grid2}>
              <label style={field}>
                First name
                <input
                  style={input}
                  value={form.first_name}
                  onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                />
              </label>
              <label style={field}>
                Last name
                <input
                  style={input}
                  value={form.last_name}
                  onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                />
              </label>
              <label style={{ ...field, gridColumn: "1 / -1" }}>
                Phone
                <input
                  style={input}
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={!canSave || saving}
              style={{
                ...primaryBtn,
                opacity:
                  !canSave || saving
                    ? 0.6
                    : 1,
              }}
            >
              {saving
                ? "Saving..."
                : "Save changes"}
            </button>

            {loading && (
              <div
                style={{
                  marginTop: 10,
                  color: "#666",
                }}
              >
                Loading profile...
              </div>
            )}
          </form>
        </div>
      </div>
    </AccountLayout>
  );
}


const h2 = {
  fontSize: 28,
  fontWeight: 900,
  marginBottom: 20,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontWeight: 800,
  color: "#111",
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 15,
};

const formBox = {
  marginTop: 16,
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 20,
  background: "#fff",
};

const primaryBtn = {
  marginTop: 18,
  padding: "12px 18px",
  borderRadius: 12,
  border: "none",
  background: "#0ea5e9",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const errorBox = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: 12,
  borderRadius: 10,
  marginBottom: 15,
  fontWeight: 700,
};

const successBox = {
  background: "#dcfce7",
  color: "#15803d",
  padding: 12,
  borderRadius: 10,
  marginBottom: 15,
  fontWeight: 700,
};

