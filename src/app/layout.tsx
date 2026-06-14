import type { Metadata } from "next";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";

export const metadata: Metadata = {
  title: "Marshall & Nandi — 13 August 2026",
  description: "You're invited to celebrate the wedding of Marshall & Nandi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        {children}
        <MusicPlayer src="https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Music/Christina%20Perri%20-%20A%20Thousand%20Years.mp3" />
      </body>
    </html>
  );
}
