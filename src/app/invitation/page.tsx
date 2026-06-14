"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Countdown from "@/components/Countdown";
import GallerySection from "@/components/GallerySection";
import RSVPForm from "@/components/RSVPForm";
import MusicPlayer from "@/components/MusicPlayer";
import FloatingPetals from "@/components/FloatingPetals";

type Guest = { id: string; name: string; code: string };

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

export default function InvitationPage() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [nameTyped, setNameTyped] = useState("");
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem("guest");
    if (!raw) { router.replace("/"); return; }
    const g: Guest = JSON.parse(raw);
    setGuest(g);
    // Typewriter for first name
    const firstName = g.name.split(" ")[0];
    let i = 0;
    const t = setInterval(() => {
      i++;
      setNameTyped(firstName.slice(0, i));
      if (i >= firstName.length) clearInterval(t);
    }, 80);
    return () => clearInterval(t);
  }, [router]);

  if (!guest) return null;

  return (
    <main style={{ background: "var(--cream)" }}>
      <FloatingPetals />
      {/* Music player — replace /music/wedding-song.mp3 with your actual file */}
      <MusicPlayer src="https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Music/Christina%20Perri%20-%20A%20Thousand%20Years.mp3" />

      {/* NAV */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex justify-center gap-6 md:gap-10 py-4 text-xs tracking-[0.2em] uppercase"
        style={{ background: "rgba(250,247,242,0.88)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--champagne)", color: "var(--dusty-rose)" }}
      >
        {["Our Story", "Details", "Gallery", "RSVP"].map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(" ", "-")}`}
            className="hover:opacity-60 transition-opacity relative group">
            {s}
            <span className="absolute -bottom-1 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
              style={{ background: "var(--dusty-rose)" }} />
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #faf7f2 0%, #f5ece3 60%, #faf7f2 100%)" }}
      >
        {/* Animated blobs */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <motion.div className="absolute rounded-full"
            style={{ width: 700, height: 700, top: "-20%", left: "-15%", background: "radial-gradient(circle, rgba(232,196,184,0.35) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div className="absolute rounded-full"
            style={{ width: 600, height: 600, bottom: "-10%", right: "-10%", background: "radial-gradient(circle, rgba(201,151,122,0.22) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], x: [0, -30, 0], y: [0, -40, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </div>

        {/* Couple photo — floats on the right on desktop, below text on mobile */}
        <motion.div
          className="absolute right-0 top-0 bottom-0 w-full md:w-2/5 pointer-events-none hidden md:block"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        >
          <div className="relative h-full w-full">
            <Image
              src="https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Images/IMG_3674.JPG%20(1).jpeg"
              alt="The couple"
              fill
              className="object-cover object-top"
              style={{ maskImage: "linear-gradient(to left, rgba(0,0,0,0.9) 40%, transparent 100%)" }}
              unoptimized
              priority
            />
          </div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10 md:mr-auto md:text-left md:pl-16 md:max-w-[55%]">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
            <div className="h-px w-12" style={{ background: "var(--blush)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>
              Dear {nameTyped}<span className="opacity-60 animate-pulse">|</span>
            </span>
            <div className="h-px w-12" style={{ background: "var(--blush)" }} />
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm tracking-widest uppercase mb-4" style={{ color: "var(--sage)" }}>
            Together with their families
          </motion.p>

          <motion.h1 variants={fadeUp}
            className="text-6xl md:text-9xl leading-none mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--charcoal)" }}>
            Sarah
          </motion.h1>
          <motion.div variants={fadeUp}
            className="text-4xl md:text-6xl mb-4 leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--blush)" }}>
            &amp;
          </motion.div>
          <motion.h1 variants={fadeUp}
            className="text-6xl md:text-9xl leading-none mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "var(--charcoal)" }}>
            James
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base md:text-lg tracking-[0.2em] uppercase mb-2" style={{ color: "var(--dusty-rose)" }}>
            Request the honour of your presence
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm tracking-widest uppercase mb-12" style={{ color: "var(--deep-mauve)", opacity: 0.7 }}>
            Saturday, September 20, 2026
          </motion.p>

          <motion.div variants={fadeUp}>
            <Countdown targetDate="2026-09-20T11:00:00" />
          </motion.div>

          <motion.a variants={fadeUp} href="#our-story"
            className="mt-14 flex flex-col items-center gap-2 text-xs tracking-widest uppercase opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: "var(--charcoal)" }}>
            <span>Scroll</span>
            <motion.svg width="16" height="24" viewBox="0 0 16 24" fill="none"
              animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <path d="M8 4v16M2 14l6 6 6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.a>
        </motion.div>
      </section>

      {/* OUR STORY */}
      <section id="our-story" className="py-24 px-6 max-w-3xl mx-auto text-center">
        <SectionTitle label="Our Story" />
        <motion.blockquote
          className="text-2xl md:text-3xl italic mb-10 leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          &ldquo;I am my beloved&apos;s and my beloved is mine.&rdquo;
        </motion.blockquote>
        <motion.p className="leading-8 text-base mb-6" style={{ color: "var(--charcoal)", opacity: 0.8 }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
          Sarah and James met on a rainy Tuesday in October 2021 — she was reaching for the last umbrella at a café, he was returning the one he had borrowed. What started as a shared laugh turned into a shared life.
        </motion.p>
        <motion.p className="leading-8 text-base" style={{ color: "var(--charcoal)", opacity: 0.8 }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
          After three years of adventures, misadventures, and everything in between, James got down on one knee at the very same café on a rainy Tuesday in October 2024. She said yes before he finished the question.
        </motion.p>
      </section>

      <Divider />

      {/* EVENT DETAILS */}
      <section id="details" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTitle label="The Details" />
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: "💐", title: "Ceremony", lines: ["Saturday, 20 September 2026", "11:00 AM", "The Grand Garden Chapel", "12 Rose Lane, Cape Town"] },
              { icon: "🥂", title: "Reception", lines: ["Immediately following", "2:00 PM onwards", "The Vineyard Estate", "55 Oak Avenue, Stellenbosch"] },
            ].map((card, i) => (
              <motion.div key={card.title}
                className="rounded-2xl p-8 text-center"
                style={{ background: "white", border: "1px solid var(--champagne)" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(139,94,82,0.1)" }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>{card.title}</h3>
                {card.lines.map((l, j) => <p key={j} className="text-sm leading-7" style={{ color: "var(--charcoal)", opacity: 0.75 }}>{l}</p>)}
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-10 text-center"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
            <h3 className="text-xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>
              Day Programme
            </h3>
            <div className="inline-flex flex-col gap-3 text-sm text-left w-full max-w-xs">
              {[["11:00 AM", "Ceremony"], ["12:30 PM", "Cocktail Hour"], ["2:00 PM", "Reception Opens"],
                ["3:00 PM", "First Dance"], ["3:30 PM", "Dinner is Served"], ["5:00 PM", "Cake Cutting"], ["10:00 PM", "Last Dance"]
              ].map(([time, event], i) => (
                <motion.div key={time} className="flex gap-4 items-baseline"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                  <span className="w-20 shrink-0 text-right" style={{ color: "var(--dusty-rose)", fontWeight: 400 }}>{time}</span>
                  <span style={{ color: "var(--charcoal)", opacity: 0.75 }}>{event}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
        <motion.p className="text-center text-sm mb-10" style={{ color: "var(--deep-mauve)", opacity: 0.75 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Please respond by <strong>August 1, 2026</strong>
        </motion.p>
        <RSVPForm guestId={guest.id} guestName={guest.name} />
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-xs tracking-widest uppercase"
        style={{ borderTop: "1px solid var(--champagne)", color: "var(--dusty-rose)", opacity: 0.6 }}>
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
    <motion.div className="flex flex-col items-center mb-12"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <div className="flex items-center gap-4 mb-4">
        <div className="h-px w-10" style={{ background: "var(--blush)" }} />
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>{label}</span>
        <div className="h-px w-10" style={{ background: "var(--blush)" }} />
      </div>
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-px w-full max-w-xs" style={{ background: "var(--champagne)" }} />
      <motion.div className="mx-4 text-xl" style={{ color: "var(--blush)" }}
        animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        ✦
      </motion.div>
      <div className="h-px w-full max-w-xs" style={{ background: "var(--champagne)" }} />
    </div>
  );
}
