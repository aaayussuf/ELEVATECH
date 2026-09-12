import { Link } from "react-router-dom";

export default function ProductBreadcrumb({ category, name }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm flex items-center gap-2 flex-wrap"
    >
      <Link to="/" className="pdp-link">
        Home
      </Link>

      {category && (
        <>
          <span aria-hidden="true" className="text-[#565959]">
            ›
          </span>

          <Link
            to={`/products?category=${encodeURIComponent(category)}`}
            className="pdp-link"
          >
            {category}
          </Link>
        </>
      )}

      <span aria-hidden="true" className="text-[#565959]">
        ›
      </span>

      <span className="text-[#565959] truncate max-w-[560px]" title={name}>
        {name}
      </span>
    </nav>
  );
}