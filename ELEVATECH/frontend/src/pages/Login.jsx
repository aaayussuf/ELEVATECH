import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/account/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      const token = data?.token;
      if (!token) throw new Error("No token returned");
      login(token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={wrap}>
      <form onSubmit={onSubmit} style={card}>
        <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Login</div>

        {error ? <div style={{ marginBottom: 12, color: "#dc2626", fontWeight: 800 }}>{error}</div> : null}

        <label style={field}>
          Email
          <input style={input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </label>

        <div style={{ height: 12 }} />

        <label style={field}>
          Password
          <input style={input} value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </label>

        <button type="submit" disabled={loading} style={primaryBtn}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const wrap = { display: "flex", alignItems: "center", justifyContent: "center", padding: 24, minHeight: "60vh" };
const card = { width: 420, maxWidth: "100%", border: "1px solid #eee", borderRadius: 16, padding: 18, background: "#fff" };
const field = { display: "flex", flexDirection: "column", gap: 6, fontWeight: 900, color: "#111" };
const input = { padding: 10, borderRadius: 10, border: "1px solid #eee", outline: "none" };
const primaryBtn = { marginTop: 14, width: "100%", padding: "10px 14px", borderRadius: 12, border: "none", background: "#0ea5e9", color: "#fff", fontWeight: 900, cursor: "pointer" };

