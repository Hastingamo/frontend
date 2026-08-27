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

  const [isLoading, setIsLoading] = useState(false);

  const isStrongPassword = (pw) =>
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
    setIsLoading(false);
  };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     setIsLoading(true);
//     try{
// if (!password || password.length < 6) {
//       setError("Password must be at least 6 characters");
//       setIsLoading(false);
//       return;
//     }
//     if (isSignup) {
//       if (!userName) {
//         setError("Username is required for signup");
//         setIsLoading(false);
//         return;
//       }
//       if (password !== confirmPassword) {
//         setError("Passwords do not match");
//         setIsLoading(false);
//         return;
//       }
//       if (!isStrongPassword(password)) {
//         setError(
//           "Password must be 8+ chars, with uppercase, lowercase, and number",
//         );
//         setIsLoading(false);
//         return;
//       }
//       if (!gender) {
//         setError("Please select gender");
//         setIsLoading(false);
//         return;
//       }
//       if (!role) {
//         setError("Please select a role");
//         setIsLoading(false);
//         return;
//       }
//     }
//     }catch(error){
//       setError("An error occurred. Please try again.");
//       setIsLoading(false);
//     }

    

//   };
const handleFormSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");
  setIsLoading(true);
  try {
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    if (isSignup) {
      if (!userName) {
        setError("Username is required for signup");
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }
      if (!isStrongPassword(password)) {
        setError("Password must be 8+ chars, with uppercase, lowercase, and number");
        setIsLoading(false);
        return;
      }
      if (!gender) {
        setError("Please select gender");
        setIsLoading(false);
        return;
      }
      if (!role) {
        setError("Please select a role");
        setIsLoading(false);
        return;
      }
      if (role === "admin" && !adminKey) {
        setError("Admin key is required");
        setIsLoading(false);
        return;
      }
    }
    const endpoint = isSignup ? "/auth/signup" : "/auth/login";
    const body = isSignup
      ? { userName, email, password, gender, role, adminKey: role === "admin" ? adminKey : undefined }
      : { email, password };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // needed if Nest sets httpOnly JWT cookie
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Something went wrong");
      setIsLoading(false);
      return;
    }
    setMessage(isSignup ? "Account created successfully!" : "Logged in successfully!");
    // if using bearer token instead of cookie:
    // if (data.access_token) localStorage.setItem("token", data.access_token);
    // redirect based on role, or just to dashboard
    router.push("/");
  } catch (error) {
    setError("An error occurred. Please try again.");
      setIsLoading(false);

  } finally {
    setIsLoading(false);
  }
}; 
return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3e6] to-[#381932] dark:bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        className="w-full max-w-md bg-[#fff3e6] border rounded-2xl shadow-xl p-8 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignup ? "Sign up to get started" : "Sign in to your account"}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-full">
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
              isSignup ? "bg-gradient-to-br from-[#fff3e6] to-[#381932]" : ""
            }`}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 rounded-full text-sm font-semibold transition-all ${
              !isSignup ? "bg-gradient-to-br from-[#fff3e6] to-[#381932]" : ""
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
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              className="w-full px-3 py-2 border border-gradient-to-br from-[#fff3e6] to-[#381932] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              className="w-full px-3 py-2 border border-gradient-to-br from-[#fff3e6] to-[#381932] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
            {password && (
              <p
                className={`text-xs mt-1 ${isStrongPassword(password) ? "text-green-600" : "text-orange-600"}`}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Key: ADMIN_SECRET_KEY{" "}
                  </p>
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
            {/* {isLoading ? (
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
            )} */}
                     <span>{isSignup ? "Create Account" : "Sign In"}</span>

          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium underline"
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
