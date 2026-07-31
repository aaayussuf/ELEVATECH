import { Link, NavLink } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#07101D]/95 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto">

        <div className="h-20 flex items-center justify-between px-6">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center text-black font-black text-lg">
              EV
            </div>

            <div>

              <h1 className="font-black text-2xl tracking-wide">
                <span className="text-white">ELEVA</span>
                <span className="text-yellow-400">TECH</span>
              </h1>

            </div>

          </Link>

          {/* Navigation */}

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-white border-b-2 border-yellow-400 pb-1"
                  : "text-gray-300 hover:text-yellow-400 transition"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              Shop
            </NavLink>

            <button className="flex items-center gap-1 text-gray-300 hover:text-yellow-400 transition">

              Categories

              <ChevronDown size={16} />

            </button>

            <NavLink
              to="/deals"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              Deals
            </NavLink>

            <NavLink
              to="/about"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className="text-gray-300 hover:text-yellow-400 transition"
            >
              Contact
            </NavLink>

          </nav>

          {/* Search */}

          <div className="hidden xl:flex items-center w-80 bg-[#131F35] border border-slate-700 rounded-full px-4 py-2">

            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              placeholder="Search products..."
              className="bg-transparent flex-1 ml-3 outline-none text-sm placeholder:text-gray-500"
            />

          </div>

          {/* Icons */}

          <div className="flex items-center gap-5">

            <button className="hover:text-yellow-400 transition">
              <Heart size={22} />
            </button>

            <button className="hover:text-yellow-400 transition">
              <User size={22} />
            </button>

            <button className="relative hover:text-yellow-400 transition">

              <ShoppingCart size={23} />

              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">

                0

              </span>

            </button>

          </div>

        </div>

      </div>
    </header>
  );
}