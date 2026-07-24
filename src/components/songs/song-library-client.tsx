"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";
import { SongFilters } from "./song-filters";
import { SongCard } from "./song-card";
import { toggleFavorite } from "@/app/actions/songs";
import type { Song } from "@/types";

export function SongLibraryClient({ initialSongs }: { initialSongs: Song[] }) {
  const [songs, setSongs] = React.useState<Song[]>(initialSongs);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [keyFilter, setKeyFilter] = React.useState("all");
  const [layout, setLayout] = React.useState<"grid" | "list">("grid");
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);

  React.useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("filter") === "favorites") setFavoritesOnly(true);
  }, []);

  async function handleToggleFavorite(id: string) {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)));
    try {
      await toggleFavorite(id);
    } catch (err) {
      // revert on failure
      setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)));
      toast.error(err instanceof Error ? err.message : "Couldn't update favorite");
    }
  }

  const filtered = songs.filter((s) => {
    const matchesQuery =
      !query ||
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase()) ||
      s.chordSheet.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || s.category === category;
    const matchesKey = keyFilter === "all" || s.key === keyFilter;
    const matchesFavorite = !favoritesOnly || s.isFavorite;
    return matchesQuery && matchesCategory && matchesKey && matchesFavorite;
  });

  return (
    <div className="flex-1 space-y-5 px-5 py-6 md:px-8">
      <div className="flex items-center justify-between md:hidden">
        <div>
          <h1 className="font-display text-2xl font-bold">Song Library</h1>
          <p className="text-sm text-muted-foreground">{songs.length} songs in your library</p>
        </div>
        <Button asChild size="sm" className="gap-1.5 rounded-full">
          <Link href="/songs/new">
            <Plus className="h-3.5 w-3.5" /> New
          </Link>
        </Button>
      </div>

      <SearchBar value={query} onChange={setQuery} />

      <div className="flex flex-wrap items-center gap-2">
        <SongFilters
          category={category}
          onCategoryChange={setCategory}
          keyFilter={keyFilter}
          onKeyChange={setKeyFilter}
          layout={layout}
          onLayoutChange={setLayout}
        />
        <Button
          variant={favoritesOnly ? "accent" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setFavoritesOnly((v) => !v)}
        >
          ♥ Favorites
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} songs</p>

      {songs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">Your library is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Add your first song to get started.</p>
          <Button asChild className="mt-4 gap-1.5 rounded-full">
            <Link href="/songs/new">
              <Plus className="h-3.5 w-3.5" /> New song
            </Link>
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">No songs match your search</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different keyword or clear your filters.</p>
        </div>
      ) : layout === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} layout="list" onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
