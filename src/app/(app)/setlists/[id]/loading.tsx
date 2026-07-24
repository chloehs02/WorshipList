import { ArrowLeft, Share2 } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SetlistDetailLoading() {
  return (
    <>
      <Topbar
        title="Loading setlist..."
        actions={
          <Button disabled variant="outline" size="sm" className="gap-1.5 rounded-full opacity-50">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        }
      />

      <div className="flex-1 space-y-5 px-5 py-6 md:px-8 max-w-5xl">
        <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground opacity-50">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to setlists
        </div>

        <div>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-8 w-64 mb-3 sm:h-9" />
          <Skeleton className="h-4 w-96 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>

        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
            
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
