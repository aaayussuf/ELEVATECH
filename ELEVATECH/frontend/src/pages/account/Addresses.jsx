import { useContext, useEffect, useState } from "react";
import { MapPinned, Phone } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import AccountLayout from "../../layouts/AccountLayout";
import accountService from "../../services/accountService";
import AddressCard from "../../components/account/AddressCard";

const emptyForm = {
  full_name: "",
  phone: "",
  county: "",
  city: "",
  address_line_1: "",
  address_line_2: "",
  postal_code: "",
  is_default: false,
};

const inputCls =
  "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

export default function Addresses() {
  const { user, token, isLoading, logout } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    ...emptyForm,
    full_name: user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        full_name:
          current.full_name ||
          `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        phone: current.phone || user.phone || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    async function loadAddresses() {
      if (!token || isLoading) return;

      try {
        setLoading(true);
        setMessage("");

        const list = await accountService.getAddresses(token);

        if (mounted) {
          setAddresses(Array.isArray(list) ? list : []);
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);

        if (mounted) {
          setAddresses([]);
          setMessage(
            error?.response?.data?.message ||
              "Unable to load your addresses."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAddresses();

    return () => {
      mounted = false;
    };
  }, [token, isLoading]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createAddress(e) {
    e.preventDefault();

    setMessage("");

    if (
      !form.full_name.trim() ||
      !form.phone.trim() ||
      !form.county.trim() ||
      !form.city.trim() ||
      !form.address_line_1.trim()
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const created = await accountService.createAddress(token, {
        ...form,
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        county: form.county.trim(),
        city: form.city.trim(),
        address_line_1: form.address_line_1.trim(),
        address_line_2: form.address_line_2.trim(),
        postal_code: form.postal_code.trim(),
      });

      if (created) {
        setAddresses((previous) => [created, ...previous]);
      }

      setForm({
        ...emptyForm,
        full_name: `${user?.first_name || ""} ${
          user?.last_name || ""
        }`.trim(),
        phone: user?.phone || "",
      });

      setMessage("Address saved successfully.");
    } catch (error) {
      console.error("Failed to create address:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to save address."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(addressId) {
    if (!addressId) return;

    try {
      setMessage("");

      await accountService.deleteAddress(token, addressId);

      setAddresses((previous) =>
        previous.filter(
          (address) =>
            (address.id ?? address.address_id) !== addressId
        )
      );

      setMessage("Address deleted successfully.");
    } catch (error) {
      console.error("Failed to delete address:", error);

      setMessage(
        error?.response?.data?.message ||
          "Failed to delete address."
      );
    }
  }

  const success = message.toLowerCase().includes("successfully");

  return (
<AccountLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 text-black">
            <MapPinned size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black">My Addresses</h1>
            <p className="text-sm text-gray-400">
              Manage where we ship your orders.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`rounded-2xl border px-5 py-3 text-sm font-bold ${
              success
                ? "border-emerald-200 bg-emerald-950/60 text-emerald-300"
                : "border-red-200 bg-red-950/60 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center font-bold text-gray-300">
            Loading your addresses...
          </div>
        ) : addresses.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black">Saved addresses</h2>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-gray-300">
                {addresses.length} saved
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onDelete={() => remove(address.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">
              📍
            </div>
            <h2 className="mt-4 text-xl font-black">No saved addresses yet</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-gray-400">
              Add your first delivery address below so checkout is quicker next
              time.
            </p>
          </div>
        )}
<form
          onSubmit={createAddress}
          className="max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Phone size={16} />
            </span>
            <h2 className="text-lg font-black text-gray-900">Add new address</h2>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-black text-gray-900">
              Full name *
              <input
                className={inputCls}
                value={form.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
                placeholder="Enter recipient name"
              />
            </label>

            <label className="block text-sm font-black text-gray-900">
              Phone *
              <input
                className={inputCls}
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </label>

            <label className="block text-sm font-black text-gray-900">
              County *
              <input
                className={inputCls}
                value={form.county}
                onChange={(e) => updateField("county", e.target.value)}
                placeholder="Nairobi"
              />
            </label>

            <label className="block text-sm font-black text-gray-900">
              City *
              <input
                className={inputCls}
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Nairobi"
              />
            </label>

            <label className="block text-sm font-black text-gray-900 sm:col-span-2">
              Address line 1 *
              <input
                className={inputCls}
                value={form.address_line_1}
                onChange={(e) => updateField("address_line_1", e.target.value)}
                placeholder="Street / building / house number"
              />
            </label>

            <label className="block text-sm font-black text-gray-900 sm:col-span-2">
              Address line 2
              <input
                className={inputCls}
                value={form.address_line_2}
                onChange={(e) => updateField("address_line_2", e.target.value)}
                placeholder="Apartment, floor, landmark..."
              />
            </label>

            <label className="block text-sm font-black text-gray-900">
              Postal code
              <input
                className={inputCls}
                value={form.postal_code}
                onChange={(e) => updateField("postal_code", e.target.value)}
                placeholder="00100"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-black text-gray-900 sm:mt-6">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) => updateField("is_default", e.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />
              Make this my default address
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-yellow-400 px-6 py-3 text-sm font-black text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save address"}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}