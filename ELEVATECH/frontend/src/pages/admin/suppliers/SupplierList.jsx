import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminSupplierService from "../../../services/adminSupplierService";

export default function SupplierList() {

  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadSuppliers();
  }, []);

  async function loadSuppliers() {
    const data = await adminSupplierService.getSuppliers();
    setSuppliers(data);
  }

  async function remove(id) {

    if (!window.confirm("Delete supplier?"))
      return;

    await adminSupplierService.deleteSupplier(id);

    loadSuppliers();

  }

return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Suppliers
        </h1>

        <Link
          to="/admin/suppliers/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Supplier
        </Link>

      </div>

      <table className="w-full border">

        <thead>

          <tr className="bg-gray-100">

            <th className="p-3 text-left">
              Company
            </th>

            <th className="p-3 text-left">
              Contact
            </th>

            <th className="p-3 text-left">
              Email
            </th>

            <th className="p-3 text-left">
              Phone
            </th>

            <th className="p-3">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {suppliers.map(supplier => (

            <tr
              key={supplier.id}
              className="border-t"
            >

              <td className="p-3">
                {supplier.company_name}
              </td>

              <td className="p-3">
                {supplier.contact_name}
              </td>

              <td className="p-3">
                {supplier.email}
              </td>

              <td className="p-3">
                {supplier.phone}
              </td>

              <td className="p-3 text-center">

                <button
                  className="text-red-600"
                  onClick={() =>
                    remove(supplier.id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}
