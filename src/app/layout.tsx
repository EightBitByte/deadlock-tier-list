import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const forevs = localFont({
  src: "../../public/fonts/forevsdemo-bold.otf",
  variable: "--font-forevs",
});

export const metadata: Metadata = {
  title: "Deadlock Tierlist",
  description: "Community voted tierlist for Deadlock characters",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cinzel.variable} ${forevs.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        {/* Noise overlay */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}
        />

        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-grow">
            {children}
          </div>
          <footer className="w-full text-center py-6 text-white/30 text-xs font-mono mt-8">
            Created by <a href="https://github.com/EightBitByte" target="_blank" rel="noreferrer" className="text-gold hover:text-white transition-colors">EightBitByte</a>
          </footer>
        </div>
      </body>
    </html>
  );
}
