import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const FALLBACK_IMAGE =
  "https://placehold.co/900x900/f1f5f9/64748b?text=ELEVATECH";

export default function ProductGallery({ product }) {
  const images = useMemo(() => {
    const values = [
      product?.image,
      product?.image2,
      product?.image3,
      product?.image4,
    ].filter(
      (image, index, array) =>
        image && array.indexOf(image) === index
    );

    return values.length > 0 ? values : [FALLBACK_IMAGE];
  }, [product]);

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex] || FALLBACK_IMAGE;

  function previousImage() {
    setActiveIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  }

  function nextImage() {
    setActiveIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  }

  return (
    <section className="w-full min-w-0">
      {/* Main image */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="relative flex aspect-square w-full items-center justify-center p-4 sm:p-6 md:p-8 lg:p-6 xl:p-8">
          <img
            src={activeImage}
            alt={product?.name || "Product"}
            className="h-full w-full object-contain"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />

          {/* Zoom indicator */}
          <div
            className="pointer-events-none absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur"
            aria-hidden="true"
          >
            <ZoomIn size={14} />
            <span className="hidden sm:inline">View</span>
          </div>

          {/* Mobile/tablet arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                aria-label="Previous product image"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md transition hover:bg-white active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Next product image"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-md transition hover:bg-white active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            style={{
              scrollbarWidth: "thin",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View product image ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition sm:h-20 sm:w-20 ${
                  activeIndex === index
                    ? "border-blue-600 shadow-sm"
                    : "border-slate-200 hover:border-slate-400"
                }`}
              >
                <img
                  src={image}
                  alt=""
                  className="h-full w-full object-contain p-1.5"
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile image dots */}
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to image ${index + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === index
                  ? "w-5 bg-blue-600"
                  : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
