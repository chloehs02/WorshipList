"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  active: boolean;
  onToggle?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ active, onToggle, className, size = "md" }: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle?.();
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex items-center justify-center rounded-full transition-colors",
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        active ? "text-accent" : "text-muted-foreground hover:text-foreground",
        "hover:bg-secondary",
        className
      )}
    >
      <Heart className={cn(size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]", active && "fill-accent")} />
    </button>
  );
}
