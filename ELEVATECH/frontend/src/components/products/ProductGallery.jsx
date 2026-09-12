import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "https://placehold.co/500x500?text=ElevaTech";

function onImageError(event) {
  event.currentTarget.src = FALLBACK_IMAGE;
}

export default function ProductGallery({ product }) {
  const images = [
    product.image,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean);

  const source = images.length ? images : [FALLBACK_IMAGE];

  const [selected, setSelected] = useState(source[0]);

  useEffect(() => {
    setSelected(source[0]);
  }, [product?.id]);

  return (
    <div className="space-y-3">
      {/* MAIN IMAGE */}
      <div className="pdp-card pdp-card-hover p-5 relative overflow-hidden">
        {product.has_discount && (
          <span className="absolute top-3 left-3 z-10 bg-red-50 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
            -{product.discount_percent}%
          </span>
        )}

        <img
          src={selected}
          alt={product.name}
          onError={onImageError}
          className="w-full aspect-square object-contain hover:scale-110 transition duration-300 cursor-zoom-in"
        />
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3" role="listbox" aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={`${product?.id}-${index}`}
              type="button"
              onClick={() => setSelected(image)}
              aria-label={`View image ${index + 1}`}
              aria-selected={selected === image}
              className={`pdp-card p-1.5 aspect-square overflow-hidden ${
                selected === image
                  ? "ring-2 ring-[#007185]"
                  : "hover:shadow"
              }`}
            >
              <img
                src={image}
                alt=""
                onError={onImageError}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}