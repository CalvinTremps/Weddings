"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    // Auto-play when the custom event fires (dispatched on valid code entry)
    function handleAutoplay() {
      audio!.play().then(() => {
        setPlaying(true);
        setVisible(true);
      }).catch(() => {});
    }

    window.addEventListener("wedding-autoplay", handleAutoplay);
    return () => window.removeEventListener("wedding-autoplay", handleAutoplay);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Show player 3s after first render (in case already on invitation page)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}); }
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <div
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg transition-all duration-700"
        style={{
          background: "rgba(248,244,238,0.95)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--champagne)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Animated bars */}
        <div className="flex items-end gap-[3px] h-4 w-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-[3px] rounded-full"
              style={{
                background: "var(--gold)",
                height: playing ? `${40 + i * 15}%` : "30%",
                animation: playing ? `musicBar${i} 0.8s ease-in-out infinite alternate` : "none",
                animationDelay: `${i * 0.1}s`,
                transition: "height 0.3s ease",
              }}
            />
          ))}
        </div>

        <div>
          <p className="leading-none mb-0.5" style={{ color: "var(--deep-mauve)", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem" }}>
            A Thousand Years
          </p>
          <p className="leading-none" style={{ color: "var(--dusty-rose)", opacity: 0.7, fontSize: "0.65rem", letterSpacing: "0.05em" }}>
            {playing ? "Now playing" : "Tap to play"}
          </p>
        </div>

        <button onClick={toggle}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ background: "var(--dusty-rose)" }}>
          {playing ? (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="white">
              <rect x="0" y="0" width="3.5" height="12" rx="1" />
              <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="white">
              <path d="M0 0 L10 6 L0 12 Z" />
            </svg>
          )}
        </button>

        <input type="range" min="0" max="1" step="0.05" value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-14 h-1 rounded-full appearance-none cursor-pointer hidden sm:block"
          style={{ accentColor: "var(--dusty-rose)" }}
        />
      </div>

      <style>{`
        @keyframes musicBar1 { from{height:25%} to{height:80%} }
        @keyframes musicBar2 { from{height:50%} to{height:30%} }
        @keyframes musicBar3 { from{height:70%} to{height:45%} }
        @keyframes musicBar4 { from{height:35%} to{height:90%} }
      `}</style>
    </>
  );
}
