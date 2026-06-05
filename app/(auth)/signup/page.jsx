"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else {
      alert("Signup successful. Please login.");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8f2] flex items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="w-[440px] bg-white px-10 py-12 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] flex flex-col items-center"
      >
        {/* Om icon */}
        <div className="w-[60px] h-[60px] rounded-full bg-[#F5821F] flex items-center justify-center mb-[24px] overflow-hidden p-2">
          <Image 
            src="/image.png" 
            alt="Logo" 
            width={60} 
            height={60} 
            className="object-contain w-full h-full"
          />
        </div>

        {/* Title */}
        <h2 className="text-[26px] font-bold text-[#1f1f1f] mb-6">
          Sign Up
        </h2>

        {/* Email */}
        <div className="w-full">
          <label className="block text-sm text-[#333] mb-2">Email</label>
          <input
            name="email"
            type="email"
            placeholder="user@iskon.org"
            className="w-full px-4 py-3 mb-6 rounded-xl bg-[#fcf8f2] text-sm outline-none shadow-inner"
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <label className="block text-sm text-[#333] mb-2">Password</label>
          <div className="relative mb-6">
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 pr-10 rounded-xl bg-[#fcf8f2] text-sm outline-none shadow-inner"
            />
             <span className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700 transition">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
</span>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#f07c22] text-white font-semibold text-sm shadow-[0_6px_14px_rgba(240,124,34,0.35)] hover:-translate-y-[1px] transition"
        >
          Sign Up
        </button>

        {/* Login link */}
        <p className="text-center text-xs text-[#444] mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 font-medium cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
