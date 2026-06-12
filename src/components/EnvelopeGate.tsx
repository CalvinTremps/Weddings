"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onOpen: () => void;
};

export default function EnvelopeGate({ onOpen }: Props) {
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");

  function handleOpen() {
    setPhase("opening");
    setTimeout(() => {
      setPhase("done");
      setTimeout(onOpen, 600);
    }, 1400);
  }

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: "var(--cream)" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Envelope */}
        <div className="relative cursor-pointer select-none" onClick={handleOpen}>
          {/* Envelope body */}
          <motion.div
            className="relative flex items-center justify-center rounded-lg"
            style={{
              width: 280,
              height: 180,
              background: "white",
              border: "1.5px solid var(--champagne)",
              boxShadow: "0 8px 40px rgba(139,94,82,0.12)",
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Bottom triangle fold lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 180" fill="none">
              <line x1="0" y1="180" x2="140" y2="100" stroke="var(--champagne)" strokeWidth="1" />
              <line x1="280" y1="180" x2="140" y2="100" stroke="var(--champagne)" strokeWidth="1" />
            </svg>

            {/* Wax seal */}
            <motion.div
              className="relative z-10 flex items-center justify-center rounded-full shadow-md"
              style={{ width: 56, height: 56, background: "var(--dusty-rose)" }}
              animate={phase === "opening" ? { scale: [1, 1.2, 0], opacity: [1, 1, 0] } : {}}
              transition={{ duration: 0.6 }}
            >
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "white", fontSize: "1.4rem", fontWeight: 300 }}>
                &amp;
              </span>
            </motion.div>

            {/* Flap */}
            <motion.div
              className="absolute top-0 left-0 right-0 origin-top"
              style={{ transformStyle: "preserve-3d" }}
              animate={phase === "opening" ? { rotateX: -160, opacity: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              <svg viewBox="0 0 280 110" fill="none" style={{ width: 280 }}>
                <path d="M0 0 L140 90 L280 0 Z" fill="white" stroke="var(--champagne)" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>

          {phase === "idle" && (
            <motion.p
              className="text-center mt-6 text-xs tracking-[0.25em] uppercase"
              style={{ color: "var(--dusty-rose)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Tap to open your invitation
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
