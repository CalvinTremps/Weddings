"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const PHOTOS = [
  {
    label: "First Look",
    url: "https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Images/IMG_3672.JPG%20(1).jpeg",
  },
  {
    label: "Hand in Hand",
    url: "https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Images/IMG_3671.JPG%20(1).jpeg",
  },
  // Add more photos here as you upload them to Supabase
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <>
      <div className="max-w-xl mx-auto grid grid-cols-2 gap-3 px-0">
        {PHOTOS.map((p, i) => (
          <motion.button
            key={i}
            onClick={() => setLightbox(i)}
            className="relative group overflow-hidden rounded-xl aspect-[4/5] w-full"
            style={{ background: "#e8d5b7" }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Image
              src={p.url}
              alt={p.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
              unoptimized
            />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "rgba(58,50,48,0.4)" }}
            >
              <span className="text-white text-xs tracking-widest uppercase mb-1">{p.label}</span>
              <span className="text-white text-xs opacity-70">View</span>
            </div>
            {/* Label */}
            <div className="absolute bottom-0 inset-x-0 p-3" style={{ background: "linear-gradient(to top, rgba(58,50,48,0.5), transparent)" }}>
              <span className="text-white text-xs tracking-widest uppercase">{p.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(58,50,48,0.9)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/5", maxHeight: "85vh" }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={PHOTOS[lightbox].url}
                alt={PHOTOS[lightbox].label}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute bottom-0 inset-x-0 p-4 text-center" style={{ background: "linear-gradient(to top, rgba(58,50,48,0.7), transparent)" }}>
                <p className="text-white text-sm tracking-widest uppercase">{PHOTOS[lightbox].label}</p>
              </div>
            </motion.div>

            {/* Prev / Next arrows */}
            {lightbox > 0 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-70 hover:opacity-100 transition"
                style={{ background: "rgba(255,255,255,0.15)" }}
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
              >‹</button>
            )}
            {lightbox < PHOTOS.length - 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-70 hover:opacity-100 transition"
                style={{ background: "rgba(255,255,255,0.15)" }}
                onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
              >›</button>
            )}

            <button
              className="absolute top-4 right-4 text-white text-3xl leading-none opacity-70 hover:opacity-100"
              onClick={() => setLightbox(null)}
            >×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
