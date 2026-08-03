import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import adminCouponService from "../../services/adminCouponService";

export default function CouponForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const editing = Boolean(id);

  const [loading, setLoading] = useState(editing);

  const [saving, setSaving] = useState(false);

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [value, setValue] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!editing) return;

    async function loadCoupon() {
      try {
        const coupon = await adminCouponService.getCoupon(id);

        setCode(coupon.code || "");
        setDescription(coupon.description || "");
        setDiscountType(coupon.discount_type || "percent");
        setValue(coupon.value || "");
        setMinimumAmount(coupon.minimum_amount || "");
        setUsageLimit(coupon.usage_limit || "");
        setActive(coupon.active);

        if (coupon.expires_at) {
          setExpiresAt(coupon.expires_at.substring(0, 10));
        }
      } catch (err) {
        console.error(err);
        alert("Unable to load coupon.");
      } finally {
        setLoading(false);
      }
    }

    loadCoupon();
  }, [editing, id]);

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    const payload = {
      code,
      description,
      discount_type: discountType,
      value: Number(value),
      minimum_amount: Number(minimumAmount),
      usage_limit: Number(usageLimit),
      expires_at: expiresAt || null,
      active,
    };

    try {
      if (editing) {
        await adminCouponService.updateCoupon(id, payload);
      } else {
        await adminCouponService.createCoupon(payload);
      }

      navigate("/admin/coupons");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Unable to save coupon."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-xl">
        Loading coupon...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">

      <div className="bg-white rounded-2xl shadow">

        <div className="border-b p-6">

          <h1 className="text-3xl font-bold">
            {editing ? "Edit Coupon" : "Create Coupon"}
          </h1>

          <p className="text-gray-500 mt-2">
            Create discount coupons for your customers.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          <div>

            <label className="block mb-2 font-medium">
              Coupon Code
            </label>

            <input
              className="border rounded-xl w-full p-3"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase())
              }
              required
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="4"
              className="border rounded-xl w-full p-3"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Discount Type
            </label>

            <select
              className="border rounded-xl w-full p-3"
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value)
              }
            >
              <option value="percent">
                Percentage
              </option>

              <option value="fixed">
                Fixed Amount
              </option>

            </select>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Discount Value
            </label>

            <input
              type="number"
              className="border rounded-xl w-full p-3"
              value={value}
              onChange={(e) =>
                setValue(e.target.value)
              }
              required
            />

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-medium">
                Minimum Order
              </label>

              <input
                type="number"
                className="border rounded-xl w-full p-3"
                value={minimumAmount}
                onChange={(e) =>
                  setMinimumAmount(e.target.value)
                }
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Usage Limit
              </label>

              <input
                type="number"
                className="border rounded-xl w-full p-3"
                value={usageLimit}
                onChange={(e) =>
                  setUsageLimit(e.target.value)
                }
              />

            </div>

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Expiry Date
            </label>

            <input
              type="date"
              className="border rounded-xl w-full p-3"
              value={expiresAt}
              onChange={(e) =>
                setExpiresAt(e.target.value)
              }
            />

          </div>

          {editing && (
            <div>

              <label className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) =>
                    setActive(e.target.checked)
                  }
                />

                Active Coupon

              </label>

            </div>
          )}

          <div className="flex gap-4">

            <button
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
            >
              {saving
                ? "Saving..."
                : editing
                ? "Update Coupon"
                : "Save Coupon"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/coupons")}
              className="border px-8 py-3 rounded-xl"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}