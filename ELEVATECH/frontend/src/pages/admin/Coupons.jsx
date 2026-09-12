import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminCouponService from "../../services/adminCouponService";

const EMPTY_FORM = {
  code: "",
  description: "",
  discount_type: "percent",
  value: "",
  minimum_amount: "0",
  usage_limit: "0",
  expires_at: "",
  active: true,
};

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    try {
      setLoading(true);
      setError("");
      const data = await adminCouponService.listCoupons();
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }



  function openEdit(coupon) {
    setEditing(coupon);
    setForm({
      code: coupon.code || "",
      description: coupon.description || "",
      discount_type: coupon.discount_type || "percent",
      value: coupon.value ?? "",
      minimum_amount: coupon.minimum_amount ?? "0",
      usage_limit: coupon.usage_limit ?? "0",
      expires_at: coupon.expires_at
        ? coupon.expires_at.slice(0, 16)
        : "",
      active: coupon.active ?? true,
    });
    setModalOpen(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function buildPayload() {
    return {
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || null,
      discount_type: form.discount_type,
      value: parseFloat(form.value),
      minimum_amount: parseFloat(form.minimum_amount || 0),
      usage_limit: parseInt(form.usage_limit || 0, 10),
      expires_at: form.expires_at || null,
      active: form.active,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const payload = buildPayload();

    try {
      if (editing) {
        await adminCouponService.updateCoupon(editing.id, payload);
      } else {
        await adminCouponService.createCoupon(payload);
      }
      setModalOpen(false);
      await loadCoupons();
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          (editing
            ? "Unable to update coupon."
            : "Unable to create coupon.")
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(coupon) {
    try {
      await adminCouponService.updateCoupon(coupon.id, {
        code: coupon.code,
        description: coupon.description,
        discount_type: coupon.discount_type,
        value: coupon.value,
        minimum_amount: coupon.minimum_amount,
        usage_limit: coupon.usage_limit,
        expires_at: coupon.expires_at,
        active: !coupon.active,
      });
      await loadCoupons();
    } catch (err) {
      console.error(err);
      alert("Unable to update coupon status.");
    }
  }

  async function handleDelete(coupon) {
    if (
      !window.confirm(
        `Delete coupon "${coupon.code}"? This cannot be undone.`
      )
    )
      return;

    try {
      await adminCouponService.deleteCoupon(coupon.id);
      await loadCoupons();
    } catch (err) {
      console.error(err);
      alert("Unable to delete coupon.");
    }
  }

  function formatDiscount(coupon) {
    const val = Number(coupon.value);
    return coupon.discount_type === "percent"
      ? `${val}%`
      : `KSh ${val.toLocaleString()}`;
  }

  function formatExpiry(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-gray-500 mt-1">
            Create and manage discount coupons for your store.
          </p>
        </div>
<Link
          to="/admin/coupons/new"
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
        >
          + New Coupon
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {coupons.length === 0 ? (
          <p className="p-8 text-gray-500">
            No coupons yet. Click "+ New Coupon" to create one.
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Code</th>
                <th className="text-left p-4">Description</th>
                <th className="text-left p-4">Discount</th>
                <th className="text-left p-4">Min. Amount</th>
                <th className="text-left p-4">Usage</th>
                <th className="text-left p-4">Expires</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <span className="font-mono font-bold bg-gray-100 px-2 py-1 rounded">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {coupon.description || "—"}
                  </td>
                  <td className="p-4 font-semibold">
                    {formatDiscount(coupon)}
                  </td>
                  <td className="p-4">
                    {Number(coupon.minimum_amount) > 0
                      ? `KSh ${Number(coupon.minimum_amount).toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="p-4">
                    {coupon.usage_limit > 0
                      ? `${coupon.used} / ${coupon.usage_limit}`
                      : "Unlimited"}
                  </td>
                  <td className="p-4">{formatExpiry(coupon.expires_at)}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        coupon.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coupon.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-3">
                    <button
                      onClick={() => openEdit(coupon)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(coupon)}
                      className="text-orange-600 hover:underline text-sm"
                    >
                      {coupon.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(coupon)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editing ? `Edit Coupon: ${editing.code}` : "New Coupon"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Coupon Code *
                  </label>
                  <input
                    name="code"
                    className="w-full border rounded-xl px-4 py-2.5 uppercase"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="SAVE10"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Discount Type *
                  </label>
                  <select
                    name="discount_type"
                    className="w-full border rounded-xl px-4 py-2.5"
                    value={form.discount_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="percent">Percent (%)</option>
                    <option value="fixed">Fixed (KSh)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-sm">
                  Description
                </label>
                <input
                  name="description"
                  className="w-full border rounded-xl px-4 py-2.5"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter coupon description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    {form.discount_type === "percent"
                      ? "Discount Value (%) *"
                      : "Discount Value (KSh) *"}
                  </label>
                  <input
                    type="number"
                    name="value"
                    min="0"
                    step="any"
                    className="w-full border rounded-xl px-4 py-2.5"
                    value={form.value}
                    onChange={handleChange}
                    placeholder={form.discount_type === "percent" ? "10" : "500"}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Minimum Order Amount (KSh)
                  </label>
                  <input
                    type="number"
                    name="minimum_amount"
                    min="0"
                    step="any"
                    className="w-full border rounded-xl px-4 py-2.5"
                    value={form.minimum_amount}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    name="usage_limit"
                    min="0"
                    step="1"
                    className="w-full border rounded-xl px-4 py-2.5"
                    value={form.usage_limit}
                    onChange={handleChange}
                    placeholder="0 = unlimited"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-sm">
                    Expires At
                  </label>
                  <input
                    type="datetime-local"
                    name="expires_at"
                    className="w-full border rounded-xl px-4 py-2.5"
                    value={form.expires_at}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-sm">
                    Active (can be used at checkout)
                  </span>
                </label>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editing
                    ? "Save Changes"
                    : "Create Coupon"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="border px-8 py-3 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

