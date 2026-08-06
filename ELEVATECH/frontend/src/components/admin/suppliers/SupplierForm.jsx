import { useState } from "react";

export default function SupplierForm({ onSubmit, loading }) {

  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  function handleChange(e) {

    setForm({

      ...form,

      [e.target.name]: e.target.value,

    });

  }

  async function submit(e) {

    e.preventDefault();

    await onSubmit(form);

  }

  return (

    <form
      onSubmit={submit}
      className="space-y-4"
    >

      <input
        name="company_name"
        placeholder="Company Name"
        value={form.company_name}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
        required
      />

      <input
        name="contact_name"
        placeholder="Contact Person"
        value={form.contact_name}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <textarea
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />

      <button

        disabled={loading}

        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"

      >

        {loading ? "Saving..." : "Save Supplier"}

      </button>

    </form>

  );

}
