import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-hero-gradient px-6 py-12 text-white">
      <div className="absolute inset-0 bg-glow-purple" />
      <div className="absolute inset-0 bg-glow-lime" />
      <div className="relative w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-lime-400 shadow-lg shadow-purple-500/30">
            <Sparkles className="h-4.5 w-4.5 text-black" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">WorshipFlow</span>
        </Link>
        <div className="glass rounded-3xl border-white/10 bg-white/[0.05] p-7 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
