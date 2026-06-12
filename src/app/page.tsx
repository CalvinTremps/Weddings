"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import EnvelopeGate from "@/components/EnvelopeGate";
import FloatingPetals from "@/components/FloatingPetals";

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
      <FloatingPetals />

      {showEnvelope && <EnvelopeGate onOpen={handleEnvelopeOpen} />}

      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 relative z-20"
        style={{ background: "linear-gradient(135deg, #faf7f2 0%, #f5ece3 40%, #faf7f2 100%)" }}
      >
        {/* Animated gradient blob */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden
        >
          <motion.div
            className="absolute rounded-full"
            style={{ width: 600, height: 600, top: "-10%", left: "-10%", background: "radial-gradient(circle, rgba(232,196,184,0.35) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{ width: 500, height: 500, bottom: "-5%", right: "-5%", background: "radial-gradient(circle, rgba(201,151,122,0.2) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>

        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4 mb-10">
            <motion.div
              className="h-px"
              style={{ background: "var(--blush)" }}
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>
              You&apos;re Invited
            </span>
            <motion.div
              className="h-px"
              style={{ background: "var(--blush)" }}
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </div>

          <motion.div
            className="text-8xl mb-4 leading-none select-none"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--blush)", fontWeight: 300 }}
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            &amp;
          </motion.div>

          <h1
            className="text-5xl md:text-7xl text-center mb-2 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--charcoal)" }}
          >
            Sarah &amp; James
          </h1>

          <p className="text-sm tracking-[0.25em] uppercase mb-12" style={{ color: "var(--dusty-rose)" }}>
            September 20, 2026
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key="card"
              className="w-full max-w-sm rounded-2xl p-8 shadow-sm"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid var(--champagne)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-center mb-6 text-sm" style={{ color: "var(--deep-mauve)", letterSpacing: "0.05em" }}>
                Enter the code from your invitation to open your personal invite.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. ROSE2026"
                  maxLength={20}
                  autoCapitalize="characters"
                  className="w-full text-center text-lg tracking-widest px-4 py-3 rounded-xl outline-none transition"
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
                    <motion.p
                      className="text-center text-sm"
                      style={{ color: "#c0392b" }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={!code.trim() || loading}
                  className="w-full py-3 rounded-xl text-sm tracking-[0.15em] uppercase disabled:opacity-40"
                  style={{
                    background: "var(--dusty-rose)",
                    color: "white",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 400,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Checking…" : "Open My Invitation"}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <p className="mt-8 text-xs text-center" style={{ color: "var(--dusty-rose)", opacity: 0.6 }}>
            Don&apos;t have a code? Contact the couple directly.
          </p>
        </motion.div>
      </main>
    </>
  );
}
