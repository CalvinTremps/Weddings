"use client";

import { useEffect, useState } from "react";

export default function Countdown({ targetDate, light }: { targetDate: string; light?: boolean }) {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());

  function calcTimeLeft() {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(t);
  });

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-6 md:gap-10">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <span
            className="text-4xl md:text-6xl tabular-nums leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: light ? "white" : "var(--deep-mauve)" }}
          >
            {String(value).padStart(2, "0")}
          </span>
          <span className="text-xs tracking-widest uppercase mt-2" style={{ color: light ? "rgba(255,255,255,0.6)" : "var(--dusty-rose)", opacity: 0.7 }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
