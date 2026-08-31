"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Page() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("buyer");
  const [adminKey, setAdminKey] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const router = useRouter();

  const isStrongPassword = (pw: string) =>
    pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /\d/.test(pw);

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setMessage("");
    setEmail("");
    setPassword("");
    setUserName("");
    setConfirmPassword("");
    setGender("");
    setAdminKey("");
    setRole("buyer");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (isSignup) {
      if (!userName.trim()) {
        setError("Username is required for signup");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (!isStrongPassword(password)) {
        setError(
          "Password must be 8+ chars, with uppercase, lowercase, and number"
        );
        return;
      }
      if (!gender) {
        setError("Please select gender");
        return;
      }
      if (!role) {
        setError("Please select a role");
        return;
      }
      if (role === "admin" && !adminKey) {
        setError("Admin key is required");
        return;
      }
    }

    setMessage(
      isSignup ? "Account created successfully!" : "Logged in successfully!"
    );
    router.push("/");
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
            onClick={() => setIsSignup(true)}
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
            onClick={() => setIsSignup(false)}
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
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              required
            />
            {password && (
              <p
                className={`text-xs mt-1 ${
                  isStrongPassword(password)
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {isStrongPassword(password)
                  ? "Strong password"
                  : "Password should be 8+ chars with upper, lower, number"}
              </p>
            )}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
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
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  required
                >
                  <option value="">Select role</option>
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              {role === "admin" && (
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
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
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
            className="w-full bg-[#381932] text-white py-3 px-4 rounded-xl font-semibold hover:bg-[#4a2242] focus:ring-4 focus:ring-purple-500/20 focus:outline-none transition"
          >
            <span>{isSignup ? "Create Account" : "Sign In"}</span>
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
        </form>
      </motion.div>
    </div>
  );
}