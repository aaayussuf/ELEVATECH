export default function EmptyState({
  title = "No data found"
}) {
  return (
    <div className="py-20 text-center text-gray-500">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>
    </div>
  );
}

