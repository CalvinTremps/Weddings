"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Props = { guestId: string; guestName: string };

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

    // Upsert so guest can update their RSVP
    const { error: dbError } = await supabase.from("rsvps").upsert(
      {
        guest_id: guestId,
        attending,
        plus_one_name: plusOneName || null,
        dietary_restrictions: dietary || null,
        song_request: song || null,
        message: message || null,
      },
      { onConflict: "guest_id" }
    );

    setSubmitting(false);
    if (dbError) { setError("Something went wrong. Please try again."); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-5xl mb-6">💐</div>
        <h3
          className="text-3xl mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}
        >
          {attending ? "We can't wait to see you!" : "We'll miss you!"}
        </h3>
        <p className="text-sm" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
          Thank you, {guestName.split(" ")[0]}. Your RSVP has been received.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-5">
      {/* Attending toggle */}
      <div>
        <label className="text-xs tracking-widest uppercase mb-3 block" style={{ color: "var(--dusty-rose)" }}>
          Will you be attending?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[{ val: true, label: "Joyfully Accept" }, { val: false, label: "Regretfully Decline" }].map(({ val, label }) => (
            <button
              key={String(val)}
              type="button"
              onClick={() => setAttending(val)}
              className="py-3 px-4 rounded-xl text-sm transition-all"
              style={{
                border: attending === val ? "2px solid var(--dusty-rose)" : "1.5px solid var(--champagne)",
                background: attending === val ? "var(--dusty-rose)" : "white",
                color: attending === val ? "white" : "var(--charcoal)",
                fontFamily: "'Jost', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {attending && (
        <Field
          label="Plus one name (if applicable)"
          value={plusOneName}
          onChange={setPlusOneName}
          placeholder="Guest's full name"
        />
      )}

      {attending && (
        <Field
          label="Dietary requirements"
          value={dietary}
          onChange={setDietary}
          placeholder="e.g. Vegetarian, nut allergy…"
        />
      )}

      <Field
        label="Song request 🎵"
        value={song}
        onChange={setSong}
        placeholder="Get the party started with…"
      />

      <Field
        label="Message for the couple"
        value={message}
        onChange={setMessage}
        placeholder="Share your wishes…"
        multiline
      />

      {error && <p className="text-sm text-center" style={{ color: "#c0392b" }}>{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl text-sm tracking-[0.15em] uppercase transition-all disabled:opacity-40"
        style={{ background: "var(--dusty-rose)", color: "white", fontFamily: "'Jost', sans-serif" }}
      >
        {submitting ? "Sending…" : "Send RSVP"}
      </button>
    </form>
  );
}

function Field({
  label, value, onChange, placeholder, multiline,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean;
}) {
  const sharedStyle: React.CSSProperties = {
    background: "white",
    border: "1.5px solid var(--champagne)",
    borderRadius: "0.75rem",
    color: "var(--charcoal)",
    fontFamily: "'Jost', sans-serif",
    fontSize: "0.875rem",
    padding: "0.75rem 1rem",
    width: "100%",
    outline: "none",
    resize: "none",
  };
  return (
    <div>
      <label className="text-xs tracking-widest uppercase mb-2 block" style={{ color: "var(--dusty-rose)" }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={sharedStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--dusty-rose)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--champagne)")}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={sharedStyle}
          onFocus={(e) => (e.target.style.borderColor = "var(--dusty-rose)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--champagne)")}
        />
      )}
    </div>
  );
}
