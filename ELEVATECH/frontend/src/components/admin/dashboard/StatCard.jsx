export default function StatCard({
  title,
  value,
  change,
  icon,
}) {
return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

          {change !== undefined && (
            <p
              className={`mt-3 text-sm font-medium ${
                change >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </p>
          )}

        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>

    </div>
  );
}
