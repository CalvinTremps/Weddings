"use client";

import { useState } from "react";

const PHOTOS = [
  { label: "First Look", color: "#e8d5b7" },
  { label: "Hand in Hand", color: "#e8c4b8" },
  { label: "Pure Joy", color: "#d4b896" },
  { label: "The Proposal", color: "#c9977a" },
  { label: "Golden Hour", color: "#e8d5b7" },
  { label: "Forever Begins", color: "#e8c4b8" },
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 px-0">
        {PHOTOS.map((p, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="relative group overflow-hidden rounded-xl aspect-[4/5] w-full"
            style={{ background: p.color }}
          >
            {/* Placeholder gradient — replace with <Image> when photos are ready */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${p.color}cc 0%, ${p.color}44 100%)`,
              }}
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(58,50,48,0.35)" }}
            >
              <span className="text-white text-xs tracking-widest uppercase mb-1">{p.label}</span>
              <span className="text-white text-xs opacity-70">View</span>
            </div>
            {/* Label at bottom */}
            <div className="absolute bottom-0 inset-x-0 p-3">
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: "var(--deep-mauve)" }}
              >
                {p.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-center text-xs mt-6" style={{ color: "var(--dusty-rose)", opacity: 0.5 }}>
        Photos coming soon — replace placeholders with real images in GallerySection.tsx
      </p>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(58,50,48,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-xl w-full aspect-[4/5] rounded-2xl flex items-center justify-center"
            style={{ background: PHOTOS[lightbox].color }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="text-2xl italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}
            >
              {PHOTOS[lightbox].label}
            </p>
          </div>
          <button
            className="absolute top-6 right-6 text-white text-3xl leading-none opacity-70 hover:opacity-100"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
