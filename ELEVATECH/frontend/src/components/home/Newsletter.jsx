import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Newsletter() {

  const [email, setEmail] =
    useState("");

  const [submitted, setSubmitted] =
    useState(false);

  function submit(event) {

    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setSubmitted(true);
    setEmail("");

  }

  return (
    <section className="bg-[#07101D] py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="rounded-[32px] border border-white/10 bg-[#0B1628] p-7 sm:p-10 lg:p-12">

          <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:items-center">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-400">
                Stay ahead
              </p>

              <h2 className="mt-3 text-3xl sm:text-4xl font-black">
                Technology worth knowing about.
              </h2>

              <p className="mt-3 text-slate-400 leading-7 max-w-xl">
                Get new arrivals, selected deals and practical technology recommendations — without the noise.
              </p>

            </div>

            {submitted ? (

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 flex items-center gap-3 text-emerald-300 font-bold">

                <CheckCircle2 size={21} />

                You’re on the list. Welcome to ELEVATECH.

              </div>

            ) : (

              <form
                onSubmit={submit}
                className="flex flex-col sm:flex-row gap-3"
              >

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Your email address"
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 outline-none text-white placeholder:text-slate-500 focus:border-blue-400/60"
                />

                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-black text-[#07101D] hover:bg-slate-100 transition">
                  Subscribe
                  <ArrowRight size={17} />
                </button>

              </form>

            )}

          </div>

        </div>

      </div>

    </section>
  );
}