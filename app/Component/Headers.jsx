

// "use client";
// import Link from "next/link";
// import React from "react";

// function Headers() {
//   return (
//     <div>
//       <Link href="/">
//         <h1>home page</h1>
//       </Link>
//        <Link href="/Admin"> Admin page  </Link>
//       <Link href="/Buyer"> Buyer  </Link>
//        <Link href="/SingUp"> Register Up  </Link>
      
//       <Link href="/Seller">
//          <h1>seller</h1>
        
//       </Link>
//        <Link href="/Profile"><h1>Profile</h1></Link>
//     </div>
//   );
// }

// export default Headers;



"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Headerss() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/Seller", label: "Seller Dashboard" },
    { href: "/Profile", label: "Profile" },
    { href: "/SingUp", label: "Account / Sign Up" },
  ];

  return (
    <header className="bg-[#06142E] border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo / Header Name */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white text-sm shadow-md group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-purple-300 transition-colors">
            Starlight
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Headerss;
