"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onOpen: () => void;
  guestName: string;
};

export default function EnvelopeGate({ onOpen, guestName }: Props) {
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");

  function handleOpen() {
    if (phase !== "idle") return;
    setPhase("opening");
    // Fire autoplay music on this user interaction
    window.dispatchEvent(new CustomEvent("wedding-autoplay"));
    setTimeout(() => {
      setPhase("done");
      setTimeout(onOpen, 500);
    }, 1600);
  }

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          style={{ background: "linear-gradient(160deg, #f8f4ee 0%, #ede0cc 50%, #f8f4ee 100%)" }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top label */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="h-px w-10" style={{ background: "var(--champagne)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>
              A private invitation
            </span>
            <div className="h-px w-10" style={{ background: "var(--champagne)" }} />
          </motion.div>

          {/* Envelope */}
          <motion.div
            className="relative cursor-pointer select-none"
            onClick={handleOpen}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            whileHover={phase === "idle" ? { scale: 1.02 } : {}}
          >
            {/* Envelope body */}
            <div
              className="relative flex flex-col items-center justify-end overflow-hidden"
              style={{
                width: "min(320px, 88vw)",
                height: "min(210px, 58vw)",
                borderRadius: "4px",
                boxShadow: "0 20px 60px rgba(107,76,53,0.25), 0 4px 16px rgba(107,76,53,0.1)",
                background: "linear-gradient(160deg, #e8d5b0 0%, #d4b87a 60%, #c9a84c 100%)",
              }}
            >
              {/* Back fold lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 320 210"
                preserveAspectRatio="none"
                fill="none"
              >
                {/* Bottom-left triangle */}
                <path d="M0 210 L160 118 L0 0 Z" fill="rgba(180,140,70,0.3)" />
                {/* Bottom-right triangle */}
                <path d="M320 210 L160 118 L320 0 Z" fill="rgba(140,100,40,0.2)" />
                {/* Bottom triangle */}
                <path d="M0 210 L160 118 L320 210 Z" fill="rgba(200,165,90,0.25)" />
                {/* Fold line shadows */}
                <line x1="0" y1="210" x2="160" y2="118" stroke="rgba(150,110,50,0.35)" strokeWidth="1" />
                <line x1="320" y1="210" x2="160" y2="118" stroke="rgba(150,110,50,0.35)" strokeWidth="1" />
              </svg>

              {/* Guest name on envelope face — sits below the seal */}
              <div className="relative z-10 mb-4 text-center px-6">
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-1"
                  style={{ color: "rgba(107,76,53,0.6)", fontFamily: "'Jost', sans-serif" }}
                >
                  For
                </p>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
                    fontWeight: 400,
                    color: "#4a2c17",
                    lineHeight: 1.3,
                  }}
                >
                  {guestName}
                </p>
              </div>

              {/* Flap */}
              <motion.div
                className="absolute top-0 left-0 right-0 origin-top"
                style={{ transformStyle: "preserve-3d", zIndex: 20 }}
                animate={phase === "opening" ? { rotateX: -175, opacity: 0 } : { rotateX: 0, opacity: 1 }}
                transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] }}
              >
                <svg
                  viewBox="0 0 320 130"
                  fill="none"
                  style={{ width: "min(320px, 88vw)", display: "block" }}
                  preserveAspectRatio="none"
                >
                  {/* Flap body */}
                  <path
                    d="M0 0 L160 105 L320 0 Z"
                    fill="url(#flapGradient)"
                    stroke="rgba(150,110,50,0.3)"
                    strokeWidth="1"
                  />
                  <defs>
                    <linearGradient id="flapGradient" x1="160" y1="0" x2="160" y2="105" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#c9a84c" />
                      <stop offset="100%" stopColor="#d4b87a" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              {/* Wax seal — positioned in upper-centre, above the name */}
              <motion.div
                className="absolute flex items-center justify-center rounded-full shadow-md"
                style={{
                  width: 64,
                  height: 64,
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 25,
                  background: "radial-gradient(circle at 35% 35%, #8b5e52, #4a2c17)",
                  boxShadow: "0 4px 16px rgba(74,44,23,0.5), inset 0 1px 2px rgba(255,255,255,0.15)",
                }}
                animate={
                  phase === "opening"
                    ? { scale: [1, 1.15, 0], opacity: [1, 1, 0] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {/* Seal border ring */}
                <div
                  className="absolute rounded-full"
                  style={{
                    inset: 4,
                    border: "1px solid rgba(220,201,168,0.4)",
                    borderRadius: "50%",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "rgba(220,201,168,0.9)",
                    fontSize: "1.1rem",
                    fontWeight: 300,
                    letterSpacing: "0.05em",
                    lineHeight: 1,
                  }}
                >
                  M&amp;N
                </span>
              </motion.div>
            </div>

            {/* Tap prompt */}
            <AnimatePresence>
              {phase === "idle" && (
                <motion.p
                  className="text-center mt-6 text-xs tracking-[0.25em] uppercase"
                  style={{ color: "var(--dusty-rose)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Tap to open
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
