"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Countdown from "@/components/Countdown";
import GallerySection from "@/components/GallerySection";
import RSVPForm from "@/components/RSVPForm";

type Guest = { id: string; name: string; code: string };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

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
    <main style={{ background: "var(--cream)" }} className="text-center">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-center gap-4 md:gap-8 py-3 text-xs tracking-[0.15em] md:tracking-[0.2em] uppercase overflow-x-auto"
        style={{ background: "rgba(248,244,238,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--champagne)", color: "var(--dusty-rose)" }}>
        {["Our Story", "Details", "Dress Code", "Gallery", "RSVP"].map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(" ", "-")}`}
            className="whitespace-nowrap hover:opacity-60 transition-opacity shrink-0">
            {s}
          </a>
        ))}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://xgeyaorqdcdupbwcaqzt.supabase.co/storage/v1/object/public/Nandis%20Wedding%20Images/Images/IMG_3674.JPG%20(1).jpeg"
            alt="Marshall and Nandi"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            unoptimized
          />
          <div className="absolute inset-0" style={{ background: "rgba(18,10,6,0.54)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(10,5,2,0.6) 100%)" }} />
        </div>

        {/* Content */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="relative z-10 flex flex-col items-center px-6 pt-20 pb-12 w-full max-w-lg mx-auto">

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 md:w-12" style={{ background: "rgba(255,255,255,0.3)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.75)" }}>
              Dear {nameTyped}<span className="opacity-50 animate-pulse">|</span>
            </span>
            <div className="h-px w-8 md:w-12" style={{ background: "rgba(255,255,255,0.3)" }} />
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            Together with their families
          </motion.p>

          <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl md:text-8xl leading-none mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "white" }}>
            Marshall
          </motion.h1>
          <motion.div variants={fadeUp} className="text-3xl sm:text-5xl mb-3 leading-none italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)" }}>
            &amp;
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl md:text-8xl leading-none mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, color: "white" }}>
            Nandi
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xs md:text-sm tracking-[0.2em] uppercase mb-1"
            style={{ color: "var(--champagne)" }}>
            Request the honour of your presence
          </motion.p>
          <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase mb-10"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            Thursday · 13 August 2026 · Lakeside Events Centre
          </motion.p>

          <motion.div variants={fadeUp}>
            <Countdown targetDate="2026-08-13T11:00:00" light />
          </motion.div>

          <motion.a variants={fadeUp} href="#our-story"
            className="mt-10 flex flex-col items-center gap-2 text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.45)" }}>
            <motion.svg width="16" height="20" viewBox="0 0 16 24" fill="none"
              animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <path d="M8 4v16M2 14l6 6 6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.a>
        </motion.div>
      </section>

      {/* ── OUR STORY ── */}
      <section id="our-story" className="py-20 px-6 max-w-2xl mx-auto">
        <SectionTitle label="Our Story" />
        <motion.blockquote className="text-xl sm:text-2xl md:text-3xl italic mb-8 leading-relaxed"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          &ldquo;I have found the one whom my soul loves.&rdquo;
          <span className="block text-xs mt-3 not-italic tracking-widest uppercase" style={{ color: "var(--dusty-rose)", opacity: 0.7 }}>
            — Song of Solomon 3:4
          </span>
        </motion.blockquote>
        <motion.p className="leading-9 text-sm md:text-base" style={{ color: "var(--charcoal)", opacity: 0.8 }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Bound by love, strengthened by friendship and guided by faith, our journey has led us to this beautiful day.
          We are honoured to celebrate our union with those who have supported and cherished us along the way.
          Join us as we say &ldquo;I Do&rdquo; and begin a lifetime of love together.
        </motion.p>
      </section>

      <Divider />

      {/* ── THE DETAILS ── */}
      <section id="details" className="py-20 px-6 max-w-3xl mx-auto">
        <SectionTitle label="The Details" />
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: "💐", title: "Ceremony", lines: ["Thursday, 13 August 2026", "11:00 AM", "Lakeside Events Centre"] },
            { icon: "🥂", title: "Reception", lines: ["Immediately following", "2:00 PM onwards", "Lakeside Events Centre"] },
          ].map((card, i) => (
            <motion.div key={card.title} className="rounded-2xl p-7"
              style={{ background: "white", border: "1px solid var(--champagne)" }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(107,76,53,0.1)" }}>
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="text-xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>{card.title}</h3>
              {card.lines.map((l, j) => <p key={j} className="text-sm leading-7" style={{ color: "var(--charcoal)", opacity: 0.75 }}>{l}</p>)}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <h3 className="text-lg mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>
            Day Programme
          </h3>
          <div className="flex flex-col gap-3 text-sm items-center">
            {[
              ["11:00 AM", "Ceremony"],
              ["12:30 PM", "Cocktail Hour"],
              ["2:00 PM", "Reception Opens"],
              ["3:00 PM", "First Dance"],
              ["3:30 PM", "Dinner is Served"],
              ["5:00 PM", "Cake Cutting"],
              ["10:00 PM", "Last Dance"],
            ].map(([time, event], i) => (
              <motion.div key={time} className="flex gap-5 items-baseline w-full max-w-xs justify-center"
                initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <span className="w-20 text-right shrink-0" style={{ color: "var(--dusty-rose)", fontWeight: 400 }}>{time}</span>
                <span style={{ color: "var(--charcoal)", opacity: 0.75 }}>{event}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Divider />

      {/* ── DRESS CODE ── */}
      <section id="dress-code" className="py-20 px-6 max-w-3xl mx-auto">
        <SectionTitle label="Dress Code" />
        <motion.p className="text-sm md:text-base mb-8 leading-8" style={{ color: "var(--charcoal)", opacity: 0.8 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          We kindly invite our guests to celebrate with us in{" "}
          <em style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1em" }}>refined and elegant attire.</em>
        </motion.p>

        {/* Colour swatches */}
        <motion.div className="flex flex-wrap justify-center gap-4 mb-10"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
              <div className="w-9 h-9 rounded-full shadow-sm" style={{ background: c.hex, border: "2px solid rgba(255,255,255,0.7)" }} />
              <span className="text-xs" style={{ color: "var(--charcoal)", opacity: 0.55 }}>{c.name}</span>
            </div>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { icon: "👗", title: "Ladies", text: "Elegant floor-length gowns, sophisticated midi dresses or formal cocktail dresses in shades of gold, beige, olive, brown, champagne or soft metallic tones. Tasteful accessories and heels or dressy flats." },
            { icon: "🤵", title: "Gentlemen", text: "Black tuxedos or classic black suits paired with a white shirt, black bow tie or tie and polished black shoes." },
          ].map((d, i) => (
            <motion.div key={d.title} className="rounded-2xl p-7"
              style={{ background: "white", border: "1px solid var(--champagne)" }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(107,76,53,0.1)" }}>
              <div className="text-3xl mb-3">{d.icon}</div>
              <h3 className="text-xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>{d.title}</h3>
              <p className="text-sm leading-7" style={{ color: "var(--charcoal)", opacity: 0.75 }}>{d.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── GALLERY ── */}
      <section id="gallery" className="py-20 px-4">
        <SectionTitle label="Our Gallery" />
        <GallerySection />
      </section>

      <Divider />

      {/* ── GIFTS ── */}
      <section className="py-16 px-6 max-w-xl mx-auto">
        <SectionTitle label="Gifts" />
        <motion.p className="text-sm md:text-base leading-8" style={{ color: "var(--charcoal)", opacity: 0.8 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Your presence at our celebration is the greatest gift of all. Should you wish to honour us, a cash contribution would be greatly appreciated.
        </motion.p>
        <motion.p className="mt-4 text-sm" style={{ color: "var(--dusty-rose)" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          WhatsApp +263 77 744 7446
        </motion.p>
      </section>

      <Divider />

      {/* ── RSVP ── */}
      <section id="rsvp" className="py-20 px-6">
        <SectionTitle label="RSVP" />
        <motion.p className="text-sm mb-10" style={{ color: "var(--deep-mauve)", opacity: 0.75 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Please respond by <strong>20 July 2026</strong>
        </motion.p>
        <RSVPForm guestId={guest.id} guestName={guest.name} />
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center" style={{ borderTop: "1px solid var(--champagne)" }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "var(--dusty-rose)", letterSpacing: "0.1em" }}>
          Marshall &amp; Nandi
        </p>
        <p className="mt-1 text-xs tracking-widest uppercase" style={{ color: "var(--dusty-rose)", opacity: 0.5 }}>
          13 · 08 · 2026
        </p>
      </footer>
    </main>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <motion.div className="flex flex-col items-center mb-10"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <div className="flex items-center justify-center gap-4">
        <div className="h-px w-8" style={{ background: "var(--champagne)" }} />
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--dusty-rose)" }}>{label}</span>
        <div className="h-px w-8" style={{ background: "var(--champagne)" }} />
      </div>
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center py-3">
      <div className="h-px w-24 md:w-40" style={{ background: "var(--champagne)" }} />
      <motion.span className="mx-4 text-lg" style={{ color: "var(--gold)" }}
        animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
        ✦
      </motion.span>
      <div className="h-px w-24 md:w-40" style={{ background: "var(--champagne)" }} />
    </div>
  );
}
