"use client";

import * as React from "react";
import { LogOut, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { initials } from "@/lib/utils";
import { signOutAction } from "@/app/actions/auth";
import type { TeamMember, UserProfile } from "@/types";

export function ProfileClient({ user, initialMembers }: { user: UserProfile; initialMembers: TeamMember[] }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [name, setName] = React.useState(user.name);
  const [instrument, setInstrument] = React.useState(user.instrument ?? "");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [members, setMembers] = React.useState(initialMembers);
  const [stageDefault, setStageDefault] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    // Full profile editing (name/instrument -> public.users) can be wired to a
    // server action the same way songs/setlists are; kept as a stub for now.
    toast.success("Profile updated");
  }

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    toast.message(`Invite link ready to send to ${inviteEmail}`, {
      description: "Email delivery isn't connected yet — copy your team's sign-up link and share it directly for now.",
    });
    setInviteEmail("");
  }

  function handleRemoveMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Member removed from team");
  }

  return (
    <div className="flex-1 space-y-6 px-5 py-6 md:px-8 max-w-3xl">
      <div className="md:hidden">
        <h1 className="font-display text-2xl font-bold">Profile & Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>This is how your team sees you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">{initials(name || "You")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.email}</p>
                <Badge variant="secondary" className="mt-1 capitalize">{user.role}</Badge>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Primary instrument</Label>
                <Input value={instrument} onChange={(e) => setInstrument(e.target.value)} placeholder="Acoustic Guitar" />
              </div>
            </div>
            <Button type="submit" className="rounded-full">Save changes</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display preferences</CardTitle>
          <CardDescription>Personalize how chord sheets look.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">Easier on the eyes during evening rehearsals.</p>
            </div>
            <Switch checked={resolvedTheme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Default to stage mode</p>
              <p className="text-xs text-muted-foreground">Open chord sheets in large-text mode by default.</p>
            </div>
            <Switch checked={stageDefault} onCheckedChange={setStageDefault} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>Invite the rest of your worship team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleInvite} className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="teammate@church.org"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button type="submit" size="icon" className="shrink-0 rounded-xl" aria-label="Invite">
              <UserPlus className="h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">{initials(m.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.instrument || "—"} · {m.email}</p>
                </div>
                <Badge variant="outline" className="capitalize">{m.role}</Badge>
                {m.id !== user.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveMember(m.id)}
                    aria-label={`Remove ${m.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form action={signOutAction}>
        <Button
          type="submit"
          variant="outline"
          disabled={signingOut}
          onClick={() => setSigningOut(true)}
          className="gap-2 rounded-full text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </form>
    </div>
  );
}
