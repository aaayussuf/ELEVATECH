export default function AddressCard({ address, onEdit, onDelete }) {
  if (!address) return null;

  return (
    <div
      style={{
        padding: 16,
        border: address.is_default
          ? "2px solid #0ea5e9"
          : "1px solid #eee",
        borderRadius: 12,
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div style={{ fontWeight: 900 }}>
          {address.full_name}
        </div>

        {address.is_default && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#0369a1",
            }}
          >
            DEFAULT
          </span>
        )}
      </div>

      <div
        style={{
          color: "#444",
          lineHeight: 1.6,
        }}
      >
        <div>{address.phone}</div>
        <div>{address.address_line_1}</div>

        {address.address_line_2 && (
          <div>{address.address_line_2}</div>
        )}

        <div>
          {address.city}, {address.county}
        </div>

        {address.postal_code && (
          <div>{address.postal_code}</div>
        )}
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 10,
        }}
      >
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            style={button}
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            style={deleteButton}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

const button = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #eee",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 700,
};

const deleteButton = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "1px solid #fee2e2",
  background: "#fff5f5",
  cursor: "pointer",
  fontWeight: 700,
  color: "#dc2626",
};
