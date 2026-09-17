export default function ProductInfoTable({ product }) {
  const rows = [];

  function add(label, value) {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      rows.push({ label, value: String(value) });
    }
  }

  add("Brand", product.brand);
  add("Category", product.category);
  add("SKU", product.sku);
  add("Barcode", product.barcode);
  add("Color", product.color);

  if (product.weight) {
    add("Weight", `${product.weight} kg`);
  }

  add("Warranty", product.warranty);
  add("In stock", Number(product.quantity || 0) > 0 ? "Yes" : "No");

  if (Number(product.sold || 0) > 0) {
    add("Total sold", Number(product.sold).toLocaleString());
  }

  if (!rows.length) {
    return null;
  }

  return (
    <section className="pdp-card pdp-card-hover w-full min-w-0 p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl font-bold leading-tight text-[#0F1111]">
        Product information
      </h2>

      <div className="mt-4 w-full min-w-0 overflow-hidden rounded-lg border border-[#E3E6E6]">
        <table className="w-full table-fixed text-xs sm:text-sm">
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className="border-b border-[#E3E6E6] last:border-0"
              >
                <td className="w-[38%] bg-slate-50 px-2.5 py-3 text-left font-semibold leading-5 text-[#0F1111] sm:w-2/5 sm:px-3 sm:py-3.5">
                  {row.label}
                </td>

                <td className="w-[62%] break-words px-2.5 py-3 text-right leading-5 text-[#565959] sm:w-3/5 sm:px-3 sm:py-3.5">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}