import { Link } from "react-router-dom";

import {
  Globe,
  AtSign,
  Send,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#02060D] border-t border-white/10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* BRAND */}
          <div className="lg:col-span-2">

            <Link to="/">
              <img
                src="/elevatech-logo.svg"
                alt="ELEVATECH"
                className="w-[210px]"
              />
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">

              Premium technology for modern life.
              Discover carefully selected laptops,
              smartphones, printers, gaming gear and
              accessories from trusted brands.

            </p>

            <div className="mt-6 flex items-center gap-3">

              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <Globe size={17} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <AtSign size={17} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition"
              >
                <Send size={17} />
              </a>

            </div>

          </div>
{/* SHOP */}
          <div>

            <h3 className="text-sm font-black text-white">
              Shop
            </h3>

            <div className="mt-5 space-y-3">

              <Link
                to="/products"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                Shop All
              </Link>

              <Link
                to="/products?category=1"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                Laptops
              </Link>

              <Link
                to="/products?category=3"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                Smartphones
              </Link>

              <Link
                to="/products?category=2"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                Printers
              </Link>

              <Link
                to="/products?category=4"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                Accessories
              </Link>

            </div>

          </div>

          {/* COMPANY */}
          <div>

            <h3 className="text-sm font-black text-white">
              Company
            </h3>

            <div className="mt-5 space-y-3">

              <Link
                to="/about"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                About ELEVATECH
              </Link>

              <Link
                to="/contact"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                Contact
              </Link>

              <Link
                to="/account"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                My Account
              </Link>

              <Link
                to="/account/orders"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                My Orders
              </Link>

              <Link
                to="/account/wishlist"
                className="block text-sm text-slate-400 hover:text-white transition"
              >
                Wishlist
              </Link>

            </div>

          </div>
{/* CONTACT */}
          <div>

            <h3 className="text-sm font-black text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex gap-3">

                <MapPin
                  size={17}
                  className="text-yellow-400 shrink-0 mt-0.5"
                />

                <p className="text-sm leading-6 text-slate-400">
                  Nairobi, Kenya
                </p>

              </div>

              <div className="flex gap-3">

                <Phone
                  size={17}
                  className="text-yellow-400 shrink-0 mt-0.5"
                />

                <p className="text-sm leading-6 text-slate-400">
                  +254 700 000 000
                </p>

              </div>

              <div className="flex gap-3">

                <Mail
                  size={17}
                  className="text-yellow-400 shrink-0 mt-0.5"
                />

                <p className="text-sm leading-6 text-slate-400 break-all">
                  store.elevatech@gmail.com
                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="mt-14 pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ELEVATECH. All rights reserved.
          </p>

          <p className="text-xs text-slate-600">
            SMARTER TECH. BETTER LIVING.
          </p>

        </div>

      </div>

    </footer>
  );
}