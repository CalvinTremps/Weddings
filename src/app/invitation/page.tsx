"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Countdown from "@/components/Countdown";
import GallerySection from "@/components/GallerySection";
import RSVPForm from "@/components/RSVPForm";

type Guest = { id: string; name: string; code: string };

export default function InvitationPage() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("guest");
    if (!raw) { router.replace("/"); return; }
    setGuest(JSON.parse(raw));
  }, [router]);

  if (!guest) return null;

  const firstName = guest.name.split(" ")[0];

  return (
    <main style={{ background: "var(--cream)" }}>
      {/* NAV */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex justify-center gap-6 md:gap-10 py-4 text-xs tracking-[0.2em] uppercase"
        style={{ background: "rgba(250,247,242,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--champagne)", color: "var(--dusty-rose)" }}
      >
        {["Our Story", "Details", "Gallery", "RSVP"].map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(" ", "-")}`} className="hover:opacity-60 transition-opacity">
            {s}
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20"
        style={{ background: "linear-gradient(180deg, var(--cream) 0%, #f0e9e0 100%)" }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px w-12" style={{ background: "var(--blush)" }} />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>
            Dear {firstName},
          </span>
          <div className="h-px w-12" style={{ background: "var(--blush)" }} />
        </div>

        <p className="text-sm tracking-widest uppercase mb-4" style={{ color: "var(--sage)" }}>
          Together with their families
        </p>

        <h1
          className="text-6xl md:text-9xl leading-none mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--charcoal)" }}
        >
          Sarah
        </h1>
        <div
          className="text-4xl md:text-6xl mb-4 leading-none"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--blush)" }}
        >
          &amp;
        </div>
        <h1
          className="text-6xl md:text-9xl leading-none mb-8"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--charcoal)" }}
        >
          James
        </h1>

        <p
          className="text-base md:text-lg tracking-[0.2em] uppercase mb-2"
          style={{ color: "var(--dusty-rose)" }}
        >
          Request the honour of your presence
        </p>
        <p className="text-sm tracking-widest uppercase mb-12" style={{ color: "var(--deep-mauve)", opacity: 0.7 }}>
          Saturday, September 20, 2026
        </p>

        <Countdown targetDate="2026-09-20T11:00:00" />

        <a
          href="#our-story"
          className="mt-14 flex flex-col items-center gap-2 text-xs tracking-widest uppercase opacity-50 hover:opacity-80 transition-opacity"
          style={{ color: "var(--charcoal)" }}
        >
          <span>Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 4v16M2 14l6 6 6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </section>

      {/* OUR STORY */}
      <section id="our-story" className="py-24 px-6 max-w-3xl mx-auto text-center">
        <SectionTitle label="Our Story" />
        <blockquote
          className="text-2xl md:text-3xl italic mb-10 leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}
        >
          &ldquo;I am my beloved&apos;s and my beloved is mine.&rdquo;
        </blockquote>
        <p className="leading-8 text-base mb-6" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
          Sarah and James met on a rainy Tuesday in October 2021 — she was
          reaching for the last umbrella at a café, he was returning the one he
          had borrowed. What started as a shared laugh turned into a shared life.
        </p>
        <p className="leading-8 text-base" style={{ color: "var(--charcoal)", opacity: 0.8 }}>
          After three years of adventures, misadventures, and everything in
          between, James got down on one knee at the very same café on a rainy
          Tuesday in October 2024. She said yes before he finished the question.
        </p>
      </section>

      {/* DIVIDER */}
      <Divider />

      {/* EVENT DETAILS */}
      <section id="details" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTitle label="The Details" />
          <div className="grid md:grid-cols-2 gap-8">
            <DetailCard
              icon="💐"
              title="Ceremony"
              lines={["Saturday, 20 September 2026", "11:00 AM", "The Grand Garden Chapel", "12 Rose Lane, Cape Town"]}
            />
            <DetailCard
              icon="🥂"
              title="Reception"
              lines={["Immediately following", "2:00 PM onwards", "The Vineyard Estate", "55 Oak Avenue, Stellenbosch"]}
            />
          </div>

          <div className="mt-10 text-center">
            <h3
              className="text-xl mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}
            >
              Day Programme
            </h3>
            <div className="inline-flex flex-col gap-3 text-sm text-left w-full max-w-xs">
              {[
                ["11:00 AM", "Ceremony"],
                ["12:30 PM", "Cocktail Hour"],
                ["2:00 PM", "Reception Opens"],
                ["3:00 PM", "First Dance"],
                ["3:30 PM", "Dinner is Served"],
                ["5:00 PM", "Cake Cutting"],
                ["10:00 PM", "Last Dance"],
              ].map(([time, event]) => (
                <div key={time} className="flex gap-4 items-baseline">
                  <span className="w-20 shrink-0 text-right" style={{ color: "var(--dusty-rose)", fontWeight: 400 }}>{time}</span>
                  <span style={{ color: "var(--charcoal)", opacity: 0.75 }}>{event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* GALLERY */}
      <section id="gallery" className="py-24 px-6">
        <SectionTitle label="Our Gallery" />
        <GallerySection />
      </section>

      <Divider />

      {/* RSVP */}
      <section id="rsvp" className="py-24 px-6">
        <SectionTitle label="RSVP" />
        <p className="text-center text-sm mb-10" style={{ color: "var(--deep-mauve)", opacity: 0.75 }}>
          Please respond by <strong>August 1, 2026</strong>
        </p>
        <RSVPForm guestId={guest.id} guestName={guest.name} />
      </section>

      {/* FOOTER */}
      <footer
        className="py-12 text-center text-xs tracking-widest uppercase"
        style={{ borderTop: "1px solid var(--champagne)", color: "var(--dusty-rose)", opacity: 0.6 }}
      >
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", opacity: 1, letterSpacing: "0.1em" }}>
          Sarah &amp; James
        </p>
        <p className="mt-2">20 · 09 · 2026</p>
      </footer>
    </main>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center mb-12">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-px w-10" style={{ background: "var(--blush)" }} />
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>{label}</span>
        <div className="h-px w-10" style={{ background: "var(--blush)" }} />
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-px w-full max-w-xs" style={{ background: "var(--champagne)" }} />
      <div className="mx-4 text-xl" style={{ color: "var(--blush)" }}>✦</div>
      <div className="h-px w-full max-w-xs" style={{ background: "var(--champagne)" }} />
    </div>
  );
}

function DetailCard({ icon, title, lines }: { icon: string; title: string; lines: string[] }) {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ background: "white", border: "1px solid var(--champagne)" }}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3
        className="text-xl mb-4"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}
      >
        {title}
      </h3>
      {lines.map((l, i) => (
        <p key={i} className="text-sm leading-7" style={{ color: "var(--charcoal)", opacity: 0.75 }}>
          {l}
        </p>
      ))}
    </div>
  );
}
