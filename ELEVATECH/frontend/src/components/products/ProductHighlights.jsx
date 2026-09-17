import { CircleCheckBig } from "lucide-react";

function buildBullets(product) {
  const raw = [product.short_description, product.description].find(
    (value) => value && value.trim()
  );

  if (!raw) {
    return [];
  }

  const lines = raw
    .split(/\r?\n|\u2022/)
    .map((line) => line.trim())
    .filter((line) => line.length > 1);

  if (lines.length >= 2) {
    return lines.slice(0, 8);
  }

  const sentences = raw
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 1);

  return sentences.slice(0, 8);
}

export default function ProductHighlights({ product }) {
  const bullets = buildBullets(product);

  if (!bullets.length) {
    return null;
  }

  return (
    <section className="pdp-card pdp-card-hover w-full min-w-0 p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl font-bold leading-tight text-[#0F1111]">
        About this item
      </h2>

      <ul className="mt-4 space-y-3 sm:space-y-3.5 text-[#0F1111]">
        {bullets.map((bullet, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 sm:gap-3"
          >
            <CircleCheckBig
              size={17}
              className="mt-1 shrink-0 text-emerald-600"
            />

            <span className="min-w-0 flex-1 text-sm sm:text-base leading-6">
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}