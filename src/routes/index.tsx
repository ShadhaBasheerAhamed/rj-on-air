import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import heroImg from "@/assets/hero-rj.jpg";
import micImg from "@/assets/mic-glow.jpg";
import vinylImg from "@/assets/vinyl.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import { Equalizer, WaveLine } from "@/components/portfolio/Equalizer";
import { useAudio } from "@/lib/AudioContext";
import { StickyPlayer } from "@/components/portfolio/StickyPlayer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shadha Basheer Ahamed — Aspiring Radio Jockey | Voice Artist" },
      { name: "description", content: "Tune into the portfolio of Shadha Basheer Ahamed — aspiring RJ, voice artist, storyteller, and public speaker from Tamil Nadu, India." },
      { property: "og:title", content: "Shadha Basheer Ahamed — Aspiring Radio Jockey" },
      { property: "og:description", content: "Every dream has a frequency. This is mine. Welcome." },
    ],
  }),
  component: Index,
});

/* ---------- Icons (inline SVGs) ---------- */
const I = {
  play: (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z"/></svg>),
  pause: (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>),
  mic: (p: any) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8"/></svg>),
  radio: (p: any) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9M7.8 16.2A5.9 5.9 0 0 1 7.8 7.8M16.2 7.8a5.9 5.9 0 0 1 0 8.4M19.1 4.9c3.9 3.9 3.9 10.2 0 14.2"/><circle cx="12" cy="12" r="2"/></svg>),
  phone: (p: any) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.8 2z"/></svg>),
  mail: (p: any) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>),
  ig: (p: any) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>),
  li: (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.98 3.5A2.5 2.5 0 1 1 2.5 6 2.5 2.5 0 0 1 4.98 3.5zM3 8.98h4V21H3zM9 8.98h3.8v1.64h.05a4.17 4.17 0 0 1 3.76-2.06c4 0 4.74 2.64 4.74 6.07V21h-4v-5.6c0-1.34 0-3.06-1.87-3.06s-2.15 1.46-2.15 2.96V21H9z"/></svg>),
  yt: (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/></svg>),
  wa: (p: any) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.2 1.2-1.7 1.3-.4 0-1 .1-1.6-.1a13 13 0 0 1-4-1.8 15 15 0 0 1-4-4.4 4.8 4.8 0 0 1-1-2.5 2.7 2.7 0 0 1 .8-2c.2-.3.5-.3.7-.3h.5c.2 0 .4-.1.7.5l1 2.3c.1.2.1.4 0 .5l-.4.5-.4.4c-.1.1-.3.3-.1.6.2.4.9 1.5 2 2.5 1.4 1.2 2.5 1.6 2.9 1.8.3.1.5 0 .7-.2l.9-1.1c.2-.3.4-.2.7-.1l2.2 1c.3.2.5.3.6.4s.1.7-.1 1.2z"/></svg>),
  download: (p: any) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>),
};

/* ---------- Data ---------- */
const HERO_ROLES = ["Aspiring Radio Jockey", "Voice Artist", "Story Teller", "Public Speaker", "Host"];

const VOICE_CARDS = [
  { title: "Morning Show", durationStr: "2:14", desc: "Bright energy to start the day with warmth and wit.", tint: "from-primary/30", audioSrc: "/audio/morning-show.ogg" },
  { title: "Evening Show", durationStr: "3:02", desc: "Calm, reflective tones for the golden hour.", tint: "from-amber-500/25", audioSrc: "/audio/evening-show.ogg" },
  { title: "Motivational Talk", durationStr: "1:48", desc: "Words that push you one small step further.", tint: "from-primary/25", audioSrc: "/audio/motivational-talk.ogg" },
  { title: "Storytelling", durationStr: "4:30", desc: "Immersive narration that pulls you into every scene.", tint: "from-fuchsia-500/20", audioSrc: "/audio/storytelling.ogg" },
  { title: "Brand Advertisement", durationStr: "0:35", desc: "Crisp, persuasive voice-over for brand spots.", tint: "from-amber-400/25", audioSrc: "/audio/brand-advertisement.ogg" },
  { title: "RJ Introduction", durationStr: "0:52", desc: "The signature opener — Vanakkam, this is Shadha.", tint: "from-primary/30", audioSrc: "/audio/rj-introduction.ogg" },
  { title: "Interview Style", durationStr: "3:18", desc: "Conversational, curious, listener-first.", tint: "from-primary/20", audioSrc: "/audio/interview-style.ogg" },
];

