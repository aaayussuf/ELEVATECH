import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";

const inputCls =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export default function ChangePassword() {
  const { token, isLoading, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
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
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE || ""}/api/auth/profile/password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setMessage(data?.message || "Failed to change password");
        return;
      }

      setMessage("Password updated successfully");
      setForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch {
      setMessage("Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  const success = message?.toLowerCase().includes("success");

  return (
    <AccountLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 text-black">
            <KeyRound size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black">Change Password</h1>
            <p className="text-sm text-gray-400">
              Use a strong password you don&apos;t use elsewhere.
            </p>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="max-w-xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-black text-gray-900">
            Update your password
          </h2>

          <div className="mt-5 space-y-5">
            <label className="block text-sm font-black text-gray-900">
              Current password
              <input
                className={inputCls}
                type="password"
                value={form.old_password}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    old_password: e.target.value,
                  }))
                }
              />
            </label>

            <label className="block text-sm font-black text-gray-900">
              New password
              <input
                className={inputCls}
                type="password"
                value={form.new_password}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    new_password: e.target.value,
                  }))
                }
              />
            </label>

            <label className="block text-sm font-black text-gray-900">
              Confirm new password
              <input
                className={inputCls}
                type="password"
                value={form.confirm_password}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    confirm_password: e.target.value,
                  }))
                }
              />
            </label>
          </div>

          {message && (
            <div
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold ${
                success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}

