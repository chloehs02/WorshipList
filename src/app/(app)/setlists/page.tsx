import { Topbar } from "@/components/layout/topbar";
import { SetlistsListClient } from "@/components/setlists/setlists-list-client";
import { getSetlists } from "@/lib/supabase/queries";

export default async function SetlistsPage() {
  const setlists = await getSetlists();

  return (
    <>
      <Topbar title="Setlists" />
      <SetlistsListClient initialSetlists={setlists} />
    </>
  );
}
