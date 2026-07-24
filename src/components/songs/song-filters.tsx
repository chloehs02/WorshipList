"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { songCategories, songKeys } from "@/lib/data/mock-songs";
import { LayoutGrid, List } from "lucide-react";

interface SongFiltersProps {
  category: string;
  onCategoryChange: (v: string) => void;
  keyFilter: string;
  onKeyChange: (v: string) => void;
  layout: "grid" | "list";
  onLayoutChange: (v: "grid" | "list") => void;
  className?: string;
}

export function SongFilters({
  category,
  onCategoryChange,
  keyFilter,
  onKeyChange,
  layout,
  onLayoutChange,
  className,
}: SongFiltersProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[150px] rounded-full">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {songCategories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={keyFilter} onValueChange={onKeyChange}>
        <SelectTrigger className="w-[110px] rounded-full">
          <SelectValue placeholder="Key" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All keys</SelectItem>
          {songKeys.map((k) => (
            <SelectItem key={k} value={k}>
              {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-1 rounded-full border border-border bg-secondary/40 p-1">
        <Button
          variant={layout === "grid" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onLayoutChange("grid")}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={layout === "list" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => onLayoutChange("list")}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
