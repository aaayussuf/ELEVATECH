import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";

import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";

const inputCls =
  "mt-2 w-full min-h-11 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

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
    if (!isLoading && !token) {
      navigate("/login");
    }
  }, [isLoading, navigate, token]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!form.old_password) {
      setMessage("Please enter your current password.");
      return;
    }

    if (!form.new_password) {
      setMessage("Please enter a new password.");
      return;
    }

    if (!form.new_password || form.new_password !== form.confirm_password) {
      setMessage("New passwords do not match");
      return;
    }

    if (form.new_password.length < 8) {
      setMessage("New password must be at least 8 characters.");
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
      setForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch {
      setMessage("Failed to change password");
    } finally {
      setSaving(false);
    }
  }

  const success = message?.toLowerCase().includes("success");

  return (
    <AccountLayout user={user} onLogout={logout}>
      <div className="w-full min-w-0 space-y-6 sm:space-y-8">
        {/* HEADER */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 text-black shadow-sm">
            <KeyRound size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Change Password
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Use a strong password you don&apos;t use elsewhere.
            </p>
          </div>
        </div>
        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-7"
        >
          <div>
            <h2 className="text-lg font-black text-gray-900 sm:text-xl">
              Update your password
            </h2>
            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              Enter your current password and choose a new password for your account.
            </p>
          </div>

          <div className="mt-5 space-y-4 sm:space-y-5">
            <label className="block text-sm font-black text-gray-900">
              Current password
              <input
                className={inputCls}
                type="password"
                value={form.old_password}
                onChange={(e) => updateField("old_password", e.target.value)}
                autoComplete="current-password"
                placeholder="Enter current password"
              />
            </label>

            <label className="block text-sm font-black text-gray-900">
              New password
              <input
                className={inputCls}
                type="password"
                value={form.new_password}
                onChange={(e) => updateField("new_password", e.target.value)}
                autoComplete="new-password"
                placeholder="Enter new password"
                minLength={8}
              />
              <span className="mt-1.5 block text-xs font-medium text-gray-400">
                Minimum 8 characters.
              </span>
            </label>

            <label className="block text-sm font-black text-gray-900">
              Confirm new password
              <input
                className={inputCls}
                type="password"
                value={form.confirm_password}
                onChange={(e) => updateField("confirm_password", e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm new password"
                minLength={8}
              />
            </label>
          </div>

          {message && (
            <div
              role={success ? "status" : "alert"}
              className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-bold leading-5 ${
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
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-yellow-400 px-5 py-3 text-sm font-black text-black shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6 sm:w-auto sm:px-6"
          >
            <KeyRound size={16} aria-hidden="true" />
            {saving ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}
