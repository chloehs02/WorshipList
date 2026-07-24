"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transposeKeyLabel } from "@/lib/chords/transpose";
import { cn } from "@/lib/utils";

interface TransposeControllerProps {
  originalKey: string;
  semitones: number;
  onChange: (semitones: number) => void;
  className?: string;
}

export function TransposeController({ originalKey, semitones, onChange, className }: TransposeControllerProps) {
  const displayKey = transposeKeyLabel(originalKey, semitones);

  return (
    <div className={cn("flex items-center gap-1 rounded-full border border-border bg-secondary/40 p-1", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onChange(semitones - 1)}
        aria-label="Transpose down"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>

      <div className="flex min-w-[64px] flex-col items-center px-1">
        <span className="font-display text-sm font-bold leading-none">{displayKey}</span>
        {semitones !== 0 && (
          <span className="text-[10px] leading-none text-muted-foreground mt-0.5">
            {semitones > 0 ? `+${semitones}` : semitones} from {originalKey}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={() => onChange(semitones + 1)}
        aria-label="Transpose up"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>

      {semitones !== 0 && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground"
          onClick={() => onChange(0)}
          aria-label="Reset transpose"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
