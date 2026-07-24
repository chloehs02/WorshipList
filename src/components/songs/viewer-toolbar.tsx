"use client";

import { Minus, Plus, Play, Pause, Type, Eye, EyeOff, Columns2, Columns3, LayoutList } from "lucide-react";
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
  showChords?: boolean;
  onToggleShowChords?: () => void;
  columns?: 1 | 2 | 3;
  onColumnsChange?: (cols: 1 | 2 | 3) => void;
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
  showChords = true,
  onToggleShowChords,
  columns = 1,
  onColumnsChange,
  className,
}: ViewerToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/70 p-2.5 shadow-sm", className)}>
      {/* Font scale controller */}
      <div className="flex items-center gap-1 rounded-full bg-secondary/50 p-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onDecrease} aria-label="Decrease font size">
          <Minus className="h-3.5 w-3.5" />
        </Button>
        <span className="w-10 text-center text-xs font-semibold tabular-nums">{Math.round(fontScale * 100)}%</span>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onIncrease} aria-label="Increase font size">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Show / Hide Chords toggle */}
      {onToggleShowChords && (
        <Button
          variant={showChords ? "accent" : "outline"}
          size="sm"
          className="gap-1.5 rounded-full"
          onClick={onToggleShowChords}
        >
          {showChords ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          <span>{showChords ? "Hide chords" : "Show chords"}</span>
        </Button>
      )}

      {/* Column layout toggle */}
      {onColumnsChange && (
        <div className="flex items-center gap-1 rounded-full bg-secondary/50 p-1">
          <Button
            variant={columns === 1 ? "accent" : "ghost"}
            size="sm"
            className="h-7 px-2.5 rounded-full text-xs gap-1"
            onClick={() => onColumnsChange(1)}
            title="1 Column"
          >
            <LayoutList className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">1 Col</span>
          </Button>
          <Button
            variant={columns === 2 ? "accent" : "ghost"}
            size="sm"
            className="h-7 px-2.5 rounded-full text-xs gap-1"
            onClick={() => onColumnsChange(2)}
            title="2 Columns"
          >
            <Columns2 className="h-3.5 w-3.5" />
            <span>2 Cols</span>
          </Button>
          <Button
            variant={columns === 3 ? "accent" : "ghost"}
            size="sm"
            className="h-7 px-2.5 rounded-full text-xs gap-1"
            onClick={() => onColumnsChange(3)}
            title="3 Columns"
          >
            <Columns3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">3 Cols</span>
          </Button>
        </div>
      )}

      {/* Stage mode toggle */}
      <Button
        variant={stageMode ? "accent" : "outline"}
        size="sm"
        className="gap-1.5 rounded-full"
        onClick={onToggleStageMode}
      >
        <Type className="h-3.5 w-3.5" />
        <span>Stage mode</span>
      </Button>

      {/* Auto-scroll toggle */}
      <Button
        variant={isScrolling ? "accent" : "outline"}
        size="sm"
        className="gap-1.5 rounded-full"
        onClick={onToggleScroll}
      >
        {isScrolling ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        <span>Auto-scroll</span>
      </Button>

      {/* Scroll speed slider */}
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
