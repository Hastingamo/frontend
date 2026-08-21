"use client";
import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="text-center space-y-6 max-w-md w-full p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200 dark:border-slate-700 shadow-xl">
        <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Experience dark mode and light mode seamlessly across the app.
        </p>
        <Link
          href="/SingUp"
          className="inline-block w-full py-3 px-6 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
        >
          Go to Sign Up
        </Link>
      </div>
    </main>
  );
}
