import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import OtpInput from "../components/auth/OtpInput";
import {
  ArrowRight,
  Mail,
  Lock,
  Loader2,
  KeyRound,
  BadgeCheck,
  RotateCw,
  Eye,
  EyeOff,
} from "lucide-react";

const RESEND_COOLDOWN = 60;

export default function ForgotPassword() {
  const [step, setStep] = useState("request"); // request | code | done
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setInterval(() => {
      setResendIn((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendIn > 0]);

  async function requestCode() {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.info("If an account exists, a reset code was sent to your email.");
      setResendIn(RESEND_COOLDOWN);
      setStep("code");
    } catch (err) {
      setError(err?.message || "Could not send a reset code.");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setError(null);
    try {
      await authService.forgotPassword(email);
      setResendIn(RESEND_COOLDOWN);
      toast.info("A new reset code was sent to your email.");
    } catch (err) {
      setError(err?.message || "Could not send a new code.");
    }
  }

  async function submitReset() {
    if (code.length < 6 || loading) return;
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await authService.resetPassword({ email, code, password });
      toast.success("Password updated. You can now sign in!");
      setStep("done");
    } catch (err) {
      setError(err?.message || "Invalid or expired code.");
      setCode("");
      toast.error("Could not reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

return (
    <div className="min-h-screen relative overflow-hidden bg-[#050B14] text-white">
      <div className="pointer-events-none absolute -top-40 -right-32 w-[620px] h-[620px] rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-240px] left-[-180px] w-[540px] h-[540px] rounded-full bg-yellow-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />

      <div className="relative flex items-center justify-center min-h-screen px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1526]/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-black/40"
        >
          <Link to="/" className="inline-flex items-center">
            <img src="/elevatech-logo.svg" alt="ELEVATECH" className="w-40" />
          </Link>

          <div className="mt-6">
            {error && (
              <div className="mb-5 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* ── Request step ── */}
            {step === "request" && (
              <div>
                <div className="mt-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full border border-yellow-400/30 bg-yellow-400/10 flex items-center justify-center">
                    <KeyRound size={28} className="text-yellow-400" />
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-white">Forgot your password?</h2>
                  <p className="mt-1.5 text-sm leading-6 text-slate-400">
                    Enter the email on your account and we'll send you a
                    secure reset code.
                  </p>
                </div>

                <div className="relative mt-6">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value.trim())}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") requestCode();
                    }}
                    className={`auth-input w-full pl-11 pr-3 py-3 ${!email ? "auth-input--error" : ""}`}
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="button"
                  disabled={!email || loading}
                  onClick={requestCode}
                  className="mt-5 w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-black text-[#050B14] hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 text-[#050B14]" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset code <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            )}

{/* ── Code + new password step ── */}
            {step === "code" && (
              <div>
                <div className="mt-6 text-center">
                  <h2 className="text-2xl font-black text-white">Reset your password</h2>
                  <p className="mt-1.5 text-sm text-slate-400">
                    Enter the 6-digit code sent to{" "}
                    <span className="font-semibold text-slate-200">{email}</span>,
                    then choose a new password.
                  </p>
                </div>

                <div className="mt-6 flex justify-center">
                  <OtpInput value={code} onChange={setCode} invalid={Boolean(error)} autoFocus />
                </div>

                <div className="relative mt-6">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="auth-input w-full pl-11 pr-11 py-3"
                    placeholder="New password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") submitReset();
                  }}
                  className="auth-input w-full mt-3 py-3"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  disabled={code.length < 6 || !password || !confirm || loading}
                  onClick={submitReset}
                  className="mt-5 w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-black text-[#050B14] hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/10 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 text-[#050B14]" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset password <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="mt-5 text-center text-sm text-slate-400">
                  Code not received?{" "}
                  {resendIn > 0 ? (
                    <span className="font-semibold text-yellow-400">
                      Resend in {resendIn}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={resend}
                      className="inline-flex items-center gap-1.5 font-bold text-yellow-400 hover:text-yellow-300"
                    >
                      <RotateCw size={15} />
                      Resend code
                    </button>
                  )}
                </div>
              </div>
            )}
{/* ── Done step ── */}
            {step === "done" && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  className="mx-auto mt-4 w-24 h-24 rounded-full border-2 border-yellow-400 bg-yellow-400/15 flex items-center justify-center"
                >
                  <BadgeCheck size={44} className="text-yellow-400" />
                </motion.div>

                <h2 className="mt-6 text-3xl font-black text-white">Password updated</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Your password was reset successfully. You can now sign in
                  with your new password.
                </p>

                <Link
                  to="/login"
                  className="mt-7 w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-black text-[#050B14] hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/10"
                >
                  Sign in <ArrowRight size={18} />
                </Link>
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
  );
}
