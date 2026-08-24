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

  return (
    <AccountLayout user={user} onLogout={logout}>
      <div>
        <h2 style={h2}>Addresses</h2>

        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 10,
              background: message.includes("successfully")
                ? "#f0fdf4"
                : "#fef2f2",
              color: message.includes("successfully")
                ? "#166534"
                : "#b91c1c",
              fontWeight: 700,
            }}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div>Loading addresses...</div>
        ) : addresses.length > 0 ? (
          <div style={grid}>
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onDelete={() => remove(address.id)}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: 18,
              border: "1px solid #eee",
              borderRadius: 12,
              color: "#666",
            }}
          >
            No saved addresses yet.
          </div>
        )}

        <form
          onSubmit={createAddress}
          style={{
            marginTop: 20,
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 18,
            maxWidth: 850,
          }}
        >
          <div style={formTitle}>Add new address</div>

          <div style={grid2}>
            <label style={field}>
              Full name *
              <input
                style={input}
                value={form.full_name}
                onChange={(e) =>
                  updateField("full_name", e.target.value)
                }
                placeholder="John Doe"
              />
            </label>

            <label style={field}>
              Phone *
              <input
                style={input}
                value={form.phone}
                onChange={(e) =>
                  updateField("phone", e.target.value)
                }
                placeholder="2547XXXXXXXX"
              />
            </label>

            <label style={field}>
              County *
              <input
                style={input}
                value={form.county}
                onChange={(e) =>
                  updateField("county", e.target.value)
                }
                placeholder="Nairobi"
              />
            </label>

            <label style={field}>
              City *
              <input
                style={input}
                value={form.city}
                onChange={(e) =>
                  updateField("city", e.target.value)
                }
                placeholder="Nairobi"
              />
            </label>

            <label
              style={{
                ...field,
                gridColumn: "1 / -1",
              }}
            >
              Address line 1 *
              <input
                style={input}
                value={form.address_line_1}
                onChange={(e) =>
                  updateField(
                    "address_line_1",
                    e.target.value
                  )
                }
                placeholder="Street / building / house number"
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
                value={form.address_line_2}
                onChange={(e) =>
                  updateField(
                    "address_line_2",
                    e.target.value
                  )
                }
                placeholder="Apartment, floor, landmark..."
              />
            </label>

            <label style={field}>
              Postal code
              <input
                style={input}
                value={form.postal_code}
                onChange={(e) =>
                  updateField(
                    "postal_code",
                    e.target.value
                  )
                }
                placeholder="00100"
              />
            </label>

            <label
              style={{
                ...field,
                justifyContent: "center",
              }}
            >
              <span>Default address</span>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) =>
                    updateField(
                      "is_default",
                      e.target.checked
                    )
                  }
                />
                Make this my default address
              </label>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              ...primaryBtn,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving..." : "Save address"}
          </button>
        </form>
      </div>
    </AccountLayout>
  );
}

const h2 = {
  fontSize: 22,
  fontWeight: 900,
  marginBottom: 16,
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 12,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  fontWeight: 800,
  color: "#111",
};

const input = {
  padding: 11,
  borderRadius: 10,
  border: "1px solid #ddd",
  outline: "none",
  fontSize: 14,
};

const formTitle = {
  fontSize: 18,
  fontWeight: 900,
  marginBottom: 14,
};

const primaryBtn = {
  marginTop: 16,
  padding: "11px 16px",
  borderRadius: 12,
  border: "none",
  background: "#0ea5e9",
  color: "#fff",
  fontWeight: 900,
  cursor: "pointer",
};
