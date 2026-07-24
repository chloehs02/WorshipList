"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Smoothly auto-scrolls a container element at an adjustable speed.
 * speed: pixels per tick (1-10), higher = faster.
 */
export function useAutoScroll(containerRef: React.RefObject<HTMLElement | null>) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(3);
  const frame = useRef<number | null>(null);
  const accumulated = useRef(0);

  const tick = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    accumulated.current += speed * 0.06;
    if (accumulated.current >= 1) {
      el.scrollTop += Math.floor(accumulated.current);
      accumulated.current = 0;
    }
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
      setIsScrolling(false);
      return;
    }
    frame.current = requestAnimationFrame(tick);
  }, [containerRef, speed]);

  useEffect(() => {
    if (isScrolling) {
      frame.current = requestAnimationFrame(tick);
    } else if (frame.current) {
      cancelAnimationFrame(frame.current);
    }
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [isScrolling, tick]);

  const toggle = useCallback(() => setIsScrolling((s) => !s), []);
  const stop = useCallback(() => setIsScrolling(false), []);

  return { isScrolling, toggle, stop, speed, setSpeed };
}
