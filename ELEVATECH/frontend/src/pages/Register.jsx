import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { useForm, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  UserPlus,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";

const JOIN_PERKS = [
  { icon: Truck, text: "Track every order, right from checkout" },
  { icon: Sparkles, text: "Unlock member-only deals & early drops" },
  { icon: ShieldCheck, text: "Verified, secure account in 2 minutes" },
];

const inputClass = (hasError) =>
  `auth-input w-full pl-11 pr-3 py-3 ${hasError ? "auth-input--error" : ""}`;

function passwordScore(password) {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

const PASSWORD_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const PASSWORD_COLORS = [
  "bg-red-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-yellow-400",
  "bg-green-500",
];

export default function Register() {
  const { savePendingVerification } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = useWatch({ control, name: "password" }) || "";
  const strength = passwordScore(password);

  async function onSubmit(data) {
    setApiError(null);
    try {
      await authService.register({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      savePendingVerification({
        first_name: data.first_name,
        email: data.email,
        phone: data.phone,
      });

      toast.success("Account created — let's verify it!");
      navigate("/verify");
    } catch (err) {
      setApiError(
        err?.message || "Registration failed. Please try again."
      );
      toast.error(err?.message || "Registration failed.");
    }
  }

return (
    <div className="min-h-screen relative overflow-hidden bg-[#050B14] text-white">
      <div className="pointer-events-none absolute -top-48 -left-32 w-[620px] h-[620px] rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-260px] right-[-180px] w-[560px] h-[560px] rounded-full bg-yellow-400/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] [background-size:24px_24px]" />

      <div className="relative grid lg:grid-cols-2 min-h-screen">

        {/* ─── Left · Brand panel ─── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex flex-col justify-between px-14 py-12 bg-white/[0.03] border-r border-white/10"
        >
          <Link to="/" className="inline-flex items-center">
            <img src="/elevatech-logo.svg" alt="ELEVATECH" className="w-48 h-auto" />
          </Link>

          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-4 py-1.5 text-[11px] font-black tracking-[0.14em] text-yellow-400 uppercase">
              <Zap size={14} />
              Create your account
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-[-0.03em]">
              Join the future
              <br />
              of <span className="text-yellow-400">tech shopping.</span>
            </h1>

            <p className="mt-6 text-base leading-7 text-slate-300">
              Create a verified account to unlock member pricing, track orders
              in real time and enjoy a faster, more personal checkout.
            </p>

            <div className="mt-8 space-y-3.5">
              {JOIN_PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-2">
                    <Icon size={16} className="text-yellow-400" />
                  </div>
                  <p className="text-sm text-slate-200">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-yellow-400 shrink-0" />
            Email & phone verification keep your account protected
          </div>
        </motion.div>

        {/* ─── Right · Registration form ─── */}
        <div className="flex items-center justify-center px-4 py-10 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0B1526]/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-black/40"
          >
            <div className="lg:hidden flex justify-center mb-6">
              <img src="/elevatech-logo.svg" alt="ELEVATECH" className="w-44" />
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-black text-white">Create account</h2>
              <p className="mt-1 text-sm text-slate-400">
                Takes about a minute — then we verify your email &amp; phone.
              </p>
            </div>

            {apiError && (
              <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4.5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">First name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User size={17} />
                    </div>
                    <input
                      type="text"
                      autoComplete="given-name"
                      {...register("first_name", { required: "First name is required" })}
                      className={inputClass(errors.first_name)}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.first_name && (
                    <p className="mt-1 text-xs text-red-400">{errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Last name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User size={17} />
                    </div>
                    <input
                      type="text"
                      autoComplete="family-name"
                      {...register("last_name", { required: "Last name is required" })}
                      className={inputClass(errors.last_name)}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.last_name && (
                    <p className="mt-1 text-xs text-red-400">{errors.last_name.message}</p>
                  )}
                </div>
              </div>
<div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                    className={inputClass(errors.email)}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Phone number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^(?:\+?254|0)?7\d{8}$/,
                        message: "Enter a valid Kenyan phone number",
                      },
                    })}
                    className={inputClass(errors.phone)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  We'll send your verification code by SMS.
                </p>
                {errors.phone && (
                  <p className="mt-0.5 text-xs text-red-400">{errors.phone.message}</p>
                )}
              </div>
<div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "At least 6 characters required",
                      },
                    })}
                    className={`auth-input w-full pl-11 pr-11 py-3 ${errors.password ? "auth-input--error" : ""}`}
                    placeholder="Create a strong password"
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
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}

                {password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1.5 h-1.5">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <span
                          key={step}
                          className={`flex-1 rounded-full transition ${step <= strength ? PASSWORD_COLORS[strength] : "bg-white/10"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      {PASSWORD_LABELS[strength]} password
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">Confirm password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={`auth-input w-full pl-11 pr-11 py-3 ${errors.confirmPassword ? "auth-input--error" : ""}`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((value) => !value)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>
<label className="flex items-start gap-2.5 text-[13px] text-slate-300 select-none">
                <input
                  type="checkbox"
                  {...register("terms", { required: "Please accept the terms to continue" })}
                  className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 accent-yellow-400"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-yellow-400">Terms of Service</span> and{" "}
                  <span className="text-yellow-400">Privacy Policy</span>
                </span>
              </label>
              {errors.terms && (
                <p className="text-xs text-red-400">{errors.terms.message}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-black text-[#050B14] hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-[#050B14]" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <UserPlus size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              Already a member?
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              to="/login"
              className="mt-4 w-full flex justify-center items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] py-3 font-bold text-white hover:bg-white/[0.08] transition"
            >
              Sign in instead
            </Link>

            <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition">
              <ArrowRight className="rotate-180" size={16} />
              Back to store
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
