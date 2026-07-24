"use client";

import * as React from "react";
import { Check, Copy, Link as LinkIcon, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getOrCreateShareToken } from "@/app/actions/share";
import type { PermissionType } from "@/types";

interface ShareModalProps {
  /** The raw setlist UUID (or song slug). */
  resourceId: string;
  /** "setlist" | "song" — determines which token strategy + URL path to use */
  resourceType?: "setlist" | "song";
  title: string;
  trigger?: React.ReactNode;
  // Legacy prop support — if slug is passed instead of resourceId
  slug?: string;
}

interface Invite {
  email: string;
  permission: PermissionType;
}

export function ShareModal({
  resourceId,
  resourceType = "setlist",
  title,
  trigger,
  slug,
}: ShareModalProps) {
  const [email, setEmail] = React.useState("");
  const [permission, setPermission] = React.useState<PermissionType>("viewer");
  const [invites, setInvites] = React.useState<Invite[]>([]);
  const [copied, setCopied] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState<string>("");
  const [loadingToken, setLoadingToken] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Resolve the ID from either the new prop or the legacy slug prop
  const resolvedId = resourceId || (slug ? slug.replace("setlist-", "") : "");

  // When the dialog opens, generate/fetch the share token
  React.useEffect(() => {
    if (!open) return;
    if (resourceType === "song") {
      // Song share uses the /song/[slug] route
      const origin = typeof window !== "undefined" ? window.location.origin : "https://worshipflow.app";
      setShareUrl(`${origin}/song/${resolvedId}`);
      return;
    }

    // Setlist share: get a UUID token from server
    setLoadingToken(true);
    getOrCreateShareToken(resolvedId)
      .then((token) => {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://worshipflow.app";
        setShareUrl(`${origin}/s/${token}`);
      })
      .catch(() => {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://worshipflow.app";
        setShareUrl(`${origin}/s/${resolvedId}`);
      })
      .finally(() => setLoadingToken(false));
  }, [open, resolvedId, resourceType]);

  function copyLink() {
    if (!shareUrl) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 1800);
  }

  function addInvite() {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    setInvites((prev) => [...prev, { email: email.trim(), permission }]);
    setEmail("");
    toast.success(`Invited ${email.trim()} as ${permission}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" className="gap-1.5 rounded-full">
            <LinkIcon className="h-3.5 w-3.5" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share &ldquo;{title}&rdquo;</DialogTitle>
          <DialogDescription>
            Anyone with this link can view the setlist — no account required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Shareable link</Label>
          <div className="flex items-center gap-2">
            {loadingToken ? (
              <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Generating link…
              </div>
            ) : (
              <Input readOnly value={shareUrl} className="font-mono text-xs" />
            )}
            <Button
              variant="secondary"
              size="icon"
              className="shrink-0 rounded-xl"
              onClick={copyLink}
              disabled={loadingToken || !shareUrl}
              aria-label="Copy link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            🔓 Anyone with this link can view — no login needed.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Invite by email</Label>
          <div className="flex items-center gap-2">
            <Input
              placeholder="teammate@church.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addInvite()}
            />
            <Select value={permission} onValueChange={(v) => setPermission(v as PermissionType)}>
              <SelectTrigger className="w-[110px] shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" className="shrink-0 rounded-xl" onClick={addInvite} aria-label="Send invite">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {invites.length > 0 && (
          <div className="space-y-2">
            <Label className="text-muted-foreground">People with access</Label>
            <div className="space-y-1.5">
              {invites.map((inv, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                  <span className="truncate">{inv.email}</span>
                  <Badge variant={inv.permission === "editor" ? "accent" : "secondary"}>
                    {inv.permission}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