const EXPERIENCE = [
  { company: "EvalBench Technologies", role: "Intern", points: ["Website Development", "Cookie Monitoring", "Website Testing"] },
  { company: "HIG AI Automation", role: "Intern · 6 months", points: ["Website Development", "Social Media Management", "Digital Marketing", "Client Handling", "Poster Designing", "Content Creation"] },
  { company: "Webberax Solutions", role: "Marketing Trainee", points: ["Email Marketing", "Business Networking", "Client Communication"] },
];

const SPEAKING = ["Department Symposium Host", "College Day MC", "Fresher's Day Host", "Technical Quiz Host", "Youth Red Cross Event Host", "AI Events", "Student Trainer", "International Presentation — Malaysia"];

const ACHIEVEMENTS = ["Winner — English Elocution", "Winner — Tamil Elocution", "Winner — Extempore Speaking", "Debate Speaker", "Patti Mandram Speaker", "Voice Over Artist for Brands", "Public Speaker", "Event Host", "Student Trainer"];

const TIMELINE = [
  { year: "The spark", title: "Childhood Dream", desc: "While others heard songs, I heard the voices in between." },
  { year: "School", title: "School Competitions", desc: "First mics, first stages, first standing ovations." },
  { year: "College", title: "College Events", desc: "MC for symposiums, fests, and department days." },
  { year: "Global", title: "Malaysia Program", desc: "International presentation — my voice on a bigger stage." },
  { year: "Career", title: "Corporate Experience", desc: "IT + Digital Marketing sharpened craft and confidence." },
  { year: "Studio", title: "Voice Over Projects", desc: "Brand spots, narration, RJ demos." },
  { year: "Next", title: "Future Radio Jockey", desc: "Turning a lifelong passion into a profession." },
];

const SKILLS = ["Communication", "Anchoring", "Public Speaking", "Voice Modulation", "Storytelling", "Content Creation", "Digital Marketing", "Website Development", "Leadership", "Teamwork", "Event Hosting", "Client Communication"];

const VIDEOS: { title: string; cat: string; url: string }[] = [
  { title: "College Day Hosting", cat: "Hosting", url: "https://youtube.com/shorts/oeCyhIEcG0w" },
  { title: "Brand Voice Over Reel", cat: "Voice Over", url: "https://www.instagram.com/reel/DT2fw6OE6JH/" },
  { title: "Reel — RJ Style", cat: "Reels", url: "https://youtube.com/shorts/-YtD7QbrYCg" },
  { title: "YouTube — Storytelling", cat: "YouTube", url: "https://youtu.be/t2zNXzikC0Y" },
];

