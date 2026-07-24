import { redirect } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { ProfileClient } from "@/components/profile/profile-client";
import { getCurrentUserProfile, getTeamMembers } from "@/lib/supabase/queries";

export default async function ProfilePage() {
  const user = await getCurrentUserProfile();
  if (!user) redirect("/login");

  const members = await getTeamMembers();

  return (
    <>
      <Topbar title="Profile & Settings" />
      <ProfileClient user={user} initialMembers={members} />
    </>
  );
}
