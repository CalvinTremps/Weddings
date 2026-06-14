"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
      <MusicPlayer src="https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Music/Christina%20Perri%20-%20A%20Thousand%20Years.mp3" />

      {/* NAV */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex justify-center gap-6 md:gap-10 py-4 text-xs tracking-[0.2em] uppercase"
        style={{ background: "rgba(248,244,238,0.9)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--champagne)", color: "var(--dusty-rose)" }}
      >
        {["Our Story", "Details", "Dress Code", "Gallery", "RSVP"].map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(" ", "-")}`}
            className="hover:opacity-60 transition-opacity relative group">
            {s}
            <span className="absolute -bottom-1 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
              style={{ background: "var(--dusty-rose)" }} />
          </a>
        ))}
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative overflow-hidden">
        {/* Full-screen background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Images/IMG_3674.JPG%20(1).jpeg')",
            zIndex: 0,
          }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(20,12,10,0.52)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 35%, rgba(10,6,4,0.55) 100%)" }} />
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
            <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.35)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.8)" }}>
              Dear {nameTyped}<span className="opacity-60 animate-pulse">|</span>
            </span>
            <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.35)" }} />
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm tracking-widest uppercase mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
            Together with their families
          </motion.p>

          <motion.h1 variants={fadeUp}
            className="text-6xl md:text-9xl leading-none mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "white" }}>
            Marshall
          </motion.h1>
          <motion.div variants={fadeUp}
            className="text-4xl md:text-6xl mb-4 leading-none"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "var(--gold)" }}>
            &amp;
          </motion.div>
          <motion.h1 variants={fadeUp}
            className="text-6xl md:text-9xl leading-none mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "white" }}>
            Nandi
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base md:text-lg tracking-[0.2em] uppercase mb-2" style={{ color: "var(--champagne)" }}>
            Request the honour of your presence
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm tracking-widest uppercase mb-12" style={{ color: "rgba(255,255,255,0.55)" }}>
            Thursday, 13 August 2026
          </motion.p>

          <motion.div variants={fadeUp}>
            <Countdown targetDate="2026-08-13T11:00:00" light />
          </motion.div>

          <motion.a variants={fadeUp} href="#our-story"
            className="mt-14 flex flex-col items-center gap-2 text-xs tracking-widest uppercase opacity-50 hover:opacity-80 transition-opacity"
            style={{ color: "white" }}>
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
          &ldquo;I have found the one whom my soul loves.&rdquo;
          <span className="block text-sm mt-3 not-italic tracking-widest uppercase" style={{ color: "var(--dusty-rose)", opacity: 0.7 }}>
            — Song of Solomon 3:4
          </span>
        </motion.blockquote>
        <motion.p className="leading-9 text-base" style={{ color: "var(--charcoal)", opacity: 0.8 }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
          Bound by love, strengthened by friendship and guided by faith, our journey has led us to this beautiful day. We are honoured to celebrate our union with those who have supported and cherished us along the way. Join us as we say &ldquo;I Do&rdquo; and begin a lifetime of love together.
        </motion.p>
      </section>

      <Divider />

      {/* EVENT DETAILS */}
      <section id="details" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTitle label="The Details" />
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: "💐", title: "Ceremony", lines: ["Thursday, 13 August 2026", "11:00 AM", "Lakeside Events Centre"] },
              { icon: "🥂", title: "Reception", lines: ["Immediately following", "2:00 PM onwards", "Lakeside Events Centre"] },
            ].map((card, i) => (
              <motion.div key={card.title}
                className="rounded-2xl p-8 text-center"
                style={{ background: "white", border: "1px solid var(--champagne)" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(107,76,53,0.1)" }}
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
              {[
                ["11:00 AM", "Ceremony"],
                ["12:30 PM", "Cocktail Hour"],
                ["2:00 PM", "Reception Opens"],
                ["3:00 PM", "First Dance"],
                ["3:30 PM", "Dinner is Served"],
                ["5:00 PM", "Cake Cutting"],
                ["10:00 PM", "Last Dance"],
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

      {/* DRESS CODE */}
      <section id="dress-code" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <SectionTitle label="Dress Code" />
          <motion.p className="text-center text-base mb-10 leading-8" style={{ color: "var(--charcoal)", opacity: 0.8 }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            We kindly invite our guests to celebrate with us in <em style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1em" }}>refined and elegant attire.</em>
          </motion.p>

          {/* Colour palette chips */}
          <motion.div className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {[
              { name: "Champagne", hex: "#d4aa70" },
              { name: "Espresso", hex: "#4a2c17" },
              { name: "Rosy Beige", hex: "#c9a08a" },
              { name: "Beige", hex: "#d9c4a8" },
              { name: "Rustic Brown", hex: "#7a4f35" },
              { name: "Olive", hex: "#7a8c5e" },
              { name: "Soft Gold", hex: "#c9a84c" },
            ].map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full shadow-sm" style={{ background: c.hex, border: "2px solid rgba(255,255,255,0.6)" }} />
                <span className="text-xs" style={{ color: "var(--charcoal)", opacity: 0.6 }}>{c.name}</span>
              </div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "👗",
                title: "Ladies",
                text: "Elegant floor-length gowns, sophisticated midi dresses or formal cocktail dresses in shades of gold, beige, olive, brown, champagne or soft metallic tones. Complete your look with tasteful accessories and heels or dressy flats.",
              },
              {
                icon: "🤵",
                title: "Gentlemen",
                text: "Black tuxedos or classic black suits paired with a white shirt, black bow tie or tie and polished black shoes.",
              },
            ].map((d, i) => (
              <motion.div key={d.title}
                className="rounded-2xl p-8 text-center"
                style={{ background: "white", border: "1px solid var(--champagne)" }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(107,76,53,0.1)" }}
              >
                <div className="text-3xl mb-3">{d.icon}</div>
                <h3 className="text-xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>{d.title}</h3>
                <p className="text-sm leading-7" style={{ color: "var(--charcoal)", opacity: 0.75 }}>{d.text}</p>
              </motion.div>
            ))}
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

      {/* GIFTS */}
      <section className="py-16 px-6 max-w-xl mx-auto text-center">
        <SectionTitle label="Gifts" />
        <motion.p className="text-base leading-8" style={{ color: "var(--charcoal)", opacity: 0.8 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Your presence at our celebration is the greatest gift of all. Should you wish to honour us with a gift, a cash contribution would be greatly appreciated.
        </motion.p>
        <motion.p className="mt-4 text-sm" style={{ color: "var(--dusty-rose)" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          For enquiries: WhatsApp +263 77 744 7446
        </motion.p>
      </section>

      <Divider />

      {/* RSVP */}
      <section id="rsvp" className="py-24 px-6">
        <SectionTitle label="RSVP" />
        <motion.p className="text-center text-sm mb-10" style={{ color: "var(--deep-mauve)", opacity: 0.75 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Please respond by <strong>20 July 2026</strong>
        </motion.p>
        <RSVPForm guestId={guest.id} guestName={guest.name} />
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-xs tracking-widest uppercase"
        style={{ borderTop: "1px solid var(--champagne)", color: "var(--dusty-rose)", opacity: 0.6 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", opacity: 1, letterSpacing: "0.1em" }}>
          Marshall &amp; Nandi
        </p>
        <p className="mt-2">13 · 08 · 2026</p>
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
        <div className="h-px w-10" style={{ background: "var(--champagne)" }} />
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>{label}</span>
        <div className="h-px w-10" style={{ background: "var(--champagne)" }} />
      </div>
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-px w-full max-w-xs" style={{ background: "var(--champagne)" }} />
      <motion.div className="mx-4 text-xl" style={{ color: "var(--gold)" }}
        animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        ✦
      </motion.div>
      <div className="h-px w-full max-w-xs" style={{ background: "var(--champagne)" }} />
    </div>
  );
}
