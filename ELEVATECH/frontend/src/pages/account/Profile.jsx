import {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Save, UserRound } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";

import ProfileCard from "../../components/account/ProfileCard";

const inputCls =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

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
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 text-black">
            <UserRound size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black">My Profile</h1>
            <p className="text-sm text-gray-400">
              Keep your personal details up to date.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-950/60 px-5 py-3 text-sm font-bold text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-950/60 px-5 py-3 text-sm font-bold text-emerald-300">
            {message}
          </div>
        )}

        <div className="max-w-3xl space-y-6">
          <ProfileCard user={user} />

          <form
            onSubmit={onSave}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-black text-gray-900">Edit details</h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-black text-gray-900">
                First name
                <input
                  className={inputCls}
                  value={form.first_name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      first_name: e.target.value,
                    }))
                  }
                />
              </label>

              <label className="block text-sm font-black text-gray-900">
                Last name
                <input
                  className={inputCls}
                  value={form.last_name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      last_name: e.target.value,
                    }))
                  }
                />
              </label>

              <label className="block text-sm font-black text-gray-900 sm:col-span-2">
                Phone
                <input
                  className={inputCls}
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phone: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={!canSave || saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save changes"}
              </button>

              {loading && (
                <span className="text-sm font-bold text-gray-400">
                  Loading profile...
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
}