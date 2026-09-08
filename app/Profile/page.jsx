"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("accessToken");
          router.push("/");
          return;
        }

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.message || "Failed to load profile");
        }

        setUser(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  const initials = user?.userName
    ? user.userName.slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3e6] to-[#381932] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        className="w-full max-w-md bg-[#fff3e6] border border-gray-200 rounded-2xl shadow-xl p-8 space-y-6"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-3">
            <svg className="animate-spin h-8 w-8 text-[#381932]" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                opacity=".25"
              />
              <path
                fill="none"
                opacity=".75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm text-gray-600">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Back to login
            </button>
         
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#381932] text-white flex items-center justify-center text-xl font-semibold">
                {initials}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.userName || "User"}
              </h1>
              {user?.role && (
                <span className="text-xs uppercase tracking-wide bg-gray-200 text-gray-700 px-3 py-1 rounded-full">
                  {user.role}
                </span>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900 font-medium">{user?.email}</span>
              </div>
              {user?.gender && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Gender</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {user.gender}
                  </span>
                </div>
              )}
            </div>
         <button
              type="button"
              onClick={() => router.push("/Profile/changePassword")}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              change your Password
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 focus:ring-4 focus:ring-black/20 focus:outline-none transition"
            >
              Log out
            </button>

          </>
        )}
      </motion.div>
    </div>
  );
}