"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Music2, ListMusic, Settings, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/components/providers/user-provider";
import { initials } from "@/lib/utils";

const ICONS = { LayoutGrid, Music2, ListMusic, Settings } as const;

const items = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutGrid" as const },
  { label: "Song Library", href: "/songs", icon: "Music2" as const },
  { label: "Setlists", href: "/setlists", icon: "ListMusic" as const },
  { label: "Profile", href: "/profile", icon: "Settings" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const currentUser = useCurrentUser();

  return (
    <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-border bg-card/60 px-4 py-6 md:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
          <Sparkles className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">WorshipFlow</span>
      </Link>

      <Button asChild className="mb-6 justify-start gap-2 shadow-md shadow-primary/20">
        <Link href="/songs/new">
          <Plus className="h-4 w-4" />
          New Song
        </Link>
      </Button>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{currentUser.name}</p>
          <p className="truncate text-xs text-muted-foreground">{currentUser.instrument}</p>
        </div>
      </div>
    </aside>
  );
}
