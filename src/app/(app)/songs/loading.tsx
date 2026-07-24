import { Plus } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SongsLoading() {
  return (
    <>
      <Topbar
        title="Song Library"
        actions={
          <Button disabled size="sm" className="gap-1.5 rounded-full opacity-50">
            <Plus className="h-3.5 w-3.5" /> New song
          </Button>
        }
      />
      <div className="flex-1 px-5 py-6 md:px-8 max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full flex-1 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[90px] rounded-xl" />
            <Skeleton className="h-10 w-[90px] rounded-xl" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </>
  );
}
