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
  "mt-2 w-full min-h-11 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
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
    if (!user) return;
    setForm((current) => ({
      ...current,
      full_name:
        current.full_name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      phone: current.phone || user.phone || "",
    }));
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
        error?.response?.data?.message || "Failed to save address."
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
        error?.response?.data?.message || "Failed to delete address."
      );
    }
  }
  const success = message.toLowerCase().includes("successfully");
  return (
    <AccountLayout user={user} onLogout={logout}>
      <div className="w-full min-w-0 space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-yellow-400 text-black shadow-sm">
              <MapPinned size={20} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">My Addresses</h1>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">Manage where we ship your orders.</p>
            </div>
          </div>
          {addresses.length > 0 && !loading && (
            <span className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600">
              {addresses.length} {addresses.length === 1 ? "address" : "addresses"}
            </span>
          )}
        </div>
        {message && (
          <div
            role="alert"
            className={success
              ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 sm:px-5"
              : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 sm:px-5"}
          >
            {message}
          </div>
        )}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:rounded-3xl sm:p-10">
            <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-gray-200" />
            <p className="text-sm font-bold text-gray-500 sm:text-base">Loading your addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-black text-gray-900 sm:text-xl">Saved addresses</h2>
              <span className="text-xs font-semibold text-gray-400">Choose your preferred delivery location at checkout.</span>
            </div>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
              {addresses.map((address) => (
                <div key={address.id ?? address.address_id} className="min-w-0">
                  <AddressCard address={address} onDelete={() => remove(address.id ?? address.address_id)} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center sm:rounded-3xl sm:px-8 sm:py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">📍</div>
            <h2 className="mt-4 text-xl font-black text-gray-900">No saved addresses yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">Add your first delivery address below so checkout is quicker next time.</p>
          </div>
        )}
        <form onSubmit={createAddress} className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-6 lg:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Phone size={17} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-black text-gray-900 sm:text-xl">Add new address</h2>
              <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">Enter your delivery details below.</p>
            </div>
          </div>
          <div className="mt-5 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            <label className="block min-w-0 text-sm font-black text-gray-900">Full name *
              <input className={inputCls} value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} placeholder="Enter recipient name" autoComplete="name" />
            </label>
            <label className="block min-w-0 text-sm font-black text-gray-900">Phone *
              <input type="tel" className={inputCls} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Enter phone number" autoComplete="tel" />
            </label>
            <label className="block min-w-0 text-sm font-black text-gray-900">County *
              <input className={inputCls} value={form.county} onChange={(e) => updateField("county", e.target.value)} placeholder="Nairobi" autoComplete="address-level1" />
            </label>
            <label className="block min-w-0 text-sm font-black text-gray-900">City *
              <input className={inputCls} value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Nairobi" autoComplete="address-level2" />
            </label>
            <label className="block min-w-0 text-sm font-black text-gray-900 sm:col-span-2">Address line 1 *
              <input className={inputCls} value={form.address_line_1} onChange={(e) => updateField("address_line_1", e.target.value)} placeholder="Street / building / house number" autoComplete="street-address" />
            </label>
            <label className="block min-w-0 text-sm font-black text-gray-900 sm:col-span-2">Address line 2
              <input className={inputCls} value={form.address_line_2} onChange={(e) => updateField("address_line_2", e.target.value)} placeholder="Apartment, floor, landmark..." autoComplete="address-line2" />
            </label>
            <label className="block min-w-0 text-sm font-black text-gray-900">Postal code
              <input inputMode="numeric" className={inputCls} value={form.postal_code} onChange={(e) => updateField("postal_code", e.target.value)} placeholder="00100" autoComplete="postal-code" />
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-black text-gray-900 transition hover:bg-gray-100 sm:mt-7">
              <input type="checkbox" checked={form.is_default} onChange={(e) => updateField("is_default", e.target.checked)} className="h-5 w-5 shrink-0 accent-blue-600" />
              <span className="leading-5">Make this my default address</span>
            </label>
          </div>
          <button type="submit" disabled={saving} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-yellow-400 px-5 py-3 text-sm font-black text-black shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-6 sm:w-auto sm:px-7">
            {saving ? "Saving..." : "Save address"}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}



