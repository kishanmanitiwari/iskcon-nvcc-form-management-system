"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    }
  };

  
  return (
   <div className="min-h-screen bg-[#fcf8f2] flex items-center justify-center">
  <form
    onSubmit={handleLogin}
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
      Login
    </h2>

    {/* Email */}
    <div className="w-full">
      <label className="block text-sm text-[#333] mb-2">Email</label>
      <input
        name="email"
        type="email"
        placeholder="Enter your email"
        className="w-full px-4 py-3 mb-6 rounded-xl bg-[#fcf8f2] text-sm outline-none shadow-inner"
      />
    </div>

    {/* Password */}
    <div className="w-full">
      <label className="block text-sm text-[#333] mb-2">Password</label>
      <div className="relative mb-6">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="w-full px-4 py-3 pr-10 rounded-xl bg-[#fcf8f2] text-sm outline-none shadow-inner"
        />
        <span 
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700 transition"
        >
          {showPassword ? (
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
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
            </svg>
          ) : (
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
          )}
        </span>
      </div>
    </div>

    {/* Button */}
    <button
      type="submit"
      disabled={loading}
      className={`w-full py-3 rounded-xl bg-[#f07c22] text-white font-bold text-sm shadow-[0_6px_14px_rgba(240,124,34,0.35)] hover:-translate-y-px transition flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        "Login"
      )}
    </button>

  </form>
</div>


  );
}