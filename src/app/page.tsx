"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import EnvelopeGate from "@/components/EnvelopeGate";

export default function CodeEntryPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [guestData, setGuestData] = useState<{ id: string; name: string; code: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmed = code.trim().toUpperCase();

    // Test code — remove before going live
    if (trimmed === "MNTEST2026") {
      setLoading(false);
      setGuestData({ id: "test-guest-id", name: "Valued Guest", code: trimmed });
      setShowEnvelope(true);
      return;
    }

    const { data, error: dbError } = await supabase
      .from("guests")
      .select("id, name, code")
      .eq("code", trimmed)
      .single();

    setLoading(false);

    if (dbError || !data) {
      setError("Invalid invitation code. Please check your invitation and try again.");
      return;
    }

    setGuestData({ id: data.id, name: data.name, code: data.code });
    setShowEnvelope(true);
  }

  function handleEnvelopeOpen() {
    if (!guestData) return;
    sessionStorage.setItem("guest", JSON.stringify(guestData));
    router.push("/invitation");
  }

  return (
    <>
      {showEnvelope && guestData && (
        <EnvelopeGate onOpen={handleEnvelopeOpen} guestName={guestData.name} />
      )}

      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative"
        style={{ background: "linear-gradient(160deg, #f8f4ee 0%, #ede0cc 50%, #f8f4ee 100%)" }}
      >
        {/* Soft blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <motion.div className="absolute rounded-full"
            style={{ width: 500, height: 500, top: "-15%", left: "-10%", background: "radial-gradient(circle, rgba(220,201,168,0.45) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], x: [0, 25, 0], y: [0, 15, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div className="absolute rounded-full"
            style={{ width: 400, height: 400, bottom: "-10%", right: "-5%", background: "radial-gradient(circle, rgba(201,168,76,0.2) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, -15, 0], y: [0, -20, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <motion.div className="relative z-10 w-full max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Lines + label */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div className="h-px" style={{ background: "var(--champagne)" }}
              initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 1.2, delay: 0.3 }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>
              You&apos;re Invited
            </span>
            <motion.div className="h-px" style={{ background: "var(--champagne)" }}
              initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 1.2, delay: 0.3 }} />
          </div>

          {/* Ampersand */}
          <motion.div
            className="text-7xl md:text-8xl leading-none mb-3 select-none"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)", fontWeight: 300 }}
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            &amp;
          </motion.div>

          <h1 className="text-4xl md:text-6xl mb-2 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--charcoal)" }}>
            Marshall &amp; Nandi
          </h1>

          <p className="text-xs tracking-[0.25em] uppercase mb-10" style={{ color: "var(--dusty-rose)" }}>
            13 August 2026
          </p>

          {/* Card */}
          <motion.div
            className="rounded-2xl p-7 shadow-sm"
            style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)", border: "1px solid var(--champagne)" }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-sm mb-5 leading-6" style={{ color: "var(--deep-mauve)" }}>
              Enter the unique code from your invitation to open your personal invite.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Your invitation code"
                maxLength={20}
                autoCapitalize="characters"
                className="w-full text-center text-base tracking-[0.2em] px-4 py-3 rounded-xl outline-none transition"
                style={{
                  background: "var(--cream)",
                  border: "1.5px solid var(--champagne)",
                  color: "var(--charcoal)",
                  fontFamily: "'Jost', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--dusty-rose)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--champagne)")}
              />

              <AnimatePresence>
                {error && (
                  <motion.p className="text-sm" style={{ color: "#c0392b" }}
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={!code.trim() || loading}
                className="w-full py-3 rounded-xl text-xs tracking-[0.2em] uppercase disabled:opacity-40"
                style={{ background: "var(--dusty-rose)", color: "white", fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {loading ? "Checking…" : "Open My Invitation"}
              </motion.button>
            </form>
          </motion.div>

          <p className="mt-6 text-xs" style={{ color: "var(--dusty-rose)", opacity: 0.6 }}>
            No code? WhatsApp +263 77 744 7446
          </p>
        </motion.div>
      </main>
    </>
  );
}