function getEmbed(url: string): { src: string; kind: "youtube" | "instagram" } | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? { src: `https://www.youtube.com/embed/${id}`, kind: "youtube" } : null;
    }
    if (host.endsWith("youtube.com")) {
      const shorts = u.pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shorts) return { src: `https://www.youtube.com/embed/${shorts[1]}`, kind: "youtube" };
      const id = u.searchParams.get("v");
      if (id) return { src: `https://www.youtube.com/embed/${id}`, kind: "youtube" };
      const embed = u.pathname.match(/^\/embed\/([^/?#]+)/);
      if (embed) return { src: `https://www.youtube.com/embed/${embed[1]}`, kind: "youtube" };
    }
    if (host.endsWith("instagram.com")) {
      const m = u.pathname.match(/\/(reel|p|tv)\/([^/?#]+)/);
      if (m) return { src: `https://www.instagram.com/${m[1]}/${m[2]}/embed/`, kind: "instagram" };
    }
  } catch {}
  return null;
}


const GALLERY = [
  { src: g1, label: "On Stage" },
  { src: g2, label: "Microphone Moments" },
  { src: g3, label: "Awards" },
  { src: g4, label: "Malaysia · International" },
  { src: heroImg, label: "In the Studio" },
  { src: micImg, label: "Behind the Scenes" },
];

/* ---------- Small components ---------- */

function FloatingNotes() {
  const notes = ["♪", "♫", "♩", "♬"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-primary/40 text-2xl"
          style={{
            left: `${(i * 73) % 100}%`,
            bottom: `-40px`,
            animation: `float-note ${8 + (i % 5) * 2}s linear ${i * 0.9}s infinite`,
            textShadow: "0 0 12px oklch(0.63 0.25 25 / 0.6)",
          }}
        >
          {notes[i % notes.length]}
        </span>
      ))}
    </div>
  );
}

