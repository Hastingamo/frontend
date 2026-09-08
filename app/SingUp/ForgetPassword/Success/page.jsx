'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[#fff3e6] to-[#381932] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/20 text-center"
      >
        {/* Success Checkmark Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
          className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>

        <h1 className="text-3xl font-extrabold text-[#381932] mb-3 tracking-tight">
          Check Your Email
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
          We&apos;ve sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
        </p>

        <div className="bg-[#fff3e6]/60 border border-[#381932]/10 rounded-2xl p-4 mb-8 text-xs text-gray-600 flex items-center gap-3">
          <svg
            className="w-5 h-5 text-[#381932] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <p className="text-left">
            Didn&apos;t receive the email? Check your spam folder or try submitting your request again.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/SingUp"
            className="w-full py-3.5 px-4 bg-[#381932] hover:bg-[#2a1326] text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Sign In</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#381932] font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Go to Home Page</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
