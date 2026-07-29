export default function Loader({
  text = "Loading..."
}) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="text-lg font-semibold">
        {text}
      </div>
    </div>
  );
}

