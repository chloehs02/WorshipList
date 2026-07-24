"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      router.push(searchParams.get("redirectTo") || "/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't log in — check your details and try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-white/60">Log in to your worship team.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-white/80">Email</Label>
          <Input
            type="email"
            required
            placeholder="you@church.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-white/80">Password</Label>
            <Link href="/forgot-password" className="text-xs text-lime-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full gap-2 bg-lime-400 text-black hover:bg-lime-400/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        New to WorshipFlow?{" "}
        <Link href="/register" className="text-lime-400 hover:underline">
          Create a team
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-lime-400" /></div>}>
      <LoginForm />
    </React.Suspense>
  );
}
