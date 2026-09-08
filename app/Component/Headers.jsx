"use client";
import React from "react";
import Link from "next/link";

function Headerss() {
  return (
    <div className="text-white flex gap-10 flex-row p-4 bg-[#06142E]">
      <Link href="/">
        <h1>home page</h1>
      </Link>
      <Link href="/Admin">
        Admin page
      </Link>
      <Link href="/Buyer">
        Buyer
      </Link>
      <Link href="/SingUp">
        Register Up
      </Link>
      <Link href="/seller">
        <h1>seller</h1>
      </Link>
      <Link href="/Profile">
        Profile
      </Link>
    </div>
  );
}

export default Headerss;
