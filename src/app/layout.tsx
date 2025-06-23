// Root layout for the application

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { TRPCReactProvider } from "@/trpc/client";
import { NuqsAdapter } from 'nuqs/adapters/next/app'


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "Meet AI",
  keywords: [
    "meet ai",
    "meetings",
    "ai meetings",
    "ai",
    "artificial intelligence",
    "video conferencing",
    "productivity",
    "collaboration",
    "virtual meetings",
    "remote work"],
  authors: [{ name: "Pranjal Jain", url: "https://pranjaljain.live" }],
  description: "Meet AI is a cutting-edge platform that revolutionizes the way we conduct meetings by integrating artificial intelligence to enhance productivity and collaboration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
    <TRPCReactProvider>

    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        >
        <Toaster/>
        {children}
      </body>
    </html>
    </TRPCReactProvider>
    </NuqsAdapter>
  );
}