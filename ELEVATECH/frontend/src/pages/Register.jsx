import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../services/authService";
import { useForm, useWatch } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Loader2, UserPlus } from "lucide-react";
import { toast } from "react-toastify";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  
  const [apiError, setApiError] = useState(null);

  // Watch password field to validate confirm password
  const password = useWatch({ control, name: "password" });

  async function onSubmit(data) {
    setApiError(null);
    try {
      // 1. Register the user
      await authService.register({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: data.password
      });

      toast.success("Account created successfully!");

      // 2. Automatically log them in
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password
      });

      const token = loginResponse?.token;
      if (token) {
        login(token);
        navigate("/account/dashboard", { replace: true });
      } else {
        navigate("/login");
      }

    } catch (err) {
      setApiError(err?.response?.data?.message || err?.message || "Registration failed. Please try again.");
      toast.error("Registration failed.");
    }
  }

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right Pane - Image/Gradient (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-bl from-indigo-900 to-purple-800 justify-center items-center p-12 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <h1 className="text-5xl font-extrabold mb-6">Join Elevatech.</h1>
          <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
            Create an account to track your orders, save your favorite products, and experience a seamless checkout process.
          </p>
          <div className="flex items-center gap-4 text-indigo-200">
            <div className="w-12 h-1 bg-purple-400 rounded-full"></div>
            <span className="text-sm font-semibold tracking-wider uppercase">Fast & Secure</span>
          </div>
        </motion.div>
      </div>

      {/* Left Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 py-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Sign up to get started.</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("first_name", { required: "Required" })}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.first_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition duration-200`}
                    placeholder="John"
                  />
                </div>
                {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("last_name", { required: "Required" })}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.last_name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition duration-200`}
                    placeholder="Doe"
                  />
                </div>
                {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Email */}
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
                  className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition duration-200`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register("phone")}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 6, message: "Min 6 chars" }
                    })}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition duration-200`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    {...register("confirmPassword", { 
                      required: "Please confirm password",
                      validate: value => value === password || "Passwords do not match"
                    })}
                    className={`block w-full pl-10 pr-3 py-2.5 border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg shadow-sm focus:outline-none focus:ring-2 sm:text-sm transition duration-200`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <UserPlus className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition duration-150">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}