function OnAirSign({ live }: { live: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-display text-xs font-bold tracking-[0.25em] ${live ? "border-primary bg-primary/10 text-primary animate-onair" : "border-border text-muted-foreground"}`}>
      <span className={`h-2 w-2 rounded-full ${live ? "bg-primary" : "bg-muted-foreground/50"}`} />
      ON AIR
    </div>
  );
}

function RotatingRoles() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % HERO_ROLES.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="h-[1.4em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="block gold-text font-display font-bold"
        >
          {HERO_ROLES[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function TypedHello() {
  const full = "Vanakkam!";
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= full.length) return;
    const t = setTimeout(() => setN(n + 1), 110);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <span className="neon-text">
      {full.slice(0, n)}
      <span className="inline-block w-[3px] h-[0.9em] translate-y-1 bg-primary ml-1 animate-pulse" />
    </span>
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      className="pointer-events-none fixed z-[1] hidden md:block"
      style={{
        left: pos.x - 200,
        top: pos.y - 200,
        width: 400,
        height: 400,
        background: "radial-gradient(circle, oklch(0.63 0.25 25 / 0.18), transparent 60%)",
        transition: "left 0.15s ease-out, top 0.15s ease-out",
      }}
    />
  );
}

function Section({ id, eyebrow, title, children, sub }: any) {
  return (
    <section id={id} className="relative py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-semibold">{eyebrow}</span>
            <Equalizer bars={4} className="h-4" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold leading-[1.05]">{title}</h2>
          {sub && <p className="mt-4 max-w-2xl text-muted-foreground">{sub}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

/* ---------- Fake Radio Console (Fun Section) ---------- */
function RadioConsole() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [isConsoleLive, setIsConsoleLive] = useState(false);

  // We consider the console "live" if it's manually toggled on, or if any track is playing.
  const live = isConsoleLive || isPlaying;

  const toggleAir = () => {
    if (live) {
      if (isPlaying) togglePlay();
      setIsConsoleLive(false);
    } else {
      setIsConsoleLive(true);
    }
  };

  const playFunTrack = (btn: { l: string; k: string; src: string }) => {
    setIsConsoleLive(true);
    playTrack({
      title: btn.k,
      durationStr: "0:00",
      desc: btn.l,
      tint: "from-primary/30",
      audioSrc: btn.src,
      index: 99
    });
  };

  const nowPlayingLabel = isPlaying && currentTrack ? currentTrack.title : null;

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-10 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-center relative">
        {/* Left: console */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="font-display text-sm tracking-[0.4em] text-muted-foreground">STUDIO 92.7 FM</div>
            <OnAirSign live={live} />
          </div>

          <button
            onClick={toggleAir}
            className={`group relative w-full rounded-2xl border-2 py-8 font-display font-black text-3xl tracking-[0.3em] transition-all ${
              live ? "border-primary bg-primary text-primary-foreground glow-red animate-onair" : "border-border bg-card hover:border-primary/60"
            }`}
          >
            ON AIR
          </button>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { l: "Play My Voice", k: "🎙 Signature demo", src: "/audio/signature-demo.ogg" },
              { l: "Welcome Message", k: "👋 Vanakkam!", src: "/audio/welcome-message.ogg" },
              { l: "Listen to Demo", k: "🎧 Demo reel", src: "/audio/demo-reel.ogg" },
            ].map((b) => (
              <button
                key={b.l}
                onClick={() => playFunTrack(b)}
                className="glass rounded-xl p-3 text-xs md:text-sm text-left hover:border-primary/50 hover:bg-primary/10 transition-all"
              >
                <div className="font-semibold">{b.l}</div>
                <div className="text-muted-foreground text-[10px] mt-1">Tap to play</div>
              </button>
            ))}
          </div>

          {/* Fake knobs */}
          <div className="mt-6 flex gap-6 items-center">
            {["VOL", "BASS", "TONE"].map((k, i) => (
              <div key={k} className="flex flex-col items-center gap-2">
                <div className="relative w-14 h-14 rounded-full border-2 border-border bg-card grid place-items-center glow-gold">
                  <div
                    className="absolute w-0.5 h-6 bg-gold origin-bottom"
                    style={{ transform: `rotate(${-120 + i * 40}deg) translateY(-8px)` }}
                  />
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
                <div className="text-[10px] tracking-widest text-muted-foreground">{k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: now playing / vinyl */}
        <div className="relative">
          <div className="relative aspect-square max-w-sm mx-auto">
            <img
              src={vinylImg}
              alt="Vinyl"
              className={`absolute inset-0 w-full h-full object-cover rounded-full border-4 border-border ${live ? "animate-vinyl" : ""}`}
              width={512} height={512} loading="lazy"
            />
            <div className="absolute inset-[35%] rounded-full bg-primary/90 grid place-items-center glow-red">
              <I.radio className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <div className="mt-6 glass rounded-xl p-4">
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground">NOW PLAYING</div>
            <div className="mt-1 font-display font-bold text-lg min-h-[1.6em]">
              {nowPlayingLabel ?? (live ? "Live from the studio…" : "— Off air —")}
            </div>
            <div className="mt-3">
              {isPlaying ? <WaveLine className="w-full h-8" /> : <div className="h-8 w-full bg-border/20 rounded-md" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Voice card with real audio play ---------- */
function VoiceCard({ v, index }: { v: (typeof VOICE_CARDS)[number]; index: number }) {
  const { currentTrack, isPlaying, playTrack, progress, duration } = useAudio();
  const isThisTrackPlaying = currentTrack?.audioSrc === v.audioSrc && isPlaying;
  const isThisTrackActive = currentTrack?.audioSrc === v.audioSrc;
  
  const [localDuration, setLocalDuration] = useState<string>(v.durationStr);

  useEffect(() => {
    if (v.audioSrc) {
      const audio = new Audio(v.audioSrc);
      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
          const mins = Math.floor(audio.duration / 60);
          const secs = Math.floor(audio.duration % 60);
          setLocalDuration(`${mins}:${secs.toString().padStart(2, '0')}`);
        }
      });
    }
  }, [v.audioSrc]);

  const handlePlayClick = () => {
    playTrack({
      ...v,
      durationStr: localDuration,
      index
    }, VOICE_CARDS.map((vc, i) => ({ ...vc, index: i })));
  };

  const progressPercent = isThisTrackActive && duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`glass rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 ${isThisTrackPlaying ? 'ring-2 ring-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]' : 'hover:border-primary/50'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${v.tint} to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${isThisTrackPlaying ? 'opacity-100' : ''}`} />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] tracking-[0.3em] text-primary font-semibold">TRACK {(index + 1).toString().padStart(2, '0')}</div>
            <h3 className="mt-1 font-display font-bold text-xl">{v.title}</h3>
          </div>
          <button
            onClick={handlePlayClick}
            className={`shrink-0 h-12 w-12 rounded-full grid place-items-center border-2 transition-all ${
              isThisTrackPlaying ? "bg-primary border-primary text-primary-foreground glow-red" : "border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
            aria-label={isThisTrackPlaying ? "Pause" : "Play"}
          >
            {isThisTrackPlaying ? <I.pause className="w-5 h-5" /> : <I.play className="w-5 h-5 translate-x-[1px]" />}
          </button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{v.desc}</p>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex-1 mr-4">
            {isThisTrackPlaying ? (
              <div className="flex items-center h-10 gap-2">
                <Equalizer bars={3} className="h-4" />
                <div className="h-1 flex-1 rounded-full bg-border overflow-hidden relative">
                  <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              <div className="h-1 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-primary/40 rounded-full" style={{ width: isThisTrackActive ? `${progressPercent}%` : '0%' }} />
              </div>
            )}
          </div>
          <span className="text-xs font-mono text-muted-foreground">{localDuration}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Main page ---------- */
function Index() {
  const [intro, setIntro] = useState(true);
  const { playTrack } = useAudio();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleTuneIn = () => {
    setIntro(false);
    playTrack({
      title: "🎙 Welcome",
      durationStr: "0:00",
      desc: "Welcome to my portfolio",
      tint: "from-primary/30",
      audioSrc: "/audio/introduction.ogg",
      index: 999
    });
  };

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      <CursorGlow />

      {/* Intro overlay */}
      <AnimatePresence>
        {intro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 bg-background grid place-items-center px-6"
          >
            <div className="max-w-2xl text-center">
              <div className="flex justify-center mb-6"><OnAirSign live /></div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-xl md:text-3xl leading-relaxed"
              >
                <span className="neon-text">🎙 "Vanakkam!</span> This is Shadha Basheer, and you're tuned into my journey.
                Every dream has a frequency — <span className="gold-text">this is mine.</span> Welcome! "
              </motion.p>
              <div className="mt-8"><WaveLine className="w-full h-14" /></div>
              
              <button
                onClick={handleTuneIn}
                className="mt-8 px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold tracking-[0.2em] glow-red hover:scale-105 transition"
              >
                TUNE IN 🎙
              </button>
              
              <div className="mt-6">
                <button
                  onClick={() => setIntro(false)}
                  className="text-[10px] tracking-[0.3em] text-muted-foreground hover:text-primary transition"
                >
                  SKIP INTRO ↓
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-40 glass-strong bg-background/80 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display font-bold">
            <span className="h-8 w-8 rounded-full bg-primary grid place-items-center glow-red"><I.mic className="w-4 h-4 text-primary-foreground" /></span>
            <span>Shadha<span className="text-primary">.FM</span></span>
          </a>
          <nav className="hidden md:flex glass rounded-full px-2 py-1.5 text-sm bg-black/20">
            {[["Studio", "#about"], ["Voice", "#voice"], ["Timeline", "#timeline"], ["Gallery", "#gallery"], ["On Air", "#console"], ["Contact", "#contact"]].map(([l, h]) => (
              <a key={h} href={h} className="px-4 py-1.5 rounded-full hover:bg-primary/20 hover:text-primary transition">{l}</a>
            ))}
          </nav>
          <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-red">
            <I.radio className="w-4 h-4" /> Book Me
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" ref={heroRef} className="relative min-h-screen flex items-center px-6 pt-28 pb-16 overflow-hidden">
        <FloatingNotes />
        {/* pulsing rings */}
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 hidden lg:block">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-primary/30"
              style={{
                width: 200 + i * 120,
                height: 200 + i * 120,
                left: -(100 + i * 60),
                top: -(100 + i * 60),
                animation: `wave-pulse ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center relative w-full">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-6">
              <OnAirSign live />
              <span className="text-xs tracking-[0.3em] text-muted-foreground">TAMIL NADU · INDIA · 92.7 MHz</span>
            </motion.div>

            <h1 className="font-display font-black text-5xl md:text-7xl xl:text-8xl leading-[0.95]">
              <span className="block"><TypedHello /></span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="block mt-2">
                I'm <span className="gold-text">Shadha</span>
              </motion.span>
              <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="block">
                Basheer Ahamed.
              </motion.span>
            </h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} className="mt-6 text-2xl md:text-4xl">
              <RotatingRoles />
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} className="mt-6 max-w-lg text-muted-foreground text-lg">
              Turning a lifelong love of radio into a career. Voice, warmth, and stories that stay with you long after the song ends.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} className="mt-8 flex flex-wrap gap-3">
              <a href="#voice" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground glow-red hover:scale-105 transition">
                <I.mic className="w-4 h-4" /> Listen to My Voice
              </a>
              <a href="/Shadha_Basheer_Ahamed_rj_resume.pdf" download="Shadha_Basheer_Ahamed_rj_resume.pdf" className="inline-flex items-center gap-2 rounded-full border border-gold/50 text-gold px-6 py-3 font-medium glass hover:bg-gold/10 transition">
                <I.download className="w-4 h-4" /> View Resume
              </a>
              <a href="#timeline" className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium glass hover:border-primary/50 transition">
                <I.play className="w-4 h-4" /> Watch My Journey
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="mt-10">
              <WaveLine className="w-full max-w-md h-10" />
            </motion.div>
          </div>

          {/* Portrait */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/30 via-transparent to-gold/20 blur-2xl" />
            <div className="relative rounded-[2rem] overflow-hidden glass-strong">
              <img src={heroImg} alt="Shadha Basheer Ahamed in the studio" className="w-full aspect-[4/5] object-cover" width={1024} height={1280} />
              <div className="absolute top-4 left-4"><OnAirSign live /></div>
              <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary grid place-items-center glow-red animate-wave-pulse">
                  <I.mic className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-[0.3em] text-muted-foreground">LIVE</div>
                  <div className="text-sm font-semibold truncate">Shadha's Journey — Episode 01</div>
                </div>
                <Equalizer bars={5} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <Section id="about" eyebrow="The Studio Story" title="A voice that grew up with radio." sub="From listening to loving. From loving to living it.">
        <div className="grid md:grid-cols-[1.3fr_1fr] gap-10 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8 md:p-10 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              I'm <span className="text-foreground font-semibold">Shadha Basheer Ahamed</span>, an aspiring Radio Jockey from <span className="text-foreground">Tamil Nadu, India</span>.
              Since childhood, while everyone else listened to the songs, I was quietly falling in love with the voices <em>between</em> them.
            </p>
            <p>
              Those voices could make a stranger laugh at 6 a.m., comfort someone driving home late at night, and turn any ordinary day into a small celebration.
              That was the magic I wanted to be part of.
            </p>
            <p>
              I built my career in <span className="text-foreground">Information Technology</span> and <span className="text-foreground">Digital Marketing</span> — but my heart has always been tuned to radio.
              This portfolio is me finally turning up the volume on that dream.
            </p>
            <div className="pt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="gold-text font-display italic">— Every dream has a frequency.</span>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {[
              { k: "7+", v: "Voice Demos" },
              { k: "3", v: "Companies Worked With" },
              { k: "1", v: "International Presentation" },
              { k: "∞", v: "Stories to tell" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-2xl p-6 flex items-center justify-between">
                <div className="font-display text-4xl font-black neon-text">{s.k}</div>
                <div className="text-sm text-muted-foreground text-right">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* VOICE STUDIO */}
      <Section id="voice" eyebrow="Voice Studio" title="Pick a track. Press play." sub="Seven signature styles — from morning-show energy to late-night storytelling.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {VOICE_CARDS.map((v, i) => <VoiceCard key={v.title} v={v} index={i} />)}
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" eyebrow="Professional Experience" title="Behind the mic, off the mic." sub="Building brands, shipping websites, running campaigns — the discipline that sharpens the voice.">
        <div className="grid md:grid-cols-3 gap-5">
          {EXPERIENCE.map((e, i) => (
            <motion.div key={e.company} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-6 hover:border-primary/50 transition">
              <div className="text-[10px] tracking-[0.3em] text-primary font-semibold">FREQ 0{i + 1}</div>
              <h3 className="mt-2 font-display font-bold text-xl">{e.company}</h3>
              <div className="text-sm gold-text mt-1">{e.role}</div>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {e.points.map((p) => (
                  <li key={p} className="flex gap-2"><span className="text-primary">▸</span>{p}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SPEAKING + ACHIEVEMENTS */}
      <Section id="speaking" eyebrow="Public Speaking & Achievements" title="On stage, at the mic, in two languages." sub="College events, competitions, corporate stages — hosted in both Tamil and English.">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-8">
            <h3 className="font-display font-bold text-2xl mb-5 flex items-center gap-2"><I.mic className="w-5 h-5 text-primary" /> Hosting Experience</h3>
            <div className="flex flex-wrap gap-2">
              {SPEAKING.map((s) => (
                <span key={s} className="rounded-full border border-border bg-card/60 px-3 py-1.5 text-sm hover:border-primary/60 hover:text-primary transition">{s}</span>
              ))}
            </div>
          </div>
          <div className="glass rounded-2xl p-8">
            <h3 className="font-display font-bold text-2xl mb-5 flex items-center gap-2"><span className="gold-text">🏆</span> Achievements</h3>
            <ul className="space-y-2">
              {ACHIEVEMENTS.map((a) => (
                <li key={a} className="flex items-center gap-3 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* TIMELINE */}
      <Section id="timeline" eyebrow="Journey" title="From childhood dream to future RJ." sub="Every step tuned the signal a little clearer.">
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
          <div className="space-y-10">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className={`relative grid md:grid-cols-2 gap-4 items-center ${i % 2 ? "md:[&>*:first-child]:col-start-2" : ""}`}
              >
                <div className={`glass rounded-2xl p-6 ml-12 md:ml-0 ${i % 2 ? "md:mr-8" : "md:ml-8 md:text-right"}`}>
                  <div className="text-[10px] tracking-[0.3em] text-primary font-semibold">{t.year.toUpperCase()}</div>
                  <h3 className="font-display font-bold text-2xl mt-1">{t.title}</h3>
                  <p className="text-muted-foreground mt-2">{t.desc}</p>
                </div>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-primary glow-red ring-4 ring-background" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" eyebrow="Skills" title="What I bring to the booth.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-4 flex items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition"
            >
              <Equalizer bars={3} className="h-4" />
              <span className="text-sm font-medium">{s}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* VIDEOS */}
      <Section id="videos" eyebrow="Video Gallery" title="See me on stage. Hear me on tape." sub="Hosting, voice-overs, reels, and long-form — all in one place.">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {VIDEOS.map((v, i) => {
            const emb = getEmbed(v.url);
            return (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl overflow-hidden group flex flex-col">
                <div className="relative bg-black aspect-video w-full">
                  {emb ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={emb.src}
                      title={v.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      scrolling="no"
                    />
                  ) : (
                    <a href={v.url} target="_blank" rel="noreferrer" className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">Open video ↗</a>
                  )}
                </div>
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[10px] tracking-[0.3em] text-primary font-semibold">{v.cat.toUpperCase()}</div>
                    <h3 className="font-display font-bold text-lg mt-0.5 truncate">{v.title}</h3>
                    <a href={v.url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-muted-foreground hover:text-primary">Open original ↗</a>
                  </div>
                  <Equalizer bars={4} />
                </div>
              </motion.div>
            );
          })}

        </div>
      </Section>

      {/* GALLERY */}
      <Section id="gallery" eyebrow="Photo Gallery" title="Behind every voice, a thousand moments.">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.05 }}
              className={`glass rounded-2xl overflow-hidden group relative ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <img src={g.src} alt={g.label} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-70" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[10px] tracking-[0.3em] text-primary">MOMENT</div>
                <div className="font-display font-bold">{g.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SOCIAL */}
      <Section id="social" eyebrow="Social" title="Follow the frequency.">
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { name: "Instagram", handle: "@shadha__20", icon: <I.ig className="w-6 h-6" />, href: "https://www.instagram.com/shadha__20/" },
            { name: "LinkedIn", handle: "Shadha Basheer Ahamed", icon: <I.li className="w-6 h-6" />, href: "https://www.linkedin.com/in/shadhabasheerahamed" },
            { name: "YouTube", handle: "Shadha Basheer Speaks", icon: <I.yt className="w-6 h-6" />, href: "https://www.youtube.com/channel/UChZh7Uk5TTG0gBqmd9EhKlA" },
          ].map((s) => (
            <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-primary/60 hover:glow-red transition group">

              <div className="h-14 w-14 rounded-2xl bg-primary/15 text-primary grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition">
                {s.icon}
              </div>
              <div>
                <div className="font-display font-bold text-lg">{s.name}</div>
                <div className="text-sm text-muted-foreground">{s.handle}</div>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* CONSOLE / FUN */}
      <Section id="console" eyebrow="Fun Zone" title="You're the RJ now." sub="Press ON AIR, spin the vinyl, and play a demo. Studio's all yours.">
        <RadioConsole />
      </Section>

      {/* CONTACT */}
      <Section id="contact" eyebrow="Contact" title="Let's make some noise together." sub="Booking a host, a voice, or just a conversation? The mic is open.">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-6">
          <div className="glass rounded-2xl p-8 space-y-4">
            {[
              { i: <I.phone className="w-5 h-5" />, l: "Phone", v: "+91 95977 55171", href: "tel:+919597755171" },
              { i: <I.mail className="w-5 h-5" />, l: "Email", v: "shadha2021@gmail.com", href: "mailto:shadha2021@gmail.com" },
              { i: <I.li className="w-5 h-5" />, l: "LinkedIn", v: "shadhabasheerahamed", href: "https://www.linkedin.com/in/shadhabasheerahamed" },
              { i: <I.ig className="w-5 h-5" />, l: "Instagram", v: "@shadha__20", href: "https://www.instagram.com/shadha__20/" },
              { i: <I.yt className="w-5 h-5" />, l: "YouTube", v: "Shadha Basheer Speaks", href: "https://www.youtube.com/channel/UChZh7Uk5TTG0gBqmd9EhKlA" },
            ].map((c) => (
              <a key={c.l} href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-4 py-3 border-b border-border last:border-0 hover:text-primary transition">
                <div className="h-11 w-11 rounded-xl bg-primary/15 text-primary grid place-items-center">{c.i}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-[0.3em] text-muted-foreground">{c.l.toUpperCase()}</div>
                  <div className="font-medium truncate">{c.v}</div>
                </div>
              </a>
            ))}
            <a href="https://wa.me/919597755171" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[oklch(0.72_0.18_150)] text-black px-6 py-3 font-medium hover:scale-105 transition">
              <I.wa className="w-5 h-5" /> Chat on WhatsApp
            </a>

          </div>

          <div className="glass-strong rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative">
              <OnAirSign live />
              <h3 className="mt-5 font-display font-black text-3xl leading-tight">Tune in for the next episode.</h3>
              <p className="mt-3 text-muted-foreground">Signing off with the words I hope every listener carries:</p>
              <p className="mt-4 gold-text font-display text-xl italic">"Every dream has a frequency. This is mine."</p>
            </div>
            <div className="relative mt-8"><WaveLine className="w-full h-14" /></div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="px-6 pb-24 pt-16">
        <div className="max-w-7xl mx-auto glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full bg-primary grid place-items-center glow-red"><I.mic className="w-4 h-4 text-primary-foreground" /></span>
            <span className="font-display font-bold">Shadha<span className="text-primary">.FM</span></span>
          </div>
          <div className="text-muted-foreground">© {new Date().getFullYear()} Shadha Basheer Ahamed. All rights reserved.</div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#top" className="hover:text-primary transition">Back to top ↑</a>
          </div>
        </div>
      </footer>

      <StickyPlayer />
    </div>
  );
}
