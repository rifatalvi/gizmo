import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/component/Navbar";
import Chatbot from "@/component/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { ThemeProvider } from "@/component/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";

export const metadata: Metadata = {
  title: "Gizmo — Tech E-Commerce",
  description: "Shop the latest gadgets, laptops, phones and tech accessories at Gizmo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <TooltipProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                {children}
                <Chatbot />
              </CartProvider>
            </WishlistProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
