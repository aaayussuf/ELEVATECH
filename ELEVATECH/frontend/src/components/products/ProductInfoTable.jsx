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
    <div className="pdp-card pdp-card-hover p-6">
      <h2 className="text-xl font-bold text-[#0F1111]">
        Product information
      </h2>

      <table className="w-full mt-4 text-sm">
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-[#E3E6E6] last:border-0"
            >
              <td className="py-2.5 font-semibold text-[#0F1111]">
                {row.label}
              </td>

              <td className="py-2.5 text-[#565959] text-right">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}