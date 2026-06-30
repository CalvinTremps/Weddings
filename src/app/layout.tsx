import type { Metadata } from "next";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Marshall & Nandi · 13 August 2026",
  description: "You're invited to celebrate the wedding of Marshall & Nandi on 13 August 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <MusicPlayer src="/media/music.mp3" />
      </body>
    </html>
  );
}
