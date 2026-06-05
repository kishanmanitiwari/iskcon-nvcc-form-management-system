"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaWpforms } from "react-icons/fa";
import { PiExam } from "react-icons/pi";
import { HiOutlineUsers } from "react-icons/hi2";
import { BsStars } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa6";
import { TbForms } from "react-icons/tb";

const LandingPage = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen relative font-sans text-[#3A2E2A] overflow-x-hidden">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpeg"
          alt="Temple Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-amber-900/10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/80 via-transparent to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-20 lg:px-8">
        
        {/* ================= HERO SECTION ================= */}
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-[#E68A2E] flex items-center justify-center shadow-lg border-4 border-white/20 backdrop-blur-sm overflow-hidden p-4">
             <Image 
                src="/image.png" 
                alt="ISKCON Logo" 
                width={100} 
                height={100} 
                className="object-contain w-full h-full"
             />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#2C211A] mb-2 tracking-tight drop-shadow-sm">
            ISKCON NVCC
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-medium text-[#D97706] mb-6 tracking-wide drop-shadow-sm">
            Form Management System
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-stone-700/90 max-w-2xl mx-auto leading-relaxed font-medium mb-10 drop-shadow-sm">
            Streamline event registration, prasadam planning, volunteer onboarding, and spiritual assessments — all in one peaceful, organized platform.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
              onClick={() => router.push('/login')}
              className="group relative flex items-center justify-center gap-2 bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-3.5 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <FaUserShield className="text-xl relative z-10" />
              <span className="relative z-10">Admin Login</span>
            </button>

            <button
              onClick={() => router.push('/forms')}
              className="group flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-[#3A2E2A] border border-stone-200 px-8 py-3.5 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm w-full sm:w-auto"
            >
              <TbForms className="text-xl text-[#D97706]" />
              View Public Forms
            </button>
          </div>
        </div>

        {/* ================= FEATURES SECTION ================= */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-center">
            
            <FeatureCard
              icon={<FaWpforms />}
              title="Form Builder"
              desc="Create custom forms with text, number, and multiple choice questions."
            />

            <FeatureCard
              icon={<PiExam />}
              title="Quiz & Assessments"
              desc="Auto-scored quizzes for spiritual education and volunteer training."
            />


            <FeatureCard
              icon={<BsStars />}
              title="AI Assistance"
              desc="Get intelligent question suggestions for your forms and quizzes."
            />

          </div>
        </div>

      </div>
    </main>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="group bg-white/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/50 shadow-lg hover:shadow-xl hover:bg-white/60 transition-all duration-300 flex flex-col items-start h-full text-left">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-orange-100/80 text-[#D97706] flex items-center justify-center text-2xl md:text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-orange-200/50">
        {icon}
      </div>

      <h3 className="font-serif font-bold text-xl text-[#2C211A] mb-2 md:tracking-tight group-hover:text-[#D97706] transition-colors">
        {title}
      </h3>

      <p className="text-sm md:text-base text-stone-700/90 leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

export default LandingPage;
