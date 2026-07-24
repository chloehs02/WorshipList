export const APP_NAME = "WorshipFlow";
export const APP_DESCRIPTION = "Chord sheets & setlists for worship teams";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutGrid" },
  { label: "Song Library", href: "/songs", icon: "Music2" },
  { label: "Setlists", href: "/setlists", icon: "ListMusic" },
  { label: "Profile", href: "/profile", icon: "Settings" },
] as const;

export const MOBILE_NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: "Home" },
  { label: "Library", href: "/songs", icon: "Music2" },
  { label: "Setlists", href: "/setlists", icon: "ListMusic" },
  { label: "Saved", href: "/songs?filter=favorites", icon: "Bookmark" },
  { label: "Settings", href: "/profile", icon: "Settings" },
] as const;
