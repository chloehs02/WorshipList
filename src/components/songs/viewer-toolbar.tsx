"use client";

import { Minus, Plus, Play, Pause, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ViewerToolbarProps {
  fontScale: number;
  onIncrease: () => void;
  onDecrease: () => void;
  stageMode: boolean;
  onToggleStageMode: () => void;
  isScrolling: boolean;
  onToggleScroll: () => void;
  scrollSpeed: number;
  onScrollSpeedChange: (v: number) => void;
  className?: string;
}

export function ViewerToolbar({
  fontScale,
  onIncrease,
  onDecrease,
  stageMode,
  onToggleStageMode,
  isScrolling,
  onToggleScroll,
  scrollSpeed,
  onScrollSpeedChange,
  className,
}: ViewerToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/70 p-2", className)}>
      <div className="flex items-center gap-1 rounded-full bg-secondary/50 p-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onDecrease} aria-label="Decrease font size">
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-10 text-center text-xs font-medium tabular-nums">{Math.round(fontScale * 100)}%</span>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onIncrease} aria-label="Increase font size">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Button
        variant={stageMode ? "accent" : "outline"}
        size="sm"
        className="gap-1.5 rounded-full"
        onClick={onToggleStageMode}
      >
        <Type className="h-3.5 w-3.5" />
        Stage mode
      </Button>

      <Button
        variant={isScrolling ? "accent" : "outline"}
        size="sm"
        className="gap-1.5 rounded-full"
        onClick={onToggleScroll}
      >
        {isScrolling ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        Auto-scroll
      </Button>

      <div className="flex min-w-[110px] flex-1 items-center gap-2 px-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Speed</span>
        <Slider
          value={[scrollSpeed]}
          min={1}
          max={10}
          step={1}
          onValueChange={([v]) => onScrollSpeedChange(v)}
          className="max-w-[120px]"
        />
      </div>
    </div>
  );
}
