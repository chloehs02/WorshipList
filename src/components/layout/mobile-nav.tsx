"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Music2, ListMusic, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = { Home, Music2, ListMusic, Bookmark, Settings } as const;

const items = [
  { label: "Home", href: "/dashboard", icon: "Home" as const },
  { label: "Library", href: "/songs", icon: "Music2" as const },
  { label: "Setlists", href: "/setlists", icon: "ListMusic" as const },
  { label: "Saved", href: "/songs?filter=favorites", icon: "Bookmark" as const },
  { label: "Settings", href: "/profile", icon: "Settings" as const },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href.split("?")[0];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors",
                active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                  active && "bg-accent/15"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
