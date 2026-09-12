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
    <div className="pdp-card pdp-card-hover p-6">
      <h2 className="text-xl font-bold text-[#0F1111]">About this item</h2>

      <ul className="mt-4 space-y-3 text-[#0F1111]">
        {bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <CircleCheckBig
              size={17}
              className="text-emerald-600 shrink-0 mt-0.5"
            />

            <span className="flex-1 leading-6">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}