import { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  Truck,
  Sparkles,
  PackageCheck,
  Timer,
} from "lucide-react";

const valueProps = [
  {
    icon: ShieldCheck,
    title: "Secure account",
    text: "Email & phone verification keeps your account safe.",
  },
  {
    icon: Truck,
    title: "Kenya-wide delivery",
    text: "Fast, professional dispatch from checkout to your door.",
  },
  {
    icon: PackageCheck,
    title: "Order tracking",
    text: "Live order updates from the moment you check out.",
  },
  {
    icon: Sparkles,
    title: "Exclusive deals",
    text: "Member-only pricing on premium laptops, phones & gear.",
  },
];

export default function Login() {
  const { login, refreshUser, setUser, savePendingVerification } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/account/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [unverified, setUnverified] = useState(null);

  async function onSubmit(data) {
    setApiError(null);
    setUnverified(null);
    try {
      const response = await authService.login(data);
      const token = response?.token;
      if (!token) throw new Error("No token returned");
      login(token, data.remember);
      toast.success("Welcome back to ELEVATECH!");
      // Fetch the profile right away so AdminRoute sees the real role
      // instead of redirecting an admin to "/" on first login.
      let me = null;
      try {
        me = await authService.me(token);
        if (setUser) setUser(me);
        else if (refreshUser) me = await refreshUser();
      } catch {
        if (refreshUser) {
          try {
            me = await refreshUser();
          } catch {
            me = null;
          }
        }
      }
      const role = me?.role || response?.role;
      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from === "/admin" ? "/account/dashboard" : from, {
          replace: true,
        });
      }
    } catch (err) {
      setApiError(err?.message || "Login failed. Please try again.");

      if (
        err?.code === "email_not_verified" ||
        err?.code === "phone_not_verified"
      ) {
        setUnverified({ code: err.code, email: err.email });
        savePendingVerification({ email: err.email, source: "login" });
        toast.info("Please finish verifying your account to sign in.");
      } else {
        toast.error(
          err?.message || "Login failed. Please check your credentials."
        );
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050B14] text-white">
      <div className="pointer-events-none absolute -top-40 -right-32 w-[640px] h-[640px] rounded-full bg-blue-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-260px] left-[-180px] w-[560px] h-[560px] rounded-full bg-yellow-400/10 blur-[140px]" />
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
              <Timer size={14} />
              Welcome back
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-[-0.03em]">
              Smarter tech.
              <br />
              <span className="text-yellow-400">Better living.</span>
            </h1>

            <p className="mt-6 text-base leading-7 text-slate-300">
              Sign in to track your orders, manage your wishlist and unlock
              member-only deals on premium laptops, phones and accessories —
              carefully selected for the way you live and work.
            </p>

            <div className="mt-8 space-y-3">
              {valueProps.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="rounded-lg border border-blue-400/20 bg-blue-500/10 p-2">
                    <Icon size={17} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{title}</p>
                    <p className="text-xs leading-5 text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck size={14} className="text-yellow-400 shrink-0" />
            Secured with encrypted login & account verification
          </div>
        </motion.div>
{/* ─── Right · Sign-in form ─── */}
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
              <h2 className="text-3xl font-black text-white">Sign in</h2>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back — enter your details to continue.
              </p>
            </div>

            {apiError && (
              <div className="mt-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
                {apiError}
              </div>
            )}

            {unverified && (
              <div className="mt-4 p-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-sm">
                <p className="font-bold text-yellow-200">Verification needed</p>
                <p className="mt-0.5 text-[13px] text-yellow-100/90">
                  Finish verifying your email &amp; phone to unlock your account.
                </p>
                <Link
                  to="/verify"
                  className="mt-2 inline-flex items-center gap-1.5 font-bold text-yellow-400 hover:text-yellow-300"
                >
                  Verify my account <ArrowRight size={15} />
                </Link>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1.5">
                  Email address
                </label>
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
                    className={`auth-input w-full pl-11 pr-3 py-3 ${errors.email ? "auth-input--error" : ""}`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold text-slate-300">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-yellow-400 hover:text-yellow-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className={`auth-input w-full pl-11 pr-11 py-3 ${errors.password ? "auth-input--error" : ""}`}
                    placeholder="••••••••"
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
              </div>
<label className="flex items-center gap-2.5 text-sm text-slate-300 select-none">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-yellow-400"
                />
                Keep me signed in on this device
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-yellow-400 py-3.5 font-black text-[#050B14] hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 text-[#050B14]" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center gap-3 text-[11px] uppercase tracking-widest text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              New to ELEVATECH?
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <Link
              to="/register"
              className="mt-4 w-full flex justify-center items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] py-3 font-bold text-white hover:bg-white/[0.08] transition"
            >
              Create an account
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
