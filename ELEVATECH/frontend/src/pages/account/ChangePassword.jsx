import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { token, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!isLoading && !token) navigate("/login");
  }, [isLoading, navigate, token]);

  async function onSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!form.new_password || form.new_password !== form.confirm_password) {
      setMessage("New passwords do not match");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE || ""}/api/auth/profile/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setMessage(data?.message || "Failed to change password");
        return;
      }

      setMessage("Password updated successfully");
      setForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch {
      setMessage("Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={layoutGrid}>
      <div />
      <div>
        <h2 style={h2}>Change Password</h2>
        <form onSubmit={onSubmit} style={{ border: "1px solid #eee", borderRadius: 16, padding: 18, maxWidth: 720 }}>
          <label style={field}>
            Current password
            <input style={input} type="password" value={form.old_password} onChange={(e) => setForm((f) => ({ ...f, old_password: e.target.value }))} />
          </label>

          <div style={{ height: 12 }} />

          <label style={field}>
            New password
            <input style={input} type="password" value={form.new_password} onChange={(e) => setForm((f) => ({ ...f, new_password: e.target.value }))} />
          </label>

          <div style={{ height: 12 }} />

          <label style={field}>
            Confirm new password
            <input style={input} type="password" value={form.confirm_password} onChange={(e) => setForm((f) => ({ ...f, confirm_password: e.target.value }))} />
          </label>

          {message ? <div style={{ marginTop: 12, fontWeight: 800, color: message.includes("success") ? "#16a34a" : "#dc2626" }}>{message}</div> : null}

          <button type="submit" disabled={saving} style={primaryBtn}>
            {saving ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const layoutGrid = { display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 };
const h2 = { fontSize: 22, fontWeight: 900, marginBottom: 10 };
const field = { display: "flex", flexDirection: "column", gap: 6, fontWeight: 900, color: "#111" };
const input = { padding: 10, borderRadius: 10, border: "1px solid #eee", outline: "none" };
const primaryBtn = { marginTop: 14, padding: "10px 14px", borderRadius: 12, border: "none", background: "#0ea5e9", color: "#fff", fontWeight: 900, cursor: "pointer" };

