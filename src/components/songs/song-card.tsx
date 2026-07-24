"use client";

import Link from "next/link";
import { Music2, Gauge } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "./favorite-button";
import type { Song } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORY_GRADIENTS: Record<string, string> = {
  Praise: "from-orange-500/30 to-pink-500/20",
  Worship: "from-violet-500/30 to-indigo-500/20",
  Hymn: "from-amber-500/25 to-rose-500/15",
  Contemporary: "from-fuchsia-500/30 to-purple-600/20",
  Christmas: "from-emerald-500/25 to-teal-500/15",
  Communion: "from-red-500/25 to-rose-600/15",
  Response: "from-sky-500/25 to-blue-600/15",
};

interface SongCardProps {
  song: Song;
  onToggleFavorite?: (id: string) => void;
  layout?: "grid" | "list";
}

export function SongCard({ song, onToggleFavorite, layout = "grid" }: SongCardProps) {
  const gradient = CATEGORY_GRADIENTS[song.category] ?? "from-primary/30 to-accent/20";

  if (layout === "list") {
    return (
      <Link href={`/songs/${song.slug}`}>
        <Card className="flex items-center gap-4 p-3.5 transition-all hover:border-primary/40 hover:shadow-md">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br", gradient)}>
            <Music2 className="h-5 w-5 text-foreground/80" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{song.title}</p>
            <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex">
            Key {song.key}
          </Badge>
          <FavoriteButton active={!!song.isFavorite} onToggle={() => onToggleFavorite?.(song.id)} size="sm" />
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/songs/${song.slug}`} className="group block">
      <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
        <div className={cn("relative flex h-28 items-center justify-center bg-gradient-to-br", gradient)}>
          <Music2 className="h-9 w-9 text-foreground/70 transition-transform group-hover:scale-110" />
          <div className="absolute right-2.5 top-2.5">
            <FavoriteButton active={!!song.isFavorite} onToggle={() => onToggleFavorite?.(song.id)} size="sm" />
          </div>
          <Badge className="absolute left-2.5 top-2.5" variant="secondary">
            {song.category}
          </Badge>
        </div>
        <div className="p-4">
          <p className="truncate font-display font-semibold">{song.title}</p>
          <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1">Key {song.key}</span>
            {song.bpm && (
              <span className="inline-flex items-center gap-1">
                <Gauge className="h-3 w-3" /> {song.bpm}
              </span>
            )}
            {song.capo > 0 && <span>Capo {song.capo}</span>}
          </div>
        </div>
      </Card>
    </Link>
  );
}
