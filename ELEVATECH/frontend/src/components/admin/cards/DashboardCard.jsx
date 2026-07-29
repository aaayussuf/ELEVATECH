export default function DashboardCard({
  title,
  children,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold mb-4">
        {title}
      </h2>

      {children}
    </div>
  );
}

