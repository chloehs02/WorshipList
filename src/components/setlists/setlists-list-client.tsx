"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, CalendarDays, Users, ListMusic } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSetlist } from "@/app/actions/setlists";
import { formatDate } from "@/lib/utils";
import type { Setlist } from "@/types";

export function SetlistsListClient({ initialSetlists }: { initialSetlists: Setlist[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const sorted = [...initialSetlists].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) {
      toast.error("Add a title and a date");
      return;
    }
    setCreating(true);
    try {
      const id = await createSetlist({ title: title.trim(), date, notes });
      setOpen(false);
      setTitle("");
      setDate("");
      setNotes("");
      toast.success("Setlist created");
      router.push(`/setlists/${id}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create setlist");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex-1 space-y-5 px-5 py-6 md:px-8">
      <div className="flex items-center justify-between md:hidden">
        <div>
          <h1 className="font-display text-2xl font-bold">Setlists</h1>
          <p className="text-sm text-muted-foreground">Plan and share your service order</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-full">
              <Plus className="h-3.5 w-3.5" /> New
            </Button>
          </DialogTrigger>
          <SetlistDialogContent
            title={title}
            setTitle={setTitle}
            date={date}
            setDate={setDate}
            notes={notes}
            setNotes={setNotes}
            onSubmit={handleCreate}
            creating={creating}
          />
        </Dialog>
      </div>

      <div className="hidden justify-end md:flex">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 rounded-full">
              <Plus className="h-3.5 w-3.5" /> New setlist
            </Button>
          </DialogTrigger>
          <SetlistDialogContent
            title={title}
            setTitle={setTitle}
            date={date}
            setDate={setDate}
            notes={notes}
            setNotes={setNotes}
            onSubmit={handleCreate}
            creating={creating}
          />
        </Dialog>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <ListMusic className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="font-medium">No setlists yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Create your first service setlist to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((setlist) => (
            <Link key={setlist.id} href={`/setlists/${setlist.id}`}>
              <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium text-accent">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(setlist.date)}
                  </div>
                  <p className="font-display text-lg font-semibold">{setlist.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{setlist.notes || setlist.serviceType}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ListMusic className="h-3.5 w-3.5" /> {setlist.songs.length} songs
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {setlist.sharedWith?.length ?? 0} shared
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SetlistDialogContent(props: {
  title: string;
  setTitle: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  creating: boolean;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a setlist</DialogTitle>
      </DialogHeader>
      <form onSubmit={props.onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Title</Label>
          <Input value={props.title} onChange={(e) => props.setTitle(e.target.value)} placeholder="Sunday Morning Gathering" />
        </div>
        <div className="space-y-1.5">
          <Label>Service date</Label>
          <Input type="date" value={props.date} onChange={(e) => props.setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Notes</Label>
          <Textarea value={props.notes} onChange={(e) => props.setNotes(e.target.value)} placeholder="Anything the team should know..." />
        </div>
        <Button type="submit" disabled={props.creating} className="w-full rounded-full">
          {props.creating ? "Creating..." : "Create setlist"}
        </Button>
      </form>
    </DialogContent>
  );
}
