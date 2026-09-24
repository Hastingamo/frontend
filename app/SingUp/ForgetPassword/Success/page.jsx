"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Page() {
  const router = useRouter();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, resetToken }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        return;
      }

      setSuccess(data.message || "Password reset successfully!");
      router.push("/signup");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 border border-gray-200 rounded-xl">
      <h1 className="text-xl font-semibold mb-4">Reset Password</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password *
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label
            htmlFor="resetToken"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reset Token *
          </label>
          <input
            id="resetToken"
            type="text"
            value={resetToken}
            onChange={(e) => setResetToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600" role="status">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-xl bg-black text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Changing password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}