"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";

type Props = { guestId: string; guestName: string };

function fireConfetti() {
  const colors = ["#e8c4b8", "#c9977a", "#e8d5b7", "#8b5e52", "#f5e6df"];
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors }), 250);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors }), 400);
}

export default function RSVPForm({ guestId, guestName }: Props) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOneName, setPlusOneName] = useState("");
  const [dietary, setDietary] = useState("");
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (attending === null) { setError("Please select whether you'll be attending."); return; }
    setError("");
    setSubmitting(true);

    const { error: dbError } = await supabase.from("rsvps").upsert(
      { guest_id: guestId, attending, plus_one_name: plusOneName || null, dietary_restrictions: dietary || null, song_request: song || null, message: message || null },
      { onConflict: "guest_id" }
    );

    setSubmitting(false);
    if (dbError) { setError("Something went wrong. Please try again."); return; }

    if (attending) fireConfetti();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        className="max-w-md mx-auto text-center py-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="text-6xl mb-6">{attending ? "💐" : "🤍"}</div>
        <h3 className="text-3xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>
          {attending ? "We can't wait to see you!" : "We'll miss you!"}
        </h3>
        <p className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
          Thank you, {guestName.split(" ")[0]}. Your RSVP has been received.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto flex flex-col gap-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div>
        <label className="text-xs tracking-widest uppercase mb-3 block" style={{ color: "var(--dusty-rose)" }}>
          Will you be attending?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[{ val: true, label: "Joyfully Accept" }, { val: false, label: "Regretfully Decline" }].map(({ val, label }) => (
            <motion.button
              key={String(val)}
              type="button"
              onClick={() => setAttending(val)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="py-3 px-4 rounded-xl text-sm transition-all"
              style={{
                border: attending === val ? "2px solid var(--dusty-rose)" : "1.5px solid var(--champagne)",
                background: attending === val ? "var(--dusty-rose)" : "white",
                color: attending === val ? "white" : "var(--charcoal)",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {attending && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <Field label="Plus one name (if applicable)" value={plusOneName} onChange={setPlusOneName} placeholder="Guest's full name" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {attending && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <Field label="Dietary requirements" value={dietary} onChange={setDietary} placeholder="e.g. Vegetarian, nut allergy…" />
          </motion.div>
        )}
      </AnimatePresence>

      <Field label="Song request 🎵" value={song} onChange={setSong} placeholder="Get the party started with…" />
      <Field label="Message for the couple" value={message} onChange={setMessage} placeholder="Share your wishes…" multiline />

      {error && <p className="text-sm text-center" style={{ color: "#c0392b" }}>{error}</p>}

      <motion.button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl text-sm tracking-[0.15em] uppercase disabled:opacity-40"
        style={{ background: "var(--dusty-rose)", color: "white", fontFamily: "'Jost', sans-serif" }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {submitting ? "Sending…" : "Send RSVP"}
      </motion.button>
    </motion.form>
  );
}

function Field({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const sharedStyle: React.CSSProperties = {
    background: "white", border: "1.5px solid var(--champagne)", borderRadius: "0.75rem",
    color: "var(--charcoal)", fontFamily: "'Jost', sans-serif", fontSize: "0.875rem",
    padding: "0.75rem 1rem", width: "100%", outline: "none", resize: "none",
  };
  return (
    <div>
      <label className="text-xs tracking-widest uppercase mb-2 block" style={{ color: "var(--dusty-rose)" }}>{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={4} style={sharedStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--dusty-rose)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--champagne)")} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={sharedStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--dusty-rose)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--champagne)")} />
      )}
    </div>
  );
}
