import { useEffect, useState } from "react";
import supplierService from "../../../services/supplierService";

export default function SupplierSelect({

  value,

  onChange

}) {

  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {

    async function load() {

      const data = await supplierService.getAll();

      setSuppliers(data);

    }

    load();

  }, []);

  return (

    <select

      value={value}

      onChange={(e) => onChange(e.target.value)}

      className="w-full border rounded-lg p-3"

    >

      <option value="">

        Select Supplier

      </option>

      {suppliers.map((supplier) => (

        <option

          key={supplier.id}

          value={supplier.id}

        >

          {supplier.company_name}

        </option>

      ))}

    </select>

  );

}
