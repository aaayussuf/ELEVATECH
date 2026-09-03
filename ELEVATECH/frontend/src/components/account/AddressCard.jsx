import { CheckCircle2, MapPinned, PencilLine, Phone, Trash2 } from "lucide-react";

export default function AddressCard({ address, onEdit, onDelete }) {
  if (!address) return null;

  const location = [address.city, address.county].filter(Boolean).join(", ");
  const street = [address.address_line_1, address.address_line_2]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-3xl border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl",
        address.is_default
          ? "border-blue-500/60 shadow-[0_12px_35px_-15px_rgba(59,130,246,0.5)]"
          : "border-gray-200 shadow-sm",
      ].join(" ")}
    >
      {address.is_default && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-28 w-28 bg-gradient-to-bl from-blue-500/15 to-transparent"
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition",
              address.is_default
                ? "bg-gradient-to-br from-blue-500 to-yellow-400 text-black"
                : "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
            ].join(" ")}
          >
            <MapPinned size={20} />
          </div>

          <div>
            <div className="font-black text-gray-900">{address.full_name}</div>
            {location && (
              <div className="text-xs font-semibold text-gray-400">{location}</div>
            )}
          </div>
        </div>

        {address.is_default && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-sm">
            <CheckCircle2 size={12} />
            Default
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-gray-600">
        {street && (
          <div className="flex items-start gap-2">
            <MapPinned size={15} className="mt-0.5 shrink-0 text-gray-300" />
            <span className="font-medium">{street}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Phone size={15} className="shrink-0 text-gray-300" />
          <span className="font-medium">{address.phone}</span>
        </div>

        {address.postal_code && (
          <div className="flex items-center gap-2">
            <MapPinned size={15} className="shrink-0 text-gray-300" />
            <span className="font-medium">Postal code: {address.postal_code}</span>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs font-black text-blue-700 transition hover:bg-blue-100"
          >
            <PencilLine size={14} />
            Edit
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-black text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
