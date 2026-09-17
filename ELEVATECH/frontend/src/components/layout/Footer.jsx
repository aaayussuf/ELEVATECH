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
    <footer className="w-full overflow-hidden border-t border-white/10 bg-[#02060D]">

      <div className="mx-auto w-full max-w-7xl px-3 py-10 sm:px-5 sm:py-12 md:px-6 md:py-14 lg:px-8 lg:py-16">

        {/* MAIN FOOTER */}
        <div className="grid min-w-0 grid-cols-1 gap-9 min-[640px]:grid-cols-2 md:gap-10 lg:grid-cols-5 lg:gap-8">

          {/* BRAND */}
          <div className="min-w-0 min-[640px]:col-span-2 lg:col-span-2">

            <Link to="/" className="inline-flex max-w-full" aria-label="ELEVATECH home">
              <img
                src="/elevatech-logo.svg"
                alt="ELEVATECH — Smarter Tech. Better Living."
                className="h-auto w-[190px] max-w-full object-contain object-left min-[375px]:w-[210px] sm:w-[230px] lg:w-[250px]"
              />
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400 sm:mt-5 sm:leading-7">

              Premium technology for modern life.
              Discover carefully selected laptops,
              smartphones, printers, gaming gear and
              accessories from trusted brands.

            </p>

            {/* SOCIAL */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white active:scale-[0.97]"
              >
                <Globe size={17} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white active:scale-[0.97]"
              >
                <AtSign size={17} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white active:scale-[0.97]"
              >
                <Send size={17} />
              </a>
            </div>

          </div>
          {/* SHOP */}
          <div className="min-w-0">

            <h3 className="text-sm font-black text-white">
              Shop
            </h3>

            <div className="mt-4 space-y-1 sm:mt-5 sm:space-y-2">
              <Link
                to="/products"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                Shop All
              </Link>

              <Link
                to="/products?category=1"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                Laptops
              </Link>

              <Link
                to="/products?category=3"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                Smartphones
              </Link>

              <Link
                to="/products?category=2"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                Printers
              </Link>

              <Link
                to="/products?category=4"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                Accessories
              </Link>
            </div>

          </div>

          {/* COMPANY */}
          <div className="min-w-0">

            <h3 className="text-sm font-black text-white">
              Company
            </h3>

            <div className="mt-4 space-y-1 sm:mt-5 sm:space-y-2">
              <Link
                to="/about"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                About ELEVATECH
              </Link>

              <Link
                to="/contact"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                Contact
              </Link>

              <Link
                to="/account"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                My Account
              </Link>

              <Link
                to="/account/orders"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                My Orders
              </Link>

              <Link
                to="/account/wishlist"
                className="flex min-h-10 items-center text-sm text-slate-400 transition hover:text-white"
              >
                Wishlist
              </Link>
            </div>

          </div>
          {/* CONTACT */}
          <div className="min-w-0">

            <h3 className="text-sm font-black text-white">
              Contact
            </h3>

            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              <div className="flex min-w-0 gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-yellow-400"
                />

                <p className="min-w-0 text-sm leading-6 text-slate-400">
                  Nairobi, Kenya
                </p>
              </div>

              <div className="flex min-w-0 gap-3">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-yellow-400"
                />

                <p className="min-w-0 text-sm leading-6 text-slate-400">
                  +254 700 000 000
                </p>
              </div>

              <div className="flex min-w-0 gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-yellow-400"
                />

                <p className="min-w-0 break-all text-sm leading-6 text-slate-400">
                  store.elevatech@gmail.com
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="mt-9 flex min-w-0 flex-col gap-3 border-t border-white/10 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-7">
          <p className="text-center text-[11px] leading-5 text-slate-500 sm:text-left sm:text-xs">
            © {new Date().getFullYear()} ELEVATECH. All rights reserved.
          </p>

          <p className="text-center text-[10px] font-semibold tracking-[0.14em] text-slate-600 sm:text-right sm:text-xs sm:tracking-[0.18em]">
            SMARTER TECH. BETTER LIVING.
          </p>
        </div>

      </div>

    </footer>
  );
}