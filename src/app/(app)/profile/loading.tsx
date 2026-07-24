import { Topbar } from "@/components/layout/topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <>
      <Topbar title="Profile & Settings" />
      <div className="flex-1 space-y-6 px-5 py-6 md:px-8 max-w-3xl">
        <div className="md:hidden">
          <Skeleton className="h-8 w-48 mb-1" />
        </div>

        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full max-w-sm" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
