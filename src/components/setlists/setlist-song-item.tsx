"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Music2, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SetlistSong } from "@/types";

interface SetlistSongItemProps {
  item: SetlistSong;
  index: number;
  onRemove?: (id: string) => void;
  readOnly?: boolean;
}

export function SetlistSongItem({ item, index, onRemove, readOnly = false }: SetlistSongItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled: readOnly,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-shadow",
        isDragging && "shadow-lg ring-2 ring-primary/40"
      )}
    >
      {!readOnly && (
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-5 w-5" />
        </button>
      )}

      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
        {index + 1}
      </span>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/25 to-accent/20">
        <Music2 className="h-4 w-4" />
      </div>

      <Link href={readOnly ? `/song/${item.song.slug}` : `/songs/${item.song.slug}`} className="min-w-0 flex-1">
        <p className="truncate font-medium">{item.song.title}</p>
        <p className="truncate text-xs text-muted-foreground">{item.song.artist}</p>
      </Link>

      <Badge variant="outline">{item.keyOverride ?? item.song.key}</Badge>

      {!readOnly && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(item.id)}
          aria-label="Remove from setlist"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
