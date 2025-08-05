import { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding/Logo */}
      <div className="bg-primary md:w-1/2 p-6 md:p-10 flex flex-col">
        <div className="flex flex-col items-center justify-center h-full">
        <Image
          src="/appLogo.svg"
          alt="MeetAI Logo"
          width={120}
          height={40}
          className="mb-8"
          priority
        />
          <div className="text-center mt-6">
        <h1 className="text-2xl md:text-4xl font-bold text-white">
          Welcome to MeetAI
        </h1>
        <p className="text-white/80 mt-4 max-w-md">
          Your smart meeting assistant that helps you schedule, organize, and optimize your meetings.
        </p>
          </div>
        </div>
        <div className="mt-auto hidden md:block text-white/60 text-sm text-center w-full">
          &copy; {new Date().getFullYear()} MeetAI. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}