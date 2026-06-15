"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";

type Props = { guestId: string; guestName: string; tableNumber: string | null };

function fireConfetti() {
  const colors = ["#e8c4b8", "#c9977a", "#e8d5b7", "#8b5e52", "#f5e6df"];
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors }), 250);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors }), 400);
}

export default function RSVPForm({ guestId, guestName, tableNumber }: Props) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [plusOneName, setPlusOneName] = useState("");
  const [dietary, setDietary] = useState("");
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRsvpd, setAlreadyRsvpd] = useState<{ attending: boolean } | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  // Check on mount if guest already RSVPed
  useEffect(() => {
    if (!guestId || guestId === "test-guest-id") { setChecking(false); return; }
    supabase
      .from("rsvps")
      .select("attending")
      .eq("guest_id", guestId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setAlreadyRsvpd({ attending: data.attending });
        setChecking(false);
      });
  }, [guestId]);

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

  if (checking) {
    return (
      <div className="py-10 text-center text-sm" style={{ color: "var(--dusty-rose)", opacity: 0.6 }}>
        Loading…
      </div>
    );
  }

  // Already RSVPed — show locked message
  if (alreadyRsvpd !== null) {
    return (
      <motion.div
        className="max-w-md mx-auto text-center py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-5xl mb-5">{alreadyRsvpd.attending ? "✅" : "🤍"}</div>
        <h3 className="text-2xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>
          {alreadyRsvpd.attending ? "You're all set!" : "We'll miss you dearly"}
        </h3>
        <p className="text-sm leading-7" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
          {alreadyRsvpd.attending
            ? `We already have your RSVP, ${guestName.split(" ")[0]}. We can't wait to celebrate with you on the 13th!`
            : `We have your response, ${guestName.split(" ")[0]}. Thank you for letting us know, you will be missed.`}
        </p>
        {alreadyRsvpd.attending && tableNumber && <TableCard tableNumber={tableNumber} />}
        <p className="mt-4 text-xs tracking-widest uppercase" style={{ color: "var(--dusty-rose)", opacity: 0.5 }}>
          Need to make a change? WhatsApp us on +263 71 279 6921
        </p>
      </motion.div>
    );
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
        <p className="text-sm mb-2" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
          Thank you, {guestName.split(" ")[0]}. Your RSVP has been received.
        </p>
        {attending && tableNumber && <TableCard tableNumber={tableNumber} />}
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

function TableCard({ tableNumber }: { tableNumber: string }) {
  return (
    <motion.div
      className="my-6 mx-auto rounded-2xl px-8 py-6 max-w-xs"
      style={{ background: "linear-gradient(135deg, #e8d5b0, #d4b87a)", border: "1px solid rgba(201,168,76,0.4)" }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
    >
      <p className="text-xs tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(74,44,23,0.65)", fontFamily: "'Jost', sans-serif" }}>
        Your Table
      </p>
      <p className="text-5xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#4a2c17" }}>
        {tableNumber}
      </p>
      <p className="text-xs mt-2" style={{ color: "rgba(74,44,23,0.5)", fontFamily: "'Jost', sans-serif" }}>
        Please find your seat on arrival
      </p>
    </motion.div>
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
