import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserProvider } from "@/components/providers/user-provider";
import { getCurrentUserProfile } from "@/lib/supabase/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUserProfile();

  if (!user) {
    redirect("/login");
  }

  return (
    <UserProvider user={user}>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">{children}</div>
        <MobileNav />
      </div>
    </UserProvider>
  );
}
