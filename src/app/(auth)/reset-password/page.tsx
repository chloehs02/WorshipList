"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // We rely on Supabase's automatic PKCE/hash token extraction by the client
  // which establishes the session if the user clicked a valid link.
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      toast.success("Password reset successfully! Logging you in...");
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset password. The link might have expired.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Choose a new password</h1>
      <p className="mt-1 text-sm text-white/60">Make sure it's at least 6 characters.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-white/80">New Password</Label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-white/80">Confirm New Password</Label>
          <Input
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-white/15 bg-white/5 text-white placeholder:text-white/30"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full gap-2 bg-lime-400 text-black hover:bg-lime-400/90">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Update password
        </Button>
      </form>
    </div>
  );
}
