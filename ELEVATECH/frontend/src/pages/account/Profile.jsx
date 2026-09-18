import { useContext, useEffect, useMemo, useState } from "react";
import { Save, UserRound } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";
import ProfileCard from "../../components/account/ProfileCard";

const inputCls =
  "mt-2 w-full min-h-11 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export default function Profile() {
  const { user, token, isLoading, logout } = useContext(AuthContext);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
    });
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
        const data = await accountService.getProfile(token);
        if (mounted && data) {
          setForm({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone: data.phone || "",
          });
        }
      } catch (err) {
        if (mounted) setError(err.response?.data?.message || "Unable to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    if (token && !isLoading) loadProfile();
    return () => { mounted = false; };
  }, [token, isLoading]);

  async function onSave(e) {
    e.preventDefault();
    if (!canSave || saving) return;
    setMessage("");
    setError("");
    try {
      setSaving(true);
      const updated = await accountService.updateProfile(token, form);
      if (updated) setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <AccountLayout user={user} onLogout={logout}>
      <div className="w-full min-w-0 space-y-6 sm:space-y-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 text-black shadow-sm">
            <UserRound size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">Keep your personal details up to date.</p>
          </div>
        </div>
        {error && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 sm:px-5">{error}</div>
        )}
        {message && (
          <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 sm:px-5">{message}</div>
        )}
        <div className="w-full max-w-4xl space-y-5 sm:space-y-6">
          <div className="min-w-0"><ProfileCard user={user} /></div>
          <form onSubmit={onSave} className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-7">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-black text-gray-900 sm:text-xl">Edit details</h2>
              <p className="text-xs text-gray-500 sm:text-sm">Update your name and contact information.</p>
            </div>
            <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <label className="block min-w-0 text-sm font-black text-gray-900">First name
                <input className={inputCls} value={form.first_name} onChange={(e) => updateField("first_name", e.target.value)} autoComplete="given-name" placeholder="First name" />
              </label>
              <label className="block min-w-0 text-sm font-black text-gray-900">Last name
                <input className={inputCls} value={form.last_name} onChange={(e) => updateField("last_name", e.target.value)} autoComplete="family-name" placeholder="Last name" />
              </label>
              <label className="block min-w-0 text-sm font-black text-gray-900 sm:col-span-2">Phone
                <input type="tel" className={inputCls} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} autoComplete="tel" inputMode="tel" placeholder="Phone number" />
              </label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center">
              <button type="submit" disabled={!canSave || saving} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-yellow-400 px-5 py-3 text-sm font-black text-black shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6">
                <Save size={16} aria-hidden="true" />
                {saving ? "Saving..." : "Save changes"}
              </button>
              {loading && (<span className="text-center text-sm font-bold text-gray-400 sm:text-left">Loading profile...</span>)}
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
}
