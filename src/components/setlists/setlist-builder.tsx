"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { SetlistSongItem } from "./setlist-song-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SearchBar } from "@/components/songs/search-bar";
import { addSongToSetlist, removeSongFromSetlist, reorderSetlistSongs } from "@/app/actions/setlists";
import type { SetlistSong, Song } from "@/types";

interface SetlistBuilderProps {
  initialSongs: SetlistSong[];
  setlistId: string;
  allSongs: Song[];
  readOnly?: boolean;
}

export function SetlistBuilder({ initialSongs, setlistId, allSongs, readOnly = false }: SetlistBuilderProps) {
  const router = useRouter();
  const [items, setItems] = React.useState(initialSongs);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setItems(initialSongs), [initialSongs]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const previous = items;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex).map((s, idx) => ({ ...s, orderNumber: idx + 1 }));
    setItems(reordered);

    try {
      await reorderSetlistSongs(setlistId, reordered.map((i) => i.id));
    } catch (err) {
      setItems(previous);
      toast.error(err instanceof Error ? err.message : "Couldn't save the new order");
    }
  }

  async function handleRemove(id: string) {
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id).map((s, idx) => ({ ...s, orderNumber: idx + 1 })));
    try {
      await removeSongFromSetlist(id, setlistId);
    } catch (err) {
      setItems(previous);
      toast.error(err instanceof Error ? err.message : "Couldn't remove that song");
    }
  }

  async function handleAdd(song: Song) {
    setOpen(false);
    setQuery("");
    const tempId = `temp-${song.id}-${Date.now()}`;
    setItems((prev) => [
      ...prev,
      { id: tempId, setlistId, songId: song.id, orderNumber: prev.length + 1, song },
    ]);
    try {
      await addSongToSetlist(setlistId, song.id);
      router.refresh();
    } catch (err) {
      setItems((prev) => prev.filter((i) => i.id !== tempId));
      toast.error(err instanceof Error ? err.message : "Couldn't add that song");
    }
  }

  const available = allSongs.filter(
    (s) =>
      !items.some((i) => i.songId === s.id) &&
      (s.title.toLowerCase().includes(query.toLowerCase()) || s.artist.toLowerCase().includes(query.toLowerCase()))
  );

  const totalMinutes = items.reduce((acc, i) => {
    const [m, s] = (i.song.duration ?? "0:00").split(":").map(Number);
    return acc + m + s / 60;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "song" : "songs"} · ~{Math.round(totalMinutes)} min
        </p>

        {!readOnly && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1.5 rounded-full">
                <Plus className="h-3.5 w-3.5" />
                Add song
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a song to this setlist</DialogTitle>
              </DialogHeader>
              <SearchBar value={query} onChange={setQuery} placeholder="Search your library..." />
              <div className="max-h-80 space-y-1.5 overflow-y-auto">
                {available.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">No matching songs found.</p>
                )}
                {available.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleAdd(song)}
                    className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{song.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {song.artist} · Key {song.key}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground">
          No songs added yet. Add your first song to build this setlist.
        </div>
      ) : (
        <DndContext id={setlistId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <SetlistSongItem key={item.id} item={item} index={idx} onRemove={handleRemove} readOnly={readOnly} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
