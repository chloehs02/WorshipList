import Link from "next/link";
import {
  Sparkles,
  Music2,
  ListMusic,
  Share2,
  Smartphone,
  Mic2,
  ArrowRight,
  Check,
  Guitar,
  Piano,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ChordRenderer } from "@/components/songs/chord-renderer";
import { mockSongs } from "@/lib/data/mock-songs";

const previewSong = mockSongs.find((s) => s.slug === "amazing-grace")!;

const features = [
  {
    icon: Music2,
    title: "Beautiful chord sheets",
    desc: "Chords float perfectly above lyrics, auto-formatted and easy to read on any screen.",
  },
  {
    icon: Guitar,
    title: "Instant transpose",
    desc: "Shift keys on the fly for any instrument — capo, chords, and key labels update together.",
  },
  {
    icon: ListMusic,
    title: "Setlist planning",
    desc: "Drag and drop songs into a running order for Sunday, add notes, and lock the flow.",
  },
  {
    icon: Share2,
    title: "Share with your team",
    desc: "Send a link, set viewer or editor access, and keep everyone on the same page.",
  },
  {
    icon: Smartphone,
    title: "Built for the stage",
    desc: "Large-text mode, dark mode, and auto-scroll make it readable from across the platform.",
  },
  {
    icon: Mic2,
    title: "Every role covered",
    desc: "Vocalists, guitarists, and keys all get the view they need from one shared song.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-hero-gradient text-white">
      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-lime-400 shadow-lg shadow-purple-500/30">
            <Sparkles className="h-4.5 w-4.5 text-black" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">WorshipFlow</span>
        </div>
        <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#preview" className="hover:text-white">Chord Sheets</a>
          <a href="#cta" className="hover:text-white">Get Started</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:block"><ThemeToggle /></div>
          <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild className="bg-lime-400 text-black hover:bg-lime-400/90">
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-glow-purple" />
        <div className="absolute inset-0 bg-glow-lime" />
        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-16 text-center sm:pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-lime-400" />
            Built for small worship teams
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
            Chord sheets, setlists, and
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-lime-400 bg-clip-text text-transparent">
              {" "}your whole team{" "}
            </span>
            in one place
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            WorshipFlow brings your song library, transposable chord sheets, and Sunday setlists together —
            so your team walks on stage ready, every time.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2 bg-lime-400 text-black hover:bg-lime-400/90">
              <Link href="/register">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              <Link href="/dashboard">View demo dashboard</Link>
            </Button>
          </div>
          <p className="mt-5 text-xs text-white/40">No credit card required · Free for teams up to 10 members</p>
        </div>
      </section>

      {/* Chord sheet preview */}
      <section id="preview" className="relative mx-auto max-w-5xl px-6 pb-24">
        <div className="glass rounded-3xl border-white/10 bg-white/[0.04] p-2 shadow-2xl">
          <div className="rounded-[1.35rem] bg-[#0c0714] p-6 sm:p-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-display text-xl font-semibold text-white">{previewSong.title}</p>
                <p className="text-sm text-white/50">{previewSong.artist} · Key of {previewSong.key} · {previewSong.bpm} BPM</p>
              </div>
              <div className="hidden gap-2 sm:flex">
                {["C", "D", "E", "F", "G"].map((k) => (
                  <span
                    key={k}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      k === previewSong.key ? "bg-lime-400 text-black" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
            <ChordRenderer
              chordSheet={previewSong.chordSheet}
              songKey={previewSong.key}
              className="text-white [&_.text-chord]:text-lime-400"
              fontScale={1.05}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything your team needs on a Sunday</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            From first rehearsal to final downbeat — WorshipFlow keeps your songs, your keys, and your people in sync.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.06]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/30 to-lime-400/20">
                <f.icon className="h-5 w-5 text-lime-300" />
              </div>
              <h3 className="font-display font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="grid items-center gap-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold">One song. Every instrument.</h2>
            <p className="mt-4 text-white/60">
              Guitarists transpose to their capo. Keys players read in concert pitch. Vocalists get large-text stage
              mode. Everyone opens the same song and sees exactly what they need.
            </p>
            <ul className="mt-6 space-y-3">
              {["Instant key transposition", "Large text mode for the stage", "Auto-scrolling chord sheets", "Works offline once saved"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/80">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime-400/20">
                      <Check className="h-3 w-3 text-lime-400" />
                    </span>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="flex items-center justify-center gap-4">
            {[Guitar, Piano, Mic2].map((Icon, i) => (
              <div
                key={i}
                className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-lime-400/10"
                style={{ transform: `translateY(${i === 1 ? -16 : 0}px)` }}
              >
                <Icon className="h-9 w-9 text-white/80" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative mx-auto max-w-4xl px-6 pb-28 text-center">
        <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-10 sm:p-14">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to simplify your Sunday?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/85">
            Set up your team&apos;s song library in minutes — free for teams up to 10 members.
          </p>
          <Button asChild size="lg" className="mt-7 gap-2 bg-lime-400 text-black hover:bg-lime-400/90">
            <Link href="/register">
              Create your team <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/40">
        © {new Date().getFullYear()} WorshipFlow. Built for worship teams everywhere.
      </footer>
    </div>
  );
}
