export default function DataTable({
  columns,
  data,
  actions,
  loading = false,
  emptyMessage = "No data found",
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center">
        Loading...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left px-6 py-4 font-semibold"
              >
                {column.title}
              </th>
            ))}

            {actions && (
              <th className="text-left px-6 py-4">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-t hover:bg-gray-50"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4"
                >
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </td>
              ))}

              {actions && (
                <td className="px-6 py-4">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
