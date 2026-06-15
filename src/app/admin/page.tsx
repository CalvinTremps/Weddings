"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Guest = { id: string; name: string; email: string | null; code: string; created_at: string };
type RSVP = { guest_id: string; attending: boolean; plus_one_name: string | null; dietary_restrictions: string | null; song_request: string | null; message: string | null };

function generateCode(name: string): string {
  const prefix = name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${suffix}`;
}

const ADMIN_PASSWORD = "MarshalNandi2026";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(() => {
    try {
      if (typeof window !== "undefined") return sessionStorage.getItem("adminAuthed") === "true";
    } catch {}
    return false;
  });
  const [guests, setGuests] = useState<Guest[]>([]);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  async function loadData() {
    const [{ data: g }, { data: r }] = await Promise.all([
      supabase.from("guests").select("*").order("created_at", { ascending: false }),
      supabase.from("rsvps").select("*"),
    ]);
    setGuests(g ?? []);
    setRsvps(r ?? []);
  }

  async function addGuest() {
    if (!name.trim()) return;
    setAdding(true);
    setAddError("");
    const code = generateCode(name);
    const { error: insertError } = await supabase.from("guests").insert({
      name: name.trim(),
      email: email.trim() || null,
      code,
    });
    if (insertError) {
      setAddError(`Failed to add guest: ${insertError.message}`);
      setAdding(false);
      return;
    }
    setName(""); setEmail("");
    await loadData();
    setAdding(false);
  }

async function deleteGuest(id: string) {
    if (!confirm("Delete this guest?")) return;
    await supabase.from("guests").delete().eq("id", id);
    await loadData();
  }

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function copyLink(code: string, id: string) {
    const url = `${window.location.origin}/?code=${code}`;
    navigator.clipboard.writeText(url);
    setCopied(`link-${id}`);
    setTimeout(() => setCopied(null), 2000);
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="w-full max-w-xs p-8 rounded-2xl bg-white" style={{ border: "1px solid var(--champagne)" }}>
          <h1 className="text-2xl text-center mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>
            Admin
          </h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && password === ADMIN_PASSWORD) { sessionStorage.setItem("adminAuthed", "true"); setAuthed(true); } }}
            className="w-full px-4 py-2 rounded-xl mb-3 text-sm outline-none"
            style={{ background: "var(--cream)", border: "1.5px solid var(--champagne)", color: "var(--charcoal)" }}
          />
          <button
            onClick={() => { if (password === ADMIN_PASSWORD) { sessionStorage.setItem("adminAuthed", "true"); setAuthed(true); } else { alert("Wrong password"); } }}
            className="w-full py-2 rounded-xl text-sm"
            style={{ background: "var(--dusty-rose)", color: "white" }}
          >
            Enter
          </button>
        </div>
      </main>
    );
  }

  const rsvpMap = Object.fromEntries(rsvps.map((r) => [r.guest_id, r]));
  const attending = rsvps.filter((r) => r.attending).length;
  const declined = rsvps.filter((r) => !r.attending).length;
  const pending = guests.length - rsvps.length;

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>
          Guest Management
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--dusty-rose)" }}>
          {guests.length} guests · {attending} attending · {declined} declined · {pending} pending
        </p>

        {/* Add guest */}
        <div className="bg-white rounded-2xl p-6 mb-8" style={{ border: "1px solid var(--champagne)" }}>
          <h2 className="text-lg mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>Add Guest</h2>
          <div className="flex flex-wrap gap-3">
            <input
              placeholder="Full name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: "var(--cream)", border: "1.5px solid var(--champagne)", color: "var(--charcoal)" }}
            />
            <input
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 min-w-[160px] px-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: "var(--cream)", border: "1.5px solid var(--champagne)", color: "var(--charcoal)" }}
            />
<button
              onClick={addGuest}
              disabled={!name.trim() || adding}
              className="px-6 py-2 rounded-xl text-sm disabled:opacity-40"
              style={{ background: "var(--dusty-rose)", color: "white" }}
            >
              {adding ? "Adding…" : "Add & Generate Code"}
            </button>
          </div>
          {addError && (
            <p className="mt-3 text-sm" style={{ color: "#c0392b" }}>{addError}</p>
          )}
        </div>

        {/* Guest list */}
        <div className="bg-white rounded-2xl overflow-x-auto" style={{ border: "1px solid var(--champagne)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--champagne)" }}>
                {["Name", "Code / Link", "RSVP", "Details", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase" style={{ color: "var(--dusty-rose)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guests.map((g) => {
                const rsvp = rsvpMap[g.id];
                return (
                  <tr key={g.id} style={{ borderBottom: "1px solid var(--cream)" }}>
                    <td className="px-4 py-3" style={{ color: "var(--charcoal)" }}>{g.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => copy(g.code, g.id)}
                          className="font-mono text-xs px-3 py-1 rounded-lg transition text-left"
                          style={{ background: "var(--cream)", color: "var(--deep-mauve)", border: "1px solid var(--champagne)" }}
                        >
                          {copied === g.id ? "Copied!" : g.code}
                        </button>
                        <button
                          onClick={() => copyLink(g.code, g.id)}
                          className="text-xs px-3 py-1 rounded-lg transition text-left"
                          style={{ background: "var(--cream)", color: "var(--sage)", border: "1px solid var(--champagne)" }}
                        >
                          {copied === `link-${g.id}` ? "Link copied!" : "Copy link"}
                        </button>
                      </div>
                    </td>

<td className="px-4 py-3">
                      {!rsvp ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#f0e9e0", color: "var(--dusty-rose)" }}>Pending</span>
                      ) : rsvp.attending ? (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#e8f5e9", color: "#2e7d32" }}>Attending</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "#fce4ec", color: "#c62828" }}>Declined</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--charcoal)", opacity: 0.7 }}>
                      {rsvp?.plus_one_name && <div><span style={{ color: "var(--dusty-rose)" }}>+1:</span> {rsvp.plus_one_name}</div>}
                      {rsvp?.dietary_restrictions && <div><span style={{ color: "var(--dusty-rose)" }}>Diet:</span> {rsvp.dietary_restrictions}</div>}
                      {rsvp?.song_request && <div><span style={{ color: "var(--dusty-rose)" }}>Song:</span> {rsvp.song_request}</div>}
                      {rsvp?.message && (
                        <div className="mt-1 italic max-w-xs" style={{ opacity: 0.7 }}>
                          &ldquo;{rsvp.message}&rdquo;
                        </div>
                      )}
                      {!rsvp && <span style={{ opacity: 0.4 }}>—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteGuest(g.id)} className="text-xs opacity-40 hover:opacity-80" style={{ color: "#c0392b" }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              {guests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "var(--dusty-rose)", opacity: 0.5 }}>
                    No guests yet — add one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
