import { Topbar } from "@/components/layout/topbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function SetlistsLoading() {
  return (
    <>
      <Topbar title="Setlists" />
      <div className="flex-1 space-y-5 px-5 py-6 md:px-8">
        <div className="flex items-center justify-between md:hidden">
          <div>
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        <div className="hidden items-center justify-between md:flex">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </>
  );
}
