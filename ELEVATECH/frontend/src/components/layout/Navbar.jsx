import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Tag,
  Sparkles,
  BriefcaseBusiness,
} from "lucide-react";

import { CartContext } from "../../context/CartContext";

const navClass = ({ isActive }) =>
  `relative py-2 transition ${
    isActive
      ? "text-white"
      : "text-slate-300 hover:text-white"
  }`;

export default function Navbar() {
  const { totalItems } = useContext(CartContext);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    const close = () => {
      setCategoriesOpen(false);
    };

    window.addEventListener("scroll", close);

    return () => {
      window.removeEventListener("scroll", close);
    };
  }, []);

  function submitSearch(event) {
    event.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    setMobileOpen(false);

    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );
  }

  function go(path) {
    setMobileOpen(false);
    setCategoriesOpen(false);
    navigate(path);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#050B14]/95 backdrop-blur-2xl border-b border-white/10">
{/* TOP BAR */}
      <div className="hidden md:block bg-[#02060D] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-8 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              🇰🇪 Proudly serving customers across Kenya
            </span>

            <span>
              Premium technology • Secure shopping • Kenya-wide delivery
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="h-[76px] flex items-center gap-5">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center shrink-0"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src="/elevatech-logo.svg"
              alt="ELEVATECH"
              className="w-[190px] sm:w-[215px] h-auto"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold">

            <NavLink
              to="/"
              className={navClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navClass}
            >
              Shop
            </NavLink>

            {/* CATEGORIES */}
            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setCategoriesOpen((value) => !value)
                }
                className="flex items-center gap-1.5 py-2 text-slate-300 hover:text-white transition"
              >
                Categories

                <ChevronDown
                  size={15}
                  className={
                    categoriesOpen
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 top-full mt-3 w-64 rounded-2xl border border-white/10 bg-[#0A1423] shadow-2xl shadow-black/50 p-2">

                  {[
                    [
                      "Laptops & Computers",
                      "/products?category=1",
                    ],
                    [
                      "Printers",
                      "/products?category=2",
                    ],
                    [
                      "Smartphones",
                      "/products?category=3",
                    ],
                    [
                      "Accessories",
                      "/products?category=4",
                    ],
                  ].map(([label, path]) => (
                    <button
                      key={path}
                      type="button"
                      onClick={() => go(path)}
                      className="w-full text-left rounded-xl px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition"
                    >
                      {label}
                    </button>
                  ))}

                </div>
              )}

            </div>

            <NavLink
              to="/products?sort=newest"
              className={navClass}
            >
              New Arrivals
            </NavLink>

            <NavLink
              to="/products?featured=true"
              className={navClass}
            >
              Deals
            </NavLink>

            <NavLink
              to="/about"
              className={navClass}
            >
              About
            </NavLink>

          </nav>
{/* SEARCH */}
          <form
            onSubmit={submitSearch}
            className="hidden lg:flex flex-1 max-w-md ml-auto"
          >
            <div className="w-full h-11 rounded-full bg-white/[0.05] border border-white/10 focus-within:border-blue-400/60 focus-within:bg-white/[0.08] flex items-center px-4 transition">

              <Search
                size={18}
                className="text-slate-500 shrink-0"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products, brands & categories"
                className="w-full bg-transparent outline-none ml-3 text-sm text-white placeholder:text-slate-500"
                aria-label="Search products"
              />

            </div>
          </form>

          {/* ACTIONS */}
          <div className="flex items-center gap-4 ml-auto lg:ml-0">

            <Link
              to="/account/wishlist"
              className="hidden sm:block text-slate-300 hover:text-yellow-400 transition"
              title="Wishlist"
            >
              <Heart size={21} />
            </Link>

            <Link
              to="/account"
              className="hidden sm:block text-slate-300 hover:text-yellow-400 transition"
              title="Account"
            >
              <User size={21} />
            </Link>

            <Link
              to="/cart"
              className="relative text-slate-300 hover:text-yellow-400 transition"
              title="Shopping Cart"
            >
              <ShoppingCart size={22} />

              {totalItems > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center text-[10px] font-black">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen((value) => !value)
              }
              className="xl:hidden w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-200 hover:bg-white/5"
              aria-label={
                mobileOpen
                  ? "Close menu"
                  : "Open menu"
              }
            >
              {mobileOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>

          </div>

        </div>
{/* MOBILE NAV */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-white/10 py-4 pb-5">

            <form
              onSubmit={submitSearch}
              className="lg:hidden mb-4"
            >
              <div className="h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center px-4">

                <Search
                  size={18}
                  className="text-slate-500"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products..."
                  className="w-full bg-transparent outline-none ml-3 text-sm text-white placeholder:text-slate-500"
                />

              </div>
            </form>

            <div className="grid sm:grid-cols-2 gap-2">

              <Link
                onClick={() => setMobileOpen(false)}
                to="/"
                className="rounded-xl px-4 py-3 text-slate-200 hover:bg-white/5"
              >
                Home
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/products"
                className="rounded-xl px-4 py-3 text-slate-200 hover:bg-white/5"
              >
                Shop All
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/products?featured=true"
                className="rounded-xl px-4 py-3 text-slate-200 hover:bg-white/5 flex items-center gap-2"
              >
                <Tag size={16} />
                Deals
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/products?sort=newest"
                className="rounded-xl px-4 py-3 text-slate-200 hover:bg-white/5 flex items-center gap-2"
              >
                <Sparkles size={16} />
                New Arrivals
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/about"
                className="rounded-xl px-4 py-3 text-slate-200 hover:bg-white/5 flex items-center gap-2"
              >
                <BriefcaseBusiness size={16} />
                About ELEVATECH
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/account"
                className="rounded-xl px-4 py-3 text-slate-200 hover:bg-white/5 flex items-center gap-2"
              >
                <User size={16} />
                My Account
              </Link>

            </div>
<div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">

              <Link
                onClick={() => setMobileOpen(false)}
                to="/products?category=1"
                className="text-sm text-slate-400 hover:text-white px-4 py-2"
              >
                Laptops
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/products?category=3"
                className="text-sm text-slate-400 hover:text-white px-4 py-2"
              >
                Smartphones
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/products?category=2"
                className="text-sm text-slate-400 hover:text-white px-4 py-2"
              >
                Printers
              </Link>

              <Link
                onClick={() => setMobileOpen(false)}
                to="/products?category=4"
                className="text-sm text-slate-400 hover:text-white px-4 py-2"
              >
                Accessories
              </Link>

            </div>

            <Link
              onClick={() => setMobileOpen(false)}
              to="/products"
              className="mt-4 flex items-center justify-between rounded-xl bg-yellow-400 text-black px-4 py-3 font-black text-sm"
            >
              Explore the collection

              <ArrowRight size={17} />
            </Link>

          </div>
        )}

      </div>
    </header>
  );
}