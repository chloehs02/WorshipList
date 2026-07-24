"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't send reset link. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/20">
          <Mail className="h-6 w-6 text-lime-400" />
        </div>
        <h1 className="font-display text-2xl font-bold">Check your email</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/60">
          We sent a password reset link to <span className="text-white">{email}</span>
        </p>
        <Button asChild variant="outline" className="mt-8 rounded-full border-white/15 bg-white/5 hover:bg-white/10">
          <Link href="/login">Return to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Reset password</h1>
      <p className="mt-1 text-sm text-white/60">Enter your email and we'll send you a reset link.</p>

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
        <Button type="submit" disabled={loading} className="w-full gap-2 bg-lime-400 text-black hover:bg-lime-400/90">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/50">
        Remember your password?{" "}
        <Link href="/login" className="text-lime-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
