"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormState = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  role: "buyer",
  adminKey: "",
};

export default function Page() {
  const [form, setForm] = useState(initialFormState);
  const [isSignup, setIsSignup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isStrongPassword = (pw) =>
    pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw);

  const toggleMode = () => {
    setIsLoading(false);
    setIsSignup((prev) => !prev);
    setError("");
    setMessage("");
    setForm(initialFormState);
  };

  // Returns an error string, or null if the form is valid.
  const validate = () => {
    const {
      userName,
      email,
      password,
      confirmPassword,
      gender,
      role,
      adminKey,
    } = form;

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      return "Please enter a valid email address";
    }
    if (!password) {
      return "Password is required";
    }

    if (!isSignup) return null;

    if (!userName.trim()) return "Username is required for signup";
    if (!isStrongPassword(password)) {
      return "Password must be 8+ chars, with uppercase, lowercase, and a number";
    }
    if (password !== confirmPassword) return "Passwords do not match";
    if (!gender) return "Please select gender";
    if (!role) return "Please select a role";
    if (role === "admin" && !adminKey.trim()) return "Admin key is required";

    return null;
  };

    const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const body = isSignup
        ? {
            userName: form.userName.trim(),
            email: form.email.trim(),
            password: form.password,
            role: form.role,
            ...(form.role === "admin" ? { adminKey: form.adminKey.trim() } : {}),
          }
        : {
            email: form.email.trim(),
            password: form.password,
          };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong. Please try again.");
      }

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      if (isSignup) {
  setMessage("Account created successfully! Please log in.");
  toggleMode();
} else {
  setMessage("Logged in successfully!");
  router.push("/Profile");
}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };



  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3e6] to-[#381932] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        className="w-full max-w-md bg-[#fff3e6] border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6"
      >
        <div>

          <h1 className="text-3xl font-bold text-center text-gray-900">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignup ? "Sign up to get started" : "Sign in to your account"}
          </p>
        </div>

        <div className="flex bg-gray-200 p-1 rounded-full">
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
              isSignup
                ? "bg-[#381932] text-white shadow-md"
                : "text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => !isLoading && setIsSignup(true)}
          >
            Sign Up
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
              !isSignup
                ? "bg-[#381932] text-white shadow-md"
                : "text-gray-700 hover:text-gray-900"
            }`}
            onClick={() => !isLoading && setIsSignup(false)}
          >
            Log In
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username *
              </label>
              <input
                id="username"
                type="text"
                value={form.userName}
                onChange={(e) => updateField("userName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              required
            />
            {isSignup && form.password && (
              <p
                className={`text-xs mt-1 ${isStrongPassword(form.password) ? "text-green-600" : "text-orange-600"}`}
              >
                {isStrongPassword(form.password)
                  ? "Strong password"
                  : "Password should be 8+ chars with upper, lower, number"}
              </p>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => router.push("/SingUp/forgetPassword")}
            >
              forgot Passsword{" "}
            </button>
          </div>

          {isSignup && (
            <>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role *
                </label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  required
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {form.role === "admin" && (
                <div>
                  <label
                    htmlFor="adminKey"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Admin Key *
                  </label>
                  <input
                    id="adminKey"
                    type="password"
                    placeholder="Enter secret admin key"
                    value={form.adminKey}
                    onChange={(e) => updateField("adminKey", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    required
                  />
                </div>
              )}
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-black/20 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength="0"
                    opacity=".25"
                  />
                  <path
                    fill="none"
                    opacity=".75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignup ? "Create Account" : "Sign In"}</span>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-purple-700 hover:text-purple-900 font-medium underline"
            >
              {isSignup
                ? "Already have an account? Log in"
                : "Need an account? Sign up"}
            </button>
          </div>
          <a href="http://localhost:3001/auth/google">Sign in with Google</a>
        </form>
      </motion.div>
    </div>
  );
}
