export default function PurchaseOrderItemsTable({

  items,

  setItems

}) {

  function addRow() {

    setItems([

      ...items,

      {

        product_id: "",

        quantity: 1,

        unit_cost: 0

      }

    ]);

  }

  function removeRow(index) {

    const copy = [...items];

    copy.splice(index, 1);

    setItems(copy);

  }

  function update(index, field, value) {

    const copy = [...items];

    copy[index][field] = value;

    setItems(copy);

  }

  return (

    <div>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">

              Product

            </th>

            <th className="text-left">

              Qty

            </th>

            <th className="text-left">

              Unit Cost

            </th>

            <th className="text-left">

              Total

            </th>

            <th />

          </tr>

        </thead>

        <tbody>

          {items.map((item, index) => (

            <tr key={index} className="border-b">

              <td className="py-3">

                <input

                  className="border rounded p-2 w-full"

                  placeholder="Product ID"

                  value={item.product_id}

                  onChange={(e) =>

                    update(

                      index,

                      "product_id",

                      e.target.value

                    )

                  }

                />

              </td>

              <td>

                <input

                  type="number"

                  className="border rounded p-2 w-24"

                  value={item.quantity}

                  onChange={(e) =>

                    update(

                      index,

                      "quantity",

                      Number(e.target.value)

                    )

                  }

                />

              </td>

              <td>

                <input

                  type="number"

                  className="border rounded p-2 w-32"

                  value={item.unit_cost}

                  onChange={(e) =>

                    update(

                      index,

                      "unit_cost",

                      Number(e.target.value)

                    )

                  }

                />

              </td>

              <td>

                {(item.quantity * item.unit_cost).toFixed(2)}

              </td>

              <td>

                <button

                  onClick={() => removeRow(index)}

                  className="text-red-600"

                >

                  Remove

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <button

        onClick={addRow}

        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded"

      >

        + Add Product

      </button>

    </div>

  );

}
