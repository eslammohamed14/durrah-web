"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface RangeValue {
  min: number;
  max: number;
}

interface UseRangeQueryParamsOptions {
  minKey: string;
  maxKey: string;
  limits: RangeValue;
  debounceMs?: number;
}

function clampRange(range: RangeValue, limits: RangeValue): RangeValue {
  const clampedMin = Math.max(limits.min, Math.min(range.min, limits.max));
  const clampedMax = Math.max(limits.min, Math.min(range.max, limits.max));
  return clampedMin <= clampedMax
    ? { min: clampedMin, max: clampedMax }
    : { min: clampedMax, max: clampedMax };
}

function parseRange(
  searchParams: ReturnType<typeof useSearchParams>,
  minKey: string,
  maxKey: string,
  limits: RangeValue,
): RangeValue {
  const rawMin = Number(searchParams.get(minKey));
  const rawMax = Number(searchParams.get(maxKey));

  const parsed = {
    min: Number.isFinite(rawMin) ? rawMin : limits.min,
    max: Number.isFinite(rawMax) ? rawMax : limits.max,
  };

  return clampRange(parsed, limits);
}

export function useRangeQueryParams({
  minKey,
  maxKey,
  limits,
  debounceMs = 80,
}: UseRangeQueryParamsOptions): [
  RangeValue,
  (nextRange: RangeValue) => void,
  () => void,
] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlRange = useMemo(
    () => parseRange(searchParams, minKey, maxKey, limits),
    [limits, maxKey, minKey, searchParams],
  );

  const [localRange, setLocalRange] = useState<RangeValue>(urlRange);
  const isDraggingRef = useRef(false);
  const pendingCommitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRangeRef = useRef(localRange);
  const lastCommittedRef = useRef(`${urlRange.min}:${urlRange.max}`);

  useEffect(() => {
    latestRangeRef.current = localRange;
  }, [localRange]);

  useEffect(() => {
    const nextCommitted = `${urlRange.min}:${urlRange.max}`;
    lastCommittedRef.current = nextCommitted;
    if (!isDraggingRef.current) {
      setLocalRange(urlRange);
    }
  }, [urlRange]);

  useEffect(() => {
    return () => {
      if (pendingCommitRef.current) {
        clearTimeout(pendingCommitRef.current);
      }
    };
  }, []);

  const setRange = useCallback(
    (nextRange: RangeValue) => {
      isDraggingRef.current = true;
      setLocalRange(clampRange(nextRange, limits));
    },
    [limits],
  );

  const commitRange = useCallback(() => {
    isDraggingRef.current = false;
    if (pendingCommitRef.current) {
      clearTimeout(pendingCommitRef.current);
    }

    pendingCommitRef.current = setTimeout(() => {
      const nextRange = clampRange(latestRangeRef.current, limits);
      const nextCommitted = `${nextRange.min}:${nextRange.max}`;

      if (nextCommitted === lastCommittedRef.current) {
        return;
      }

      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set(minKey, String(nextRange.min));
      nextParams.set(maxKey, String(nextRange.max));
      const qs = nextParams.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

      lastCommittedRef.current = nextCommitted;
    }, debounceMs);
  }, [debounceMs, limits, maxKey, minKey, pathname, router, searchParams]);

  return [localRange, setRange, commitRange];
}
