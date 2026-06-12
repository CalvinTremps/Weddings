"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CodeEntryPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

    // Store guest info in sessionStorage so invitation page can personalise
    sessionStorage.setItem("guest", JSON.stringify({ id: data.id, name: data.name, code: data.code }));
    router.push("/invitation");
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "var(--cream)" }}
    >
      {/* Decorative top line */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px w-16" style={{ background: "var(--blush)" }} />
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>
          You&apos;re Invited
        </span>
        <div className="h-px w-16" style={{ background: "var(--blush)" }} />
      </div>

      {/* Monogram / ampersand */}
      <div
        className="text-8xl mb-4 leading-none select-none"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--blush)", fontWeight: 300 }}
      >
        &amp;
      </div>

      <h1
        className="text-5xl md:text-7xl text-center mb-2 leading-tight"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--charcoal)" }}
      >
        Sarah &amp; James
      </h1>

      <p
        className="text-sm tracking-[0.25em] uppercase mb-12"
        style={{ color: "var(--dusty-rose)" }}
      >
        September 20, 2026
      </p>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-sm"
        style={{ background: "white", border: "1px solid var(--champagne)" }}
      >
        <p
          className="text-center mb-6 text-sm"
          style={{ color: "var(--deep-mauve)", letterSpacing: "0.05em" }}
        >
          Enter the code from your invitation to view your personal invite.
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

          {error && (
            <p className="text-center text-sm" style={{ color: "#c0392b" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="w-full py-3 rounded-xl text-sm tracking-[0.15em] uppercase transition-all disabled:opacity-40"
            style={{
              background: "var(--dusty-rose)",
              color: "white",
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              cursor: code.trim() && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Checking…" : "Open My Invitation"}
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs text-center" style={{ color: "var(--dusty-rose)", opacity: 0.6 }}>
        Don&apos;t have a code? Contact the couple directly.
      </p>
    </main>
  );
}
