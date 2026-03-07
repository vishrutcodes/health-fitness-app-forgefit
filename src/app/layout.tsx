import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ForgeFit – AI-Powered Fitness & Nutrition Platform",
  description:
    "Stop guessing. Start evolving. Get personalized workout plans, diet strategies, and real-time guidance — powered by advanced AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-[#030712] text-white`}>
        {children}
      </body>
    </html>
  );
}
