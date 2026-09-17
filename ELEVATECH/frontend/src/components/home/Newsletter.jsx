import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(event) {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="w-full overflow-hidden bg-[#07101D] py-10 sm:py-12 md:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1628] p-5 sm:rounded-3xl sm:p-8 md:p-10 lg:rounded-[32px] lg:p-12">
          {/* SUBTLE BACKGROUND GLOW */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl sm:h-72 sm:w-72" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-yellow-400/5 blur-3xl sm:h-64 sm:w-64" />

          <div className="relative grid min-w-0 gap-7 md:gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* CONTENT */}
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-400 sm:text-xs sm:tracking-[0.22em]">
                Stay ahead
              </p>

              <h2 className="mt-2.5 max-w-2xl text-2xl font-black leading-tight tracking-tight text-white min-[375px]:text-3xl sm:mt-3 sm:text-4xl md:text-5xl">
                Technology worth knowing about.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base sm:leading-7">
                Get new arrivals, selected deals and practical
                technology recommendations — without the noise.
              </p>
            </div>

            {/* FORM / SUCCESS */}
            {submitted ? (
              <div
                role="status"
                className="flex min-w-0 items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm font-bold leading-6 text-emerald-300 sm:items-center sm:p-5 sm:text-base"
              >
                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 sm:mt-0"
                />

                <span className="min-w-0">
                  You’re on the list. Welcome to ELEVATECH.
                </span>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="flex min-w-0 flex-col gap-2.5 min-[480px]:flex-row sm:gap-3"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>

                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.07] sm:px-5 sm:py-4"
                />

                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#07101D] transition hover:bg-slate-100 active:scale-[0.99] min-[480px]:w-fit sm:px-6 sm:py-4"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={17} className="shrink-0" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
