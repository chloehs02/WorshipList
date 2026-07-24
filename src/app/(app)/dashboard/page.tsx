import Link from "next/link";
import { Music2, ListMusic, Heart, Clock, ArrowRight, CalendarDays, Plus } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SongCard } from "@/components/songs/song-card";
import { getSongs, getSetlists, getCurrentUserProfile } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export default async function DashboardPage() {
  const [songs, setlists, user] = await Promise.all([getSongs(), getSetlists(), getCurrentUserProfile()]);

  const favorites = songs.filter((s) => s.isFavorite);
  const recentSongs = [...songs].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 4);
  const today = new Date();
  const upcoming = [...setlists]
    .filter((s) => s.date && new Date(s.date) >= new Date(today.toDateString()))
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const stats = [
    { label: "Total songs", value: songs.length, icon: Music2, href: "/songs" },
    { label: "Setlists", value: setlists.length, icon: ListMusic, href: "/setlists" },
    { label: "Favorites", value: favorites.length, icon: Heart, href: "/songs?filter=favorites" },
    { label: "Upcoming services", value: upcoming.length, icon: Clock, href: "/setlists" },
  ];

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <>
      <Topbar
        title={`Hi, ${firstName}`}
        actions={
          <Button asChild size="sm" className="gap-1.5 rounded-full">
            <Link href="/songs/new">
              <Plus className="h-3.5 w-3.5" /> New song
            </Link>
          </Button>
        }
      />

      <div className="flex-1 space-y-8 px-5 py-6 md:px-8">
        <div className="md:hidden">
          <h1 className="font-display text-2xl font-bold">Hi, {firstName}</h1>
          <p className="text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your team.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/15">
                    <s.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <p className="font-display text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {songs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-16 text-center">
            <Music2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Your library is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add your first song to start building your setlists.</p>
            <Button asChild className="mt-4 gap-1.5 rounded-full">
              <Link href="/songs/new">
                <Plus className="h-3.5 w-3.5" /> Add a song
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Upcoming services</h2>
                  <Link href="/setlists" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    See all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {upcoming.map((setlist) => (
                    <Link key={setlist.id} href={`/setlists/${setlist.id}`}>
                      <Card className="h-full transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-accent">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(setlist.date)}
                          </div>
                          <p className="font-display font-semibold">{setlist.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{setlist.songs.length} songs · {setlist.serviceType}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Recently edited</h2>
                <Link href="/songs" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  See all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {recentSongs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </section>

            {favorites.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Favorite songs</h2>
                  <Link href="/songs?filter=favorites" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    See all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {favorites.map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
