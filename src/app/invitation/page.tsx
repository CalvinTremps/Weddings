"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Countdown from "@/components/Countdown";
import GallerySection from "@/components/GallerySection";
import RSVPForm from "@/components/RSVPForm";
import { supabase } from "@/lib/supabase";

type Guest = { id: string; name: string; code: string; table_number?: string | null };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

export default function InvitationPage() {
  return (
    <Suspense>
      <InvitationPageInner />
    </Suspense>
  );
}

function InvitationPageInner() {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [nameTyped, setNameTyped] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function loadGuest() {
      // Try sessionStorage first
      let raw: string | null = null;
      try { raw = sessionStorage.getItem("guest"); } catch {}

      if (raw) {
        const g: Guest = JSON.parse(raw);
        startTypewriter(g);
        return;
      }

      // Fallback: look up by code in URL param
      const urlCode = searchParams.get("code");
      if (!urlCode) { router.replace("/"); return; }

      const { data } = await supabase
        .from("guests")
        .select("id, name, code, table_number")
        .eq("code", urlCode.toUpperCase())
        .single();

      if (!data) { router.replace("/"); return; }

      const g: Guest = { id: data.id, name: data.name, code: data.code, table_number: data.table_number ?? null };
      try { sessionStorage.setItem("guest", JSON.stringify(g)); } catch {}
      startTypewriter(g);
    }

    function startTypewriter(g: Guest) {
      setGuest(g);
      const firstName = g.name.split(" ")[0];
      let i = 0;
      const t = setInterval(() => {
        i++;
        setNameTyped(firstName.slice(0, i));
        if (i >= firstName.length) clearInterval(t);
      }, 80);
    }

    loadGuest();
  }, [router, searchParams]);

  if (!guest) return null;

  return (
    <main style={{ background: "var(--cream)" }} className="text-center">

      <Nav />

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
            request the honour of your presence
          </motion.p>
          <motion.p variants={fadeUp} className="text-xs tracking-[0.15em] italic mb-1"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem" }}>
            &ldquo;The Lord has done great things for us, and we are filled with joy.&rdquo;
          </motion.p>
          <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase mb-10"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            Psalm 126:3
          </motion.p>
          <motion.p variants={fadeUp} className="text-xs tracking-widest uppercase mb-8"
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
          &ldquo;The Lord has done great things for us, and we are filled with joy.&rdquo;
          <span className="block text-xs mt-3 not-italic tracking-widest uppercase" style={{ color: "var(--dusty-rose)", opacity: 0.7 }}>
            Psalm 126:3
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

        {/* Map */}
        <motion.div className="mt-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
          <h3 className="text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>
            Venue
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--charcoal)", opacity: 0.65 }}>
            Lakeside Events Centre, Bulawayo
          </p>
          <div className="overflow-hidden rounded-2xl shadow-sm mb-4" style={{ border: "1px solid var(--champagne)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d14975.872683652626!2d28.56812535!3d-20.218643649999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x1eb54ff72b92f21f%3A0x2dab7377fa6da614!2sLakeside%20Events%20Centre%20distance%20from%20mbokodo%2C%20QF3M%2BRQ7%2C%20events%20o%2C%20Bulawayo!3m2!1d-20.2454625!2d28.484421899999997!5e0!3m2!1sen!2szw!4v1781456278694!5m2!1sen!2szw"
              width="100%"
              height="300"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lakeside Events Centre"
            />
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=-20.2454625,28.4844219&destination_place_id=0x1eb54ff72b92f21f:0x2dab7377fa6da614"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs tracking-[0.18em] uppercase transition-all hover:opacity-85"
            style={{ background: "var(--deep-mauve)", color: "white", fontFamily: "'Jost', sans-serif" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Get Directions
          </a>
        </motion.div>

        <DayProgramme />
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
        <div className="flex justify-center">
          <GallerySection />
        </div>
      </section>

      <Divider />

      {/* ── PLACES TO STAY ── */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <SectionTitle label="Places to Stay" />
        <p className="text-sm mb-10 text-center" style={{ color: "var(--charcoal)", opacity: 0.65 }}>
          We recommend these nearby hotels and lodges for your comfort during the celebration.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {HOTELS.map((hotel, i) => (
            <motion.a key={hotel.name}
              href={hotel.link} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl overflow-hidden block"
              style={{ background: "white", border: "1px solid var(--champagne)", textDecoration: "none" }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(107,76,53,0.12)" }}>
              <div className="relative w-full h-44 overflow-hidden">
                <img src={hotel.image} alt={hotel.name}
                  className="w-full h-full object-cover"
                  style={{ display: "block" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
                <p className="absolute bottom-3 left-4 text-white text-xs tracking-widest uppercase">{hotel.stars}</p>
              </div>
              <div className="p-6">
                <h3 className="text-lg mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}>
                  {hotel.name}
                </h3>
                <p className="text-xs tracking-wide mb-3 flex items-center gap-1" style={{ color: "var(--dusty-rose)", opacity: 0.8 }}>
                  <svg width="10" height="12" viewBox="0 0 12 16" fill="currentColor"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5C5.17 6.5 4.5 5.83 4.5 5S5.17 3.5 6 3.5 7.5 4.17 7.5 5 6.83 6.5 6 6.5z"/></svg>
                  {hotel.location}
                </p>
                <p className="text-xs leading-6 mb-4" style={{ color: "var(--charcoal)", opacity: 0.7 }}>{hotel.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map(a => (
                    <span key={a} className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "var(--cream)", color: "var(--deep-mauve)", border: "1px solid var(--champagne)" }}>
                      {a}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs tracking-widest uppercase" style={{ color: "var(--dusty-rose)" }}>
                  View on Google Maps →
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── THINGS TO DO ── */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <SectionTitle label="Things to Do in Bulawayo" />
        <p className="text-sm mb-10 text-center" style={{ color: "var(--charcoal)", opacity: 0.65 }}>
          Make the most of your time in the City of Kings.
        </p>
        <div className="flex flex-col gap-6">
          {ACTIVITIES.map((act, i) => (
            <motion.a key={act.name}
              href={act.link} target="_blank" rel="noopener noreferrer"
              className="rounded-2xl overflow-hidden block"
              style={{ background: "white", border: "1px solid var(--champagne)", textDecoration: "none" }}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(107,76,53,0.12)" }}>
              <div className="relative w-full h-52 overflow-hidden">
                <img src={act.image} alt={act.name}
                  className="w-full h-full object-cover"
                  style={{ display: "block" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                <h3 className="absolute bottom-4 left-5 text-white text-xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                  {act.name}
                </h3>
              </div>
              <div className="p-5">
                <p className="text-xs leading-6" style={{ color: "var(--charcoal)", opacity: 0.7 }}>{act.desc}</p>
                <p className="mt-3 text-xs tracking-widest uppercase" style={{ color: "var(--dusty-rose)" }}>
                  View on Google Maps →
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <Divider />

      {/* ── GIFTS ── */}
      <section className="py-16 px-6 max-w-xl mx-auto">
        <SectionTitle label="Gifts" />
        <motion.p className="text-sm md:text-base leading-8" style={{ color: "var(--charcoal)", opacity: 0.8 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Your presence at our celebration is the greatest gift of all. Should you wish to honour us, a cash contribution would be greatly appreciated.
        </motion.p>
        <motion.div className="mt-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <a
            href="https://wa.me/263712796921"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-sm transition-all hover:opacity-85"
            style={{ background: "#25D366", color: "white", fontFamily: "'Jost', sans-serif" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp +263 71 279 6921
          </a>
        </motion.div>
      </section>

      <Divider />

      {/* ── RSVP ── */}
      <section id="rsvp" className="py-20 px-6">
        <SectionTitle label="RSVP" />
        <motion.p className="text-sm mb-10" style={{ color: "var(--deep-mauve)", opacity: 0.75 }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Please respond by <strong>20 July 2026</strong>
        </motion.p>
        <RSVPForm guestId={guest.id} guestName={guest.name} tableNumber={guest.table_number ?? null} />
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

const HOTELS = [
  {
    name: "Rainbow Hotel Bulawayo",
    stars: "3 Star · City Centre",
    location: "Josiah Tongogara St & 10th Ave, CBD",
    desc: "A long-standing city landmark in the heart of Bulawayo, offering comfortable air-conditioned rooms and reliable amenities for both business and leisure travellers.",
    amenities: ["Restaurant & Bar", "Free Wi-Fi", "Parking", "Business Centre", "Airport Shuttle"],
    image: "https://rtgafrica.com/wp-content/uploads/2021/08/Entrance-3-scaled.jpg",
    link: "https://www.google.com/maps/search/Rainbow+Hotel+Bulawayo+Zimbabwe",
  },
  {
    name: "Holiday Inn Bulawayo",
    stars: "4 Star · Ascot",
    location: "Ascot Racecourse area, 3 km from CBD",
    desc: "Bulawayo's premier 4-star hotel set amid beautiful gardens, with polished international-standard accommodation, excellent dining, and sport facilities.",
    amenities: ["Outdoor Pool", "Multiple Restaurants", "Gym", "Tennis & Squash", "Free Wi-Fi"],
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/1b/b7/88/exterior-feature.jpg",
    link: "https://www.ihg.com/holidayinn/hotels/us/en/bulawayo/buqwo/hoteldetail",
  },
  {
    name: "Villa Thabiso Lodge",
    stars: "Boutique B&B · Hillside",
    location: "6 Warwick Rd, Hillside, 10 min from CBD",
    desc: "A charming guesthouse tucked in leafy Hillside with beautiful gardens and personalised service, a peaceful retreat away from the city bustle.",
    amenities: ["Pool", "Full Breakfast", "Free Wi-Fi", "BBQ", "Rose Garden", "Pet Friendly"],
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/cc/a5/1c/villa-thabiso.jpg",
    link: "https://villathabiso.co.zw/",
  },
  {
    name: "Sethule Lodge",
    stars: "3 Star · Hillside",
    location: "3 Old Gwanda Rd, Hillside, 5 km from CBD",
    desc: "A relaxed garden lodge nestled at the base of a small hill, ideal for guests wanting a tranquil stay close to Matobo Hills and the city.",
    amenities: ["Pool & Garden", "Restaurant & Bar", "Gym", "Parking", "Conference Centre"],
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/d1/28/12/swimming-pool.jpg",
    link: "https://www.google.com/maps/search/Sethule+Lodge+Bulawayo+Zimbabwe",
  },
];

const ACTIVITIES = [
  {
    name: "Matobo National Park",
    desc: "A UNESCO World Heritage Site just outside Bulawayo, famous for dramatic ancient granite rock formations, San Bushmen rock paintings, and white rhino tracking on foot. World's View offers breathtaking panoramic views and is an unmissable day trip.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Sunrise_Matobo_Zimbabwe.jpg",
    link: "https://www.google.com/maps/search/Matobo+National+Park+Zimbabwe",
  },
  {
    name: "Natural History Museum of Zimbabwe",
    desc: "One of the largest natural history museums in Africa, housing nine public galleries covering Zimbabwe's wildlife, geology, and human history. Highlights include one of the world's finest African mammal collections.",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Natural_History_Museum_Zimbabwe_Bulawayo.jpg",
    link: "https://www.google.com/maps/search/Natural+History+Museum+Zimbabwe+Bulawayo",
  },
  {
    name: "Khami Ruins",
    desc: "A UNESCO World Heritage Site on the outskirts of Bulawayo, the remains of a royal city that served as the capital of the Kingdom of Butua in the 15th to 17th centuries. Impressive dry-stone terraces and archaeological finds offer a rare window into Zimbabwe's ancient past.",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/ZW_Khami_Ruins.JPG",
    link: "https://www.google.com/maps/search/Khami+Ruins+Bulawayo+Zimbabwe",
  },
];

const NAV_LINKS = ["Our Story", "Details", "Dress Code", "Gallery", "RSVP"];

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop nav */}
      <nav className="fixed top-0 inset-x-0 z-50 hidden md:flex justify-center gap-8 py-3 text-xs tracking-[0.2em] uppercase"
        style={{ background: "rgba(248,244,238,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--champagne)", color: "var(--dusty-rose)" }}>
        {NAV_LINKS.map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(" ", "-")}`} className="hover:opacity-60 transition-opacity">{s}</a>
        ))}
      </nav>

      {/* Mobile nav bar */}
      <div className="fixed top-0 inset-x-0 z-50 md:hidden flex items-center justify-between px-5 py-3"
        style={{ background: "rgba(248,244,238,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--champagne)" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)", fontSize: "1rem", letterSpacing: "0.08em" }}>
          M &amp; N
        </span>
        <button onClick={() => setOpen(!open)} className="flex flex-col gap-[5px] p-1" aria-label="Menu">
          <motion.span className="block h-px w-6" style={{ background: "var(--dusty-rose)" }}
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} transition={{ duration: 0.25 }} />
          <motion.span className="block h-px w-6" style={{ background: "var(--dusty-rose)" }}
            animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.2 }} />
          <motion.span className="block h-px w-6" style={{ background: "var(--dusty-rose)" }}
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} transition={{ duration: 0.25 }} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8"
            style={{ background: "rgba(248,244,238,0.97)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_LINKS.map((s, i) => (
              <motion.a
                key={s}
                href={`#${s.toLowerCase().replace(" ", "-")}`}
                onClick={() => setOpen(false)}
                className="text-2xl tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--deep-mauve)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {s}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

const PROGRAMME = [
  { time: "11:00 AM", title: "Ceremony Begins",      desc: "The vows. The \"I do.\" The beginning of forever.",   icon: "💍" },
  { time: "12:30 PM", title: "Cocktail Hour",         desc: "Sip, mingle, and celebrate the newlyweds.",          icon: "🥂" },
  { time: "2:00 PM",  title: "Reception Opens",       desc: "Be seated and ready, the festivities await.",       icon: "✨" },
  { time: "3:00 PM",  title: "Food is Served",         desc: "A feast crafted with love, for the people we love.", icon: "🍽️" },
  { time: "3:30 PM",  title: "Grand Entrance",        desc: "The Bride & Groom arrive to a roaring welcome.",     icon: "👑" },
  { time: "4:00 PM",  title: "Speeches & Toasts",     desc: "Words of love, laughter, and heartfelt wishes.",     icon: "🎤" },
  { time: "5:00 PM",  title: "First Dance",           desc: "Marshall & Nandi take the floor as one.",            icon: "💃" },
  { time: "5:30 PM",  title: "Cake Cutting",          desc: "A sweet moment, the first shared slice.",           icon: "🎂" },
  { time: "6:00 PM",  title: "Until We Meet Again",   desc: "Thank you for sharing this day with us.",            icon: "🌙" },
];

function DayProgramme() {
  return (
    <div className="mt-14">
      <SectionTitle label="Day Programme" />
      <div className="relative max-w-xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
          style={{ background: "linear-gradient(to bottom, transparent, var(--champagne) 8%, var(--champagne) 92%, transparent)" }} />

        <div className="flex flex-col gap-0">
          {PROGRAMME.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div key={item.time}
                className="relative flex items-center gap-0"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: "easeOut" }}>

                {/* Left side */}
                <div className={`flex-1 py-5 ${isLeft ? "pr-8 text-right" : "pr-8 opacity-0 pointer-events-none"}`}>
                  {isLeft && (
                    <>
                      <p className="text-xs tracking-[0.18em] uppercase mb-1" style={{ color: "var(--dusty-rose)" }}>{item.time}</p>
                      <p className="text-base leading-tight mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "var(--deep-mauve)" }}>{item.title}</p>
                      <p className="text-xs leading-5" style={{ color: "var(--charcoal)", opacity: 0.55 }}>{item.desc}</p>
                    </>
                  )}
                </div>

                {/* Centre dot */}
                <div className="relative z-10 flex-shrink-0 flex items-center justify-center"
                  style={{ width: 44, height: 44 }}>
                  <motion.div className="flex items-center justify-center rounded-full shadow-md text-base"
                    style={{ width: 40, height: 40, background: "white", border: "1.5px solid var(--champagne)" }}
                    whileInView={{ scale: [0.6, 1.12, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07 + 0.1 }}>
                    {item.icon}
                  </motion.div>
                </div>

                {/* Right side */}
                <div className={`flex-1 py-5 ${!isLeft ? "pl-8 text-left" : "pl-8 opacity-0 pointer-events-none"}`}>
                  {!isLeft && (
                    <>
                      <p className="text-xs tracking-[0.18em] uppercase mb-1" style={{ color: "var(--dusty-rose)" }}>{item.time}</p>
                      <p className="text-base leading-tight mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "var(--deep-mauve)" }}>{item.title}</p>
                      <p className="text-xs leading-5" style={{ color: "var(--charcoal)", opacity: 0.55 }}>{item.desc}</p>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
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
