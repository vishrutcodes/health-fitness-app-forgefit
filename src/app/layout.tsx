import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ForgeFit – AI-Powered Fitness & Nutrition Platform",
  description:
    "Stop guessing. Start evolving. Get personalized workout plans, diet strategies, and real-time guidance — powered by advanced AI.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ForgeFit",
    startupImage: "/splash.png",
  },
  icons: {
    icon: "/icon-512.png",
    apple: "/icon-512.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff6b2b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icon-512.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} antialiased bg-[#030712] text-white`}>
        {children}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((reg) => console.log('SW registered:', reg.scope))
                  .catch((err) => console.log('SW registration failed:', err));
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
