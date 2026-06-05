import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-[#FDFBF9]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#F2E6D8]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#F58220] animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-[#6B4A3A] font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
