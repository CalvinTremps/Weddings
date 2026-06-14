"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import EnvelopeGate from "@/components/EnvelopeGate";

// Test codes — remove before going live
const TEST_CODES: Record<string, { id: string; name: string }> = {
  MNTEST2026: { id: "test-guest-id", name: "Valued Guest" },
  CALVCH2026: { id: "test-calvin-id", name: "Calvin Chingombe" },
  NANDI2026:  { id: "test-nandi-id", name: "Nandi" },
};

export default function Page() {
  return (
    <Suspense>
      <CodeEntryPage />
    </Suspense>
  );
}

function CodeEntryPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [guestData, setGuestData] = useState<{ id: string; name: string; code: string; table_number: string | null } | null>(null);
  const [fading, setFading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const validateCode = useCallback(async (trimmed: string) => {
    setLoading(true);
    setError("");

    // Test codes
    const test = TEST_CODES[trimmed];
    if (test) {
      setLoading(false);
      setGuestData({ id: test.id, name: test.name, code: trimmed, table_number: null });
      setShowEnvelope(true);
      return;
    }

    const { data, error: dbError } = await supabase
      .from("guests")
      .select("id, name, code, table_number")
      .eq("code", trimmed)
      .single();

    setLoading(false);

    if (dbError || !data) {
      setError("Invalid invitation code. Please check your invitation and try again.");
      return;
    }

    setGuestData({ id: data.id, name: data.name, code: data.code, table_number: data.table_number ?? null });
    setShowEnvelope(true);
  }, []);

  // Auto-validate code from URL param on mount
  useEffect(() => {
    const urlCode = searchParams.get("code");
    if (urlCode) {
      setCode(urlCode.toUpperCase());
      validateCode(urlCode.trim().toUpperCase());
    }
  }, [searchParams, validateCode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    validateCode(code.trim().toUpperCase());
  }

  function handleEnvelopeOpen() {
    if (!guestData) return;
    try { sessionStorage.setItem("guest", JSON.stringify(guestData)); } catch {}
    setFading(true);
    // Pass code in URL as fallback for private browsing (no sessionStorage)
    setTimeout(() => router.push(`/invitation?code=${encodeURIComponent(guestData.code)}`), 900);
  }

  return (
    <>
      {/* Full-screen fade overlay */}
      <motion.div
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{ background: "#f8f4ee" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: fading ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {showEnvelope && guestData && (
        <EnvelopeGate onOpen={handleEnvelopeOpen} guestName={guestData.name} />
      )}

      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden"
      >
        {/* Looping background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Video/background%20video%20loop.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0" style={{ background: "rgba(18,10,6,0.45)", zIndex: 1 }} />

        <motion.div className="relative z-10 w-full max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Lines + label */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div className="h-px" style={{ background: "var(--champagne)" }}
              initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 1.2, delay: 0.3 }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.75)" }}>
              You&apos;re Invited
            </span>
            <motion.div className="h-px" style={{ background: "var(--champagne)" }}
              initial={{ width: 0 }} animate={{ width: 48 }} transition={{ duration: 1.2, delay: 0.3 }} />
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "white" }}
            className="leading-tight mb-2">
            <span className="block text-5xl md:text-7xl">Marshall</span>
            <span className="block text-3xl md:text-4xl italic" style={{ color: "var(--gold)" }}>&amp;</span>
            <span className="block text-5xl md:text-7xl">Nandi</span>
          </h1>

          <p className="text-xs tracking-[0.25em] uppercase mb-10" style={{ color: "var(--champagne)" }}>
            13 August 2026
          </p>

          {/* Card — hide while envelope is showing */}
          {!showEnvelope && (
            <motion.div
              className="rounded-2xl p-7 shadow-sm"
              style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)", border: "1px solid var(--champagne)" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {loading ? (
                <p className="text-sm py-4" style={{ color: "var(--deep-mauve)" }}>Opening your invitation…</p>
              ) : (
                <>
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
                      Open My Invitation
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          )}

          <p className="mt-6 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            No code? WhatsApp +263 77 744 7446
          </p>
        </motion.div>
      </main>
    </>
  );
}
