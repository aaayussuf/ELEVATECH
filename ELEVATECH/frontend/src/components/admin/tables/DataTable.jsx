export default function DataTable({
  columns = [],
  data = [],
  actions,
  loading = false,
  emptyMessage = "No data found",
}) {
  const rows = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="admin-card p-6">
        <div className="space-y-3">
          <div className="admin-skeleton h-10 w-full" />
          <div className="admin-skeleton h-10 w-full" />
          <div className="admin-skeleton h-10 w-full" />
          <p className="text-center text-sm font-semibold text-slate-500 pt-2">
            Loading…
          </p>
        </div>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="admin-card p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl">
          📭
        </div>
        <p className="font-bold text-slate-700">{emptyMessage}</p>
        <p className="text-sm text-slate-500 mt-1">
          New records will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.title}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id ?? idx}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : row[column.key] ?? "—"}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="flex min-w-[120px] flex-wrap items-center gap-2">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


