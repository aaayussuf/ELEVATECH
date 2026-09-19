import { Link } from "react-router-dom";

import {
  Globe,
  AtSign,
  Share2,
  Play,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Truck,
  BadgeCheck,
  CreditCard,
  ChevronRight,
  Send,
} from "lucide-react";

const PHONE_DISPLAY = "+254 703683152";
const PHONE_TEL = "tel:+254703683152";
const PHONE_WA = "254703683152";
const EMAIL = "store.elevatech@gmail.com";

export default function Footer() {
  return (
    <footer className="w-full overflow-hidden border-t border-white/10 bg-[#02060D]">
      {/* TRUST STRIP */}
      <div className="border-b border-white/10 bg-[#07101D]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 px-4 py-5 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:justify-start lg:justify-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10">
              <BadgeCheck size={17} className="text-yellow-400" />
            </span>
            <span className="text-[13px] font-bold text-slate-200">100% Genuine & Sealed</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:justify-start lg:justify-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10">
              <ShieldCheck size={17} className="text-yellow-400" />
            </span>
            <span className="text-[13px] font-bold text-slate-200">Official Warranty + Receipt</span>
          </div>
          <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:justify-start lg:justify-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10">
              <Truck size={17} className="text-yellow-400" />
            </span>
            <span className="text-[13px] font-bold text-slate-200">Kenya-Wide Tracked Delivery</span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">

        {/* MAIN FOOTER */}
        <div className="grid min-w-0 grid-cols-1 gap-10 min-[640px]:grid-cols-2 lg:grid-cols-[1.35fr_0.85fr_0.85fr_1.15fr] lg:gap-8">

          {/* BRAND */}
          <div className="min-w-0 min-[640px]:col-span-2 lg:col-span-1">

            <Link to="/" className="inline-flex max-w-full" aria-label="ELEVATECH home">
              <img
                src="/elevatech-logo.svg"
                alt="ELEVATECH — Smarter Tech. Better Living."
                className="h-auto w-[190px] max-w-full object-contain object-left min-[375px]:w-[210px] sm:w-[230px] lg:w-[250px]"
              />
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400 sm:mt-5 sm:leading-7">
              Kenya&apos;s trusted shop for genuine laptops, smartphones,
              printers, gaming gear and accessories — official warranty,
              secure M-Pesa checkout and delivery to all 47 counties.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href={`https://wa.me/${PHONE_WA}?text=Hi%20ELEVATECH!`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-400 active:scale-[0.98]"
              >
                <MessageCircle size={16} /> WhatsApp Us
              </a>
              <a
                href={PHONE_TEL}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <Phone size={16} /> {PHONE_DISPLAY}
              </a>
            </div>

            <p className="mt-6 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Follow ELEVATECH
            </p>
            {/* SOCIAL */}
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <a
                href="https://facebook.com/elevatechke"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-yellow-400/40 hover:text-white"
              >
                <Globe size={17} />
              </a>

              <a
                href="https://instagram.com/elevatechke"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-yellow-400/40 hover:text-white"
              >
                <AtSign size={17} />
              </a>

              <a
                href="https://x.com/elevatechke"
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-yellow-400/40 hover:text-white"
              >
                <Share2 size={17} />
              </a>

              <a
                href="https://youtube.com/@elevatechke"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-yellow-400/40 hover:text-white"
              >
                <Play size={17} />
              </a>

              <a
                href={`mailto:${EMAIL}`}
                aria-label="Email us"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-yellow-400/40 hover:text-white"
              >
                <Send size={17} />
              </a>
            </div>

          </div>
          {/* SHOP */}
          <nav className="min-w-0" aria-label="Shop links">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Shop
            </h3>
            <span className="mt-2 block h-0.5 w-8 rounded-full bg-yellow-400" />
            <div className="mt-4 space-y-0.5">
              <Link
                to="/products"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                Shop All Products
              </Link>

              <Link
                to="/products?category=1"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                Laptops & Computers
              </Link>

              <Link
                to="/products?category=3"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                Smartphones & Tablets
              </Link>

              <Link
                to="/products?category=2"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                Printers & Office
              </Link>

              <Link
                to="/products?category=4"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                Accessories & Gaming
              </Link>
            </div>

          </nav>

          {/* COMPANY */}
          <nav className="min-w-0" aria-label="Company links">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Company
            </h3>
            <span className="mt-2 block h-0.5 w-8 rounded-full bg-yellow-400" />
            <div className="mt-4 space-y-0.5">
              <Link
                to="/about"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                About ELEVATECH
              </Link>

              <Link
                to="/contact"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                Contact Us
              </Link>

              <Link
                to="/account"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                My Account
              </Link>

              <Link
                to="/account/orders"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                Track My Orders
              </Link>

              <Link
                to="/account/wishlist"
                className="group flex min-h-10 items-center gap-1 text-sm text-slate-400 transition hover:text-white"
              >
                <ChevronRight size={14} className="-ml-1 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-yellow-400" />
                My Wishlist
              </Link>
            </div>

          </nav>
          {/* GET IN TOUCH */}
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-white">
              Get in Touch
            </h3>
            <span className="mt-2 block h-0.5 w-8 rounded-full bg-yellow-400" />
            <ul className="mt-4 space-y-4">
              <li>
                <a href={PHONE_TEL} className="group flex min-w-0 gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10">
                    <Phone size={17} className="text-yellow-400" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Call / WhatsApp
                    </span>
                    <span className="block text-sm font-black text-white group-hover:text-yellow-300">
                      {PHONE_DISPLAY}
                    </span>
                    <span className="block text-xs text-slate-500">Tap to call now</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="group flex min-w-0 gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10">
                    <Mail size={17} className="text-yellow-400" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </span>
                    <span className="block break-all text-sm font-bold text-slate-200 group-hover:text-white">
                      {EMAIL}
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex min-w-0 gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10">
                  <MapPin size={17} className="text-yellow-400" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Visit us
                  </span>
                  <span className="block text-sm font-bold text-slate-200">
                    Nairobi, Kenya
                  </span>
                  <span className="block text-xs leading-5 text-slate-500">
                    Come see the product before you pay
                  </span>
                </span>
              </li>
              <li className="flex min-w-0 gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/25 bg-yellow-400/10">
                  <Clock size={17} className="text-yellow-400" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Opening hours
                  </span>
                  <span className="block text-sm font-bold text-slate-200">
                    Mon – Sat: 8:00am – 6:00pm
                  </span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* PAYMENTS BAR */}
        <div className="mt-10 flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
              <CreditCard size={20} />
            </span>
            <div>
              <p className="text-sm font-black text-white">100% secure checkout</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-400">
                M-Pesa • Visa • Mastercard • Bank Transfer
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg border border-white/15 bg-[#0B1628] px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-slate-300">M-PESA</span>
            <span className="rounded-lg border border-white/15 bg-[#0B1628] px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-slate-300">VISA</span>
            <span className="rounded-lg border border-white/15 bg-[#0B1628] px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-slate-300">MASTERCARD</span>
            <span className="rounded-lg border border-white/15 bg-[#0B1628] px-3 py-1.5 text-[10px] font-black tracking-[0.12em] text-slate-300">7-DAY RETURNS</span>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-8 flex min-w-0 flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-center text-xs leading-5 text-slate-500 sm:text-left">
            © {new Date().getFullYear()} ELEVATECH. All rights reserved. •{" "}
            <a href={PHONE_TEL} className="font-bold text-slate-400 hover:text-white">
              {PHONE_DISPLAY}
            </a>{" "}
            •{" "}
            <a href={`mailto:${EMAIL}`} className="font-bold text-slate-400 hover:text-white">
              {EMAIL}
            </a>
          </p>

          <p className="text-center text-[10px] font-black tracking-[0.18em] text-slate-600 sm:text-right sm:text-[11px]">
            SMARTER TECH. BETTER LIVING.
          </p>
        </div>

      </div>

    </footer>
  );
}