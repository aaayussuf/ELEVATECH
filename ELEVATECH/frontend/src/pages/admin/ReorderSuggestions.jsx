import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inventoryService from "../../services/inventoryService";

export default function ReorderSuggestions() {
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, []);

  async function loadSuggestions() {
    try {
      const data =
        await inventoryService.getReorderSuggestions();

      setSuggestions(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load reorder suggestions.");
    } finally {
      setLoading(false);
    }
  }

  function createPurchaseOrder(suggestion) {
    navigate("/admin/purchase-orders/new", {
      state: {
        suggestion,
      },
    });
  }

  if (loading) {
    return (
      <div className="p-6">
        Loading reorder suggestions...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Reorder Suggestions
        </h1>

        <p className="text-gray-500 mt-1">
          Products that have reached their minimum stock level.
        </p>
      </div>

      {suggestions.length === 0 ? (

        <div className="bg-white border rounded-xl p-8 text-center">
          <p className="text-gray-500">
            No products currently need reordering.
          </p>
        </div>

      ) : (

        <div className="bg-white rounded-xl shadow border overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>
                <th className="text-left p-4">
                  Product
                </th>

                <th className="text-left p-4">
                  Current Stock
                </th>

                <th className="text-left p-4">
                  Minimum Stock
                </th>

                <th className="text-left p-4">
                  Recommended Quantity
                </th>

                <th className="text-left p-4">
                  Supplier
                </th>

                <th className="text-left p-4">
                  Action
                </th>
              </tr>

            </thead>

            <tbody>

              {suggestions.map((suggestion) => (

                <tr
                  key={suggestion.product_id}
                  className="border-t"
                >

                  <td className="p-4 font-semibold">
                    {suggestion.product_name}
                  </td>

                  <td className="p-4">
                    {suggestion.current_stock}
                  </td>

                  <td className="p-4">
                    {suggestion.minimum_stock}
                  </td>

                  <td className="p-4 font-semibold">
                    {suggestion.recommended_quantity}
                  </td>

                  <td className="p-4">
                    {suggestion.supplier_id
                      ? `Supplier #${suggestion.supplier_id}`
                      : "Not assigned"}
                  </td>

                  <td className="p-4">

                    {suggestion.supplier_id ? (

                      <button
                        onClick={() =>
                          createPurchaseOrder(suggestion)
                        }
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Create PO
                      </button>

                    ) : (

                      <span className="text-red-600">
                        Assign supplier
                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

