"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;

      if (data.session) {
        toast.success("Account created!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.success("Check your email to confirm your account, then log in.");
        router.push("/login");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't create your account — try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Create your team</h1>
      <p className="mt-1 text-sm text-white/60">Set up WorshipFlow for your worship team.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-white/80">Full name</Label>
          <Input
            required
            placeholder="Samantha Reyes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>
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
          <Label className="text-white/80">Password</Label>
          <Input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full gap-2 bg-lime-400 text-black hover:bg-lime-400/90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Already have a team?{" "}
        <Link href="/login" className="text-lime-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
