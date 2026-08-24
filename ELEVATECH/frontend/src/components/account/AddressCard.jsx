export default function AddressCard({
  address,
  onEdit,
  onDelete,
}) {
  if (!address) return null;

  return (
    <div
      style={{
        padding: 18,
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          {address.full_name || "Saved Address"}
        </div>

        {address.is_default && (
          <span
            style={{
              background: "#dcfce7",
              color: "#15803d",
              padding: "5px 9px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            Default
          </span>
        )}
      </div>

      <div
        style={{
          color: "#444",
          lineHeight: 1.7,
        }}
      >
        {address.phone && (
          <div>
            <strong>Phone:</strong>{" "}
            {address.phone}
          </div>
        )}

        {address.address_line_1 && (
          <div>
            {address.address_line_1}
          </div>
        )}

        {address.address_line_2 && (
          <div>
            {address.address_line_2}
          </div>
        )}

        {(address.city || address.county) && (
          <div>
            {[address.city, address.county]
              .filter(Boolean)
              .join(", ")}
          </div>
        )}

        {address.postal_code && (
          <div>
            Postal Code: {address.postal_code}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          gap: 10,
        }}
      >
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Edit
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #fecaca",
              background: "#fff5f5",
              cursor: "pointer",
              fontWeight: 700,
              color: "#dc2626",
            }}
          >
            Delete
          </button>
        ) : null}
      </div>
    </div>
  );
}

