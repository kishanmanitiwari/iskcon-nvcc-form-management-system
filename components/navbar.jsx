"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'All Forms', href: '/admin/allforms' },
    { name: 'Create Form', href: '/forms/new' },
  ];

  const isActive = (path) => pathname === path;

  return (
    <nav className="w-full bg-[#FFF7EF] border-b border-[#F2E6D8] relative z-50">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#f19d54] flex items-center justify-center text-white font-bold overflow-hidden p-1">
            <Image 
              src="/image.png" 
              alt="Logo" 
              width={36} 
              height={36} 
              className="object-contain w-full h-full"
            />
          </div>
          <span className="font-semibold text-lg text-[#4A2E1F]">ISKCON NVCC</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#6B4A3A] hover:bg-[#F58220]/10 rounded-lg"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive(link.href)
                  ? 'bg-[#F58220] text-white'
                  : 'text-[#6B4A3A] hover:bg-[#F58220]/10'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-600 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FFF7EF] border-b border-[#F2E6D8] shadow-lg px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive(link.href)
                  ? 'bg-[#F58220] text-white'
                  : 'text-[#6B4A3A] hover:bg-[#F58220]/10'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}