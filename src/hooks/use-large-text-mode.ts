"use client";

import { useState } from "react";

const MIN_SCALE = 0.85;
const MAX_SCALE = 2.2;
const STEP = 0.15;

export function useFontScale(initial = 1) {
  const [scale, setScale] = useState(initial);

  const increase = () => setScale((s) => Math.min(MAX_SCALE, +(s + STEP).toFixed(2)));
  const decrease = () => setScale((s) => Math.max(MIN_SCALE, +(s - STEP).toFixed(2)));
  const reset = () => setScale(1);

  return { scale, increase, decrease, reset, setScale };
}
