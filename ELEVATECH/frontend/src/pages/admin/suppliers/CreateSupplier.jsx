import { useState } from "react";
import { useNavigate } from "react-router-dom";

import adminSupplierService from "../../../services/adminSupplierService";

export default function CreateSupplier() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await adminSupplierService.createSupplier(form);

    navigate("/admin/suppliers");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        New Supplier
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <input
          name="company_name"
          placeholder="Company"
          value={form.company_name}
          onChange={handleChange}
          className="w-full border rounded p-3"
          required
        />

        <input
          name="contact_name"
          placeholder="Contact Person"
          value={form.contact_name}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded p-3"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border rounded p-3"
          rows={3}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border rounded p-3"
          rows={4}
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Save Supplier
        </button>

      </form>

    </div>
  );
}
