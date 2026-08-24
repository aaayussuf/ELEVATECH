import { useContext, useEffect, useState } from "react";
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

export default function Addresses() {
  const { user, token, isLoading, logout } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    ...emptyForm,
    full_name: user?.name || "",
  });

  useEffect(() => {
    if (user?.name) {
      setForm((prev) => ({
        ...prev,
        full_name: prev.full_name || user.name,
      }));
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;

    async function loadAddresses() {
      try {
        setLoading(true);
        setError("");

        const list = await accountService.getAddresses(token);

        if (mounted) {
          setAddresses(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load addresses"
          );
          setAddresses([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (token && !isLoading) {
      loadAddresses();
    }

    return () => {
      mounted = false;
    };
  }, [isLoading, token]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function createAddress(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.full_name.trim()) {
      setError("Full name is required");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    if (!form.county.trim()) {
      setError("County is required");
      return;
    }

    if (!form.city.trim()) {
      setError("City is required");
      return;
    }

    if (!form.address_line_1.trim()) {
      setError("Address line 1 is required");
      return;
    }

    try {
      setSaving(true);

      const created = await accountService.createAddress(
        token,
        form
      );

      if (created) {
        setAddresses((prev) => [created, ...prev]);
      }

      setForm({
        ...emptyForm,
        full_name: user?.name || "",
      });

      setMessage("Address saved successfully");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save address"
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(addressId) {
    if (!window.confirm("Delete this address?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await accountService.deleteAddress(
        token,
        addressId
      );

      setAddresses((prev) =>
        prev.filter(
          (address) =>
            (address.id ?? address.address_id) !==
            addressId
        )
      );

      setMessage("Address deleted successfully");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to delete address"
      );
    }
  }

  return (
    <AccountLayout
      user={user}
      onLogout={logout}
    >
      <div>
        <h2 style={h2}>My Addresses</h2>

        {error && (
          <div style={errorBox}>
            {error}
          </div>
        )}

        {message && (
          <div style={successBox}>
            {message}
          </div>
        )}

        {loading ? (
          <div>Loading addresses...</div>
        ) : addresses.length ? (
          <div style={grid}>
            {addresses.map((address) => (
              <AddressCard
                key={
                  address.id ??
                  address.address_id
                }
                address={address}
                onDelete={() =>
                  remove(
                    address.id ??
                      address.address_id
                  )
                }
              />
            ))}
          </div>
        ) : (
          <div style={emptyBox}>
            No saved addresses yet.
          </div>
        )}

        <form
          onSubmit={createAddress}
          style={formBox}
        >
          <div style={formTitle}>
            Add New Address
          </div>

          <div style={grid2}>
            <label style={field}>
              Full name
              <input
                style={input}
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </label>

            <label style={field}>
              Phone
              <input
                style={input}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0712345678"
              />
            </label>

            <label style={field}>
              County
              <input
                style={input}
                name="county"
                value={form.county}
                onChange={handleChange}
                placeholder="Nairobi"
              />
            </label>

            <label style={field}>
              City
              <input
                style={input}
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Nairobi"
              />
            </label>

            <label
              style={{
                ...field,
                gridColumn: "1 / -1",
              }}
            >
              Address line 1
              <input
                style={input}
                name="address_line_1"
                value={form.address_line_1}
                onChange={handleChange}
                placeholder="Street / Building / Estate"
              />
            </label>

            <label
              style={{
                ...field,
                gridColumn: "1 / -1",
              }}
            >
              Address line 2
              <input
                style={input}
                name="address_line_2"
                value={form.address_line_2}
                onChange={handleChange}
                placeholder="Apartment, floor, etc. (optional)"
              />
            </label>

            <label style={field}>
              Postal code
              <input
                style={input}
                name="postal_code"
                value={form.postal_code}
                onChange={handleChange}
                placeholder="00100"
              />
            </label>

            <label
              style={{
                ...field,
                justifyContent: "center",
              }}
            >
              <span>
                <input
                  type="checkbox"
                  name="is_default"
                  checked={form.is_default}
                  onChange={handleChange}
                  style={{
                    marginRight: 8,
                  }}
                />

                Make this my default address
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={
              saving ||
              !form.full_name.trim() ||
              !form.phone.trim() ||
              !form.county.trim() ||
              !form.city.trim() ||
              !form.address_line_1.trim()
            }
            style={{
              ...primaryBtn,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving
              ? "Saving..."
              : "Save Address"}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}

const h2 = {
  fontSize: 28,
  fontWeight: 900,
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, minmax(0, 1fr))",
  gap: 14,
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontWeight: 800,
  color: "#111",
};

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 15,
};

const formBox = {
  marginTop: 24,
  border: "1px solid #eee",
  borderRadius: 16,
  padding: 20,
  background: "#fff",
};

const formTitle = {
  fontSize: 20,
  fontWeight: 900,
  marginBottom: 16,
};

const primaryBtn = {
  marginTop: 18,
  padding: "12px 18px",
  borderRadius: 12,
  border: "none",
  background: "#0ea5e9",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};

const errorBox = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: 12,
  borderRadius: 10,
  marginBottom: 15,
  fontWeight: 700,
};

const successBox = {
  background: "#dcfce7",
  color: "#15803d",
  padding: 12,
  borderRadius: 10,
  marginBottom: 15,
  fontWeight: 700,
};

const emptyBox = {
  color: "#666",
  padding: 20,
  border: "1px dashed #ddd",
  borderRadius: 12,
};
