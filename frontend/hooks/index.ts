"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { FilterState } from "@/types";

// ─── useDebounce ──────────────────────────────────────────
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── useFilters ───────────────────────────────────────────
export function useFilters(initial?: Partial<FilterState>) {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    level: "",
    minPrice: 0,
    maxPrice: 500,
    rating: 0,
    sort: "newest",
    ...initial,
  });

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({ category: "", level: "", minPrice: 0, maxPrice: 500, rating: 0, sort: "newest" });
  }, []);

  const hasActiveFilters =
    filters.category !== "" ||
    filters.level !== "" ||
    filters.minPrice !== 0 ||
    filters.maxPrice !== 500 ||
    filters.rating !== 0;

  return { filters, updateFilter, resetFilters, hasActiveFilters };
}

// ─── useLocalStorage ──────────────────────────────────────
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setStored = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const val = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(val));
        return val;
      });
    },
    [key]
  );

  return [value, setStored] as const;
}

// ─── useCountUp (for stats animation) ────────────────────
export function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, start]);

  return count;
}

// ─── useIntersectionObserver (trigger animations) ─────────
export function useInView(threshold = 0.1) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}
