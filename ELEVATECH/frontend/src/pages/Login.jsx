import { useContext, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/account/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  
  const [apiError, setApiError] = useState(null);

  async function onSubmit(data) {
    setApiError(null);
    try {
      const response = await authService.login(data);
      const token = response?.token;
      if (!token) throw new Error("No token returned");
      login(token);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || "Login failed. Please try again.");
      toast.error("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Pane - Image/Gradient (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 justify-center items-center p-12 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <h1 className="text-5xl font-extrabold mb-6">Welcome Back to Elevatech.</h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Log in to access your dashboard, track your orders, and explore the latest in digital tech. We're thrilled to see you again!
          </p>
          <div className="flex items-center gap-4 text-blue-200">
            <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
            <span className="text-sm font-semibold tracking-wider uppercase">Secure Login</span>
          </div>
        </motion.div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition duration-200`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition duration-200`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition duration-150">
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
