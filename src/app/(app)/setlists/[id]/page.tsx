import Link from "next/link";
import { ArrowLeft, CalendarDays, ListMusic, Share2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SetlistBuilder } from "@/components/setlists/setlist-builder";
import { ShareModal } from "@/components/sharing/share-modal";
import { getSetlistById, getSongs } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils";

export default async function SetlistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [setlist, allSongs] = await Promise.all([getSetlistById(id), getSongs()]);

  if (!setlist) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <ListMusic className="h-10 w-10 text-muted-foreground" />
        <p className="font-display text-lg font-semibold">Setlist not found</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/setlists">Back to setlists</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Topbar
        title={setlist.title}
        actions={
          <ShareModal
            resourceId={setlist.id}
            resourceType="setlist"
            title={setlist.title}
            trigger={
              <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
            }
          />
        }
      />

      <div className="flex-1 space-y-5 px-5 py-6 md:px-8">
        <Link href="/setlists" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to setlists
        </Link>

        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-accent">
            <CalendarDays className="h-4 w-4" />
            {formatDate(setlist.date)} {setlist.serviceType ? `· ${setlist.serviceType}` : ""}
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{setlist.title}</h1>
          {setlist.notes && <p className="mt-2 max-w-2xl text-muted-foreground">{setlist.notes}</p>}
          <p className="mt-2 text-xs text-muted-foreground">Created by {setlist.createdByName}</p>
        </div>

        <Card>
          <CardContent className="p-5">
            <SetlistBuilder initialSongs={setlist.songs} setlistId={setlist.id} allSongs={allSongs} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
