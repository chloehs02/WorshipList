"use client";

import * as React from "react";
import { Check, Copy, Link as LinkIcon, Mail } from "lucide-react";
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
import type { PermissionType } from "@/types";

interface ShareModalProps {
  slug: string;
  title: string;
  trigger?: React.ReactNode;
}

interface Invite {
  email: string;
  permission: PermissionType;
}

export function ShareModal({ slug, title, trigger }: ShareModalProps) {
  const [email, setEmail] = React.useState("");
  const [permission, setPermission] = React.useState<PermissionType>("viewer");
  const [invites, setInvites] = React.useState<Invite[]>([]);
  const [copied, setCopied] = React.useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/song/${slug}` : `worshipflow.com/song/${slug}`;

  function copyLink() {
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
    <Dialog>
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
          <DialogDescription>Invite teammates or generate a shareable link.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Shareable link</Label>
          <div className="flex items-center gap-2">
            <Input readOnly value={shareUrl} className="font-mono text-xs" />
            <Button variant="secondary" size="icon" className="shrink-0 rounded-xl" onClick={copyLink} aria-label="Copy link">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
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
                  <Badge variant={inv.permission === "editor" ? "accent" : "secondary"}>{inv.permission}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
