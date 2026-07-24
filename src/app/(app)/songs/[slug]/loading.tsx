import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SongDetailLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:h-screen">
      <Topbar
        title="Loading song..."
        actions={
          <Button disabled variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-50">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        }
      />

      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Internal Toolbar Skeleton */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3 md:px-8">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">
            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground opacity-50">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to library
            </div>
            
            <div className="mt-5 mb-8">
              <Skeleton className="h-10 w-64 mb-3 sm:h-12" />
              <Skeleton className="h-5 w-48 mb-2" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>

            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-full max-w-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
