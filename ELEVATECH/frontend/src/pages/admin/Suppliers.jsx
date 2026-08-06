import { useEffect, useState } from "react";

import supplierService from "../../services/supplierService";
import SupplierForm from "../../components/admin/suppliers/SupplierForm";

export default function Suppliers() {

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {

    try {

      const data = await supplierService.getAll();

      setSuppliers(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  async function createSupplier(values) {

    try {

      setSaving(true);

      await supplierService.create(values);

      await loadSuppliers();

      setShowModal(false);

    } catch (err) {

      console.error(err);

      alert("Failed to save supplier.");

    } finally {

      setSaving(false);

    }

  }

  if (loading) {

    return (

      <div className="p-6">

        Loading suppliers...

      </div>

    );

  }

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">

          Suppliers

        </h1>

        <button

          onClick={() => setShowModal(true)}

          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"

        >

          + New Supplier

        </button>

      </div>

      <div className="bg-white rounded-xl shadow border overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Company</th>

              <th className="p-4 text-left">Contact</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Phone</th>

              <th className="p-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {suppliers.length === 0 ? (

              <tr>

                <td

                  colSpan={5}

                  className="text-center p-10 text-gray-500"

                >

                  No suppliers found.

                </td>

              </tr>

            ) : (

              suppliers.map((supplier) => (

                <tr

                  key={supplier.id}

                  className="border-t"

                >

                  <td className="p-4 font-semibold">

                    {supplier.company_name}

                  </td>

                  <td className="p-4">

                    {supplier.contact_name}

                  </td>

                  <td className="p-4">

                    {supplier.email}

                  </td>

                  <td className="p-4">

                    {supplier.phone}

                  </td>

                  <td className="p-4">

                    <button className="text-blue-600 mr-4">

                      Edit

                    </button>

                    <button className="text-red-600">

                      Delete

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">

                New Supplier

              </h2>

              <button

                onClick={() => setShowModal(false)}

                className="text-gray-500 text-xl"

              >

                ✕

              </button>

            </div>

            <SupplierForm

              loading={saving}

              onSubmit={createSupplier}

            />

          </div>

        </div>

      )}

    </div>

  );

}
