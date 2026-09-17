import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import OtpInput from "../components/auth/OtpInput";
import {
  ArrowRight,
  MailCheck,
  Smartphone,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  RotateCw,
} from "lucide-react";

const RESEND_COOLDOWN = 60;

function maskEmail(email) {
  if (!email || !email.includes("@")) return email || "";
  const [local, domain] = email.split("@");
  const maskedLocal =
    local.length <= 2
      ? `${local[0]}${"*".repeat(Math.max(0, local.length - 1))}`
      : `${local[0]}${"*".repeat(local.length - 2)}${local.slice(-1)}`;
  return `${maskedLocal}@${domain}`;
}

function maskPhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length < 8) return "your phone";
  return `•••• ••• ${digits.slice(-4)}`;
}

const stepperSteps = [
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
];

export default function VerifyAccount() {
  const { getPendingVerification, clearPendingVerification } = useContext(AuthContext);
  const navigate = useNavigate();

  const pending = getPendingVerification() || {};

  const firstName = pending.first_name || "";
  const [email, setEmail] = useState(pending.email || "");
  const phone = pending.phone || "";
  const [needEmail, setNeedEmail] = useState(!pending.email);

  const [step, setStep] = useState("email");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [smsFailed, setSmsFailed] = useState(false);
  const [devCode, setDevCode] = useState("");

  // ------------------------------------------------------------------
  // Live countdown for the resend button.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => {
      setResendIn((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendIn > 0]);

  // ------------------------------------------------------------------
  // On mount (or when a missing email is supplied): load real status.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    authService
      .verificationStatus(email)
      .then((status) => {
        if (cancelled) return;
        if (status.verified) {
          setStep("done");
        } else if (status.email_verified) {
          enterPhoneStep();
        }
      })
      .catch(() => {
        // Email typed manually but not registered yet — keep the form open.
      });

    return () => {
      cancelled = true;
    };
  }, [email]);

  function startResendCountdown(seconds = RESEND_COOLDOWN) {
    setResendIn(seconds);
  }

  async function requestCode(channel, { silent = false } = {}) {
    setError(null);
    try {
      const result = await authService.resendVerification({ email, channel });
      if (result?.dev_code) {
        setDevCode(String(result.dev_code));
      }
      const delivered = result?.sent !== false;
      if (channel === "phone") {
        setSmsFailed(!delivered);
      }
      startResendCountdown();
      if (!silent) {
        if (channel === "email") {
          toast.success("Verification code sent to your email.");
        } else if (delivered) {
          toast.success("Verification code sent by SMS.");
        } else {
          toast.warning(
            result?.notice ||
              "SMS provider did not deliver the code. Wait a minute and press Resend."
          );
          setError(
            result?.notice ||
              "We could not deliver the SMS right now. Press Resend in a minute, or confirm the number format is 07XXXXXXXX."
          );
        }
      }
    } catch (err) {
      if (err?.retryAfter) {
        startResendCountdown(err.retryAfter);
      } else {
        setError(err?.message || "Could not send the code right now.");
      }
    }
  }

  function enterPhoneStep() {
    setStep("phone");
    setSmsFailed(false);
    setDevCode("");
    // Ensure a fresh phone code is (re)generated server-side.
    requestCode("phone", { silent: true });
  }

  async function submitEmail() {
    if (emailCode.length < 6 || loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await authService.verifyEmail({ email, code: emailCode });
      toast.success("Email verified!");
      if (result.phone_verified) {
        setStep("done");
      } else {
        enterPhoneStep();
      }
    } catch (err) {
      setError(err?.message || "Invalid or expired code.");
      setEmailCode("");
      toast.error("Could not verify that code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitPhone() {
    if (phoneCode.length < 6 || loading) return;
    setError(null);
    setLoading(true);
    try {
      await authService.verifyPhone({ email, code: phoneCode });
      toast.success("Phone verified! Your account is now active.");
      clearPendingVerification();
      setStep("done");
    } catch (err) {
      setError(err?.message || "Invalid or expired code.");
      setPhoneCode("");
      toast.error("Could not verify that code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function stepDone(key) {
    if (key === "email" && step === "phone") return true;
    if (key === "phone" && step === "done") return true;
    return false;
  }

  function stepActive(key) {
    return step === key;
  }

return (
    <div className="min-h-screen relative overflow-hidden bg-[#050B14] text-white">
      <div className="pointer-events-none absolute -top-48 -right-32 w-[640px] h-[640px] rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-260px] left-[-180px] w-[560px] h-[560px] rounded-full bg-yellow-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-10">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-white/10 bg-[#0B1526]/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-black/40"
          >
            <Link to="/" className="inline-flex items-center">
              <img src="/elevatech-logo.svg" alt="ELEVATECH" className="w-40" />
            </Link>

            {step !== "done" && (
              <div className="mt-6 flex items-center justify-center gap-2.5 flex-wrap">
                {stepperSteps.map(({ key, label }, index) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-black ${
                        stepDone(key)
                          ? "bg-yellow-400 border-yellow-400 text-[#050B14]"
                          : stepActive(key)
                            ? "border-yellow-400 text-yellow-400"
                            : "border-white/15 text-slate-500"
                      }`}
                    >
                      {stepDone(key) ? <CheckCircle2 size={15} /> : index + 1}
                    </div>
                    <span className={`text-sm font-semibold ${stepDone(key) ? "text-yellow-400" : stepActive(key) ? "text-white" : "text-slate-500"}`}>
                      {label}
                    </span>
                    {index < stepperSteps.length - 1 && (
                      <div className={`w-10 h-px ${stepDone("phone") ? "bg-yellow-400" : "bg-white/10"}`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-7">
              {error && (
                <div className="mb-5 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                  {error}
                </div>
              )}

              {/* ──────────  STEP 1 · EMAIL  ────────── */}
              {step === "email" && (needEmail ? (
                  <div>
                    <h2 className="text-2xl font-black">Verify your email</h2>
                    <p className="mt-1.5 text-sm text-slate-400">
                      We first need the email address you registered with.
                    </p>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        setNeedEmail(false);
                        setStep("email");
                        requestCode("email");
                      }}
                      className="mt-5 space-y-4"
                    >
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value.trim())}
                        className="auth-input w-full"
                        placeholder="Enter your email address"
                      />
                      <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3 font-black text-[#050B14] hover:bg-yellow-300 transition"
                      >
                        Continue <ArrowRight size={18} />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-black">Check your inbox</h2>
                    <p className="mt-1.5 text-sm text-slate-400">
                      We sent a 6-digit code to
                      <span className="text-slate-200 font-semibold"> {maskEmail(email)}</span>
                    </p>

                    <div className="mt-6 flex justify-center">
                      <OtpInput
                        value={emailCode}
                        onChange={setEmailCode}
                        invalid={Boolean(error)}
                        autoFocus
                      />
                    </div>

                    <button
                      type="button"
                      disabled={emailCode.length < 6 || loading}
                      onClick={submitEmail}
                      className="mt-7 w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-black text-[#050B14] hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5 text-[#050B14]" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify email <MailCheck size={18} />
                        </>
                      )}
                    </button>
<div className="mt-5 text-center text-sm text-slate-400">
                      Didn't get it?{" "}
                      {resendIn > 0 ? (
                        <span className="font-semibold text-yellow-400">
                          Resend in {resendIn}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => requestCode("email")}
                          className="inline-flex items-center gap-1.5 font-bold text-yellow-400 hover:text-yellow-300"
                        >
                          <RotateCw size={15} />
                          Resend code
                        </button>
                      )}
                    </div>

                    <p className="mt-2 text-center text-[11px] text-slate-500">
                      Wrong email?{" "}
                      <button
                        type="button"
                        onClick={() => setNeedEmail(true)}
                        className="text-slate-300 underline hover:text-white"
                      >
                        Change it
                      </button>
                    </p>
                  </div>
                )
              )}

              {/* ──────────  STEP 2 · PHONE  ────────── */}
              {step === "phone" && (
                <div>
                  <h2 className="text-2xl font-black">Verify your phone</h2>
                  <p className="mt-1.5 text-sm text-slate-400">
                    We sent a 6-digit code by SMS to
                    <span className="text-slate-200 font-semibold"> {maskPhone(phone)}</span>
                  </p>

                  {smsFailed && (
                    <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-200">
                      <p className="font-bold">SMS not delivered yet.</p>
                      <p className="mt-1 text-amber-200/90">
                        This usually means no live SMS provider is configured, or
                        the number is unreachable. Check that you entered a valid
                        Kenyan number like <span className="font-semibold">0712 345 678</span>,
                        wait for the timer, then press Resend.
                      </p>
                      {devCode && (
                        <p className="mt-2 text-[13px]">
                          Local dev code:{" "}
                          <span className="font-black tracking-widest text-yellow-300">
                            {devCode}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-6 flex justify-center">
                    <OtpInput
                      value={phoneCode}
                      onChange={setPhoneCode}
                      invalid={Boolean(error)}
                      autoFocus
                    />
                  </div>

                  <button
                    type="button"
                    disabled={phoneCode.length < 6 || loading}
                    onClick={submitPhone}
                    className="mt-7 w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-black text-[#050B14] hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 text-[#050B14]" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify phone <Smartphone size={18} />
                      </>
                    )}
                  </button>

                  <div className="mt-5 text-center text-sm text-slate-400">
                    Didn't receive the SMS?{" "}
                    {resendIn > 0 ? (
                      <span className="font-semibold text-yellow-400">
                        Resend in {resendIn}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => requestCode("phone")}
                        className="inline-flex items-center gap-1.5 font-bold text-yellow-400 hover:text-yellow-300"
                      >
                        <RotateCw size={15} />
                        Resend code
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-center text-[11px] text-slate-500">
                    Wrong number? Contact{" "}
                    <a href="mailto:store.elevatech@gmail.com" className="text-slate-300 underline hover:text-white">
                      support
                    </a>
                  </p>
                </div>
              )}
{/* ──────────  STEP 3 · DONE  ────────── */}
              {step === "done" && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    className="mx-auto mt-2 w-24 h-24 rounded-full border-2 border-yellow-400 bg-yellow-400/15 flex items-center justify-center"
                  >
                    <BadgeCheck size={44} className="text-yellow-400" />
                  </motion.div>

                  <h2 className="mt-6 text-3xl font-black text-white">
                    {firstName ? `${firstName}, you're all set!` : "You're all set!"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Your email and phone number are verified. Your ELEVATECH
                    account is now active — sign in to start shopping.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mt-7 w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-black text-[#050B14] hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/10"
                  >
                    Sign in to my account <ArrowRight size={18} />
                  </button>

                  <Link to="/" className="mt-4 w-full flex justify-center items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] py-3 font-bold text-white hover:bg-white/[0.08] transition">
                    Continue browsing the store
                  </Link>
                </div>
              )}

              {/* ──────────  Footer  ────────── */}
              {step !== "done" && (
                <div className="mt-7 flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                  <ShieldCheck size={13} className="text-yellow-400" />
                  Your codes expire in 10 minutes &amp; are never shared
                </div>
              )}

              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowRight className="rotate-180" size={16} />
                Back to sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
