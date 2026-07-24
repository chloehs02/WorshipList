"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/components/providers/user-provider";
import { initials } from "@/lib/utils";

export function Topbar({ title, actions }: { title?: string; actions?: React.ReactNode }) {
  const currentUser = useCurrentUser();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-5 py-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-display font-bold">WorshipFlow</span>
      </div>
      {title && <h1 className="hidden font-display text-xl font-semibold md:block">{title}</h1>}
      <div className="ml-auto flex items-center gap-3">
        {actions}
        <ThemeToggle />
        <Link href="/profile" className="hidden md:block">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[11px]">{initials(currentUser.name)}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
