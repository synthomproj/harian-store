"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const START_WIDTH = 12;
const MAX_WIDTH = 92;
const STEP_DELAY = 160;
const SHOW_DELAY = 120;

export function GlobalNavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<number | null>(null);
  const showTimerRef = useRef<number | null>(null);
  const navigationPendingRef = useRef(false);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const clearShowTimer = () => {
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
    };

    const advance = () => {
      setWidth((current) => {
        if (current >= MAX_WIDTH) {
          return current;
        }

        const next = current + Math.max(6, (MAX_WIDTH - current) * 0.18);
        timerRef.current = window.setTimeout(advance, STEP_DELAY);
        return Math.min(next, MAX_WIDTH);
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      if (anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (nextUrl.origin !== currentUrl.origin) {
        return;
      }

      if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) {
        return;
      }

      navigationPendingRef.current = true;
      clearShowTimer();
      clearTimer();
      showTimerRef.current = window.setTimeout(() => {
        if (!navigationPendingRef.current) {
          return;
        }

        setIsVisible(true);
        setWidth(START_WIDTH);
        timerRef.current = window.setTimeout(advance, STEP_DELAY);
      }, SHOW_DELAY);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      clearShowTimer();
      clearTimer();
    };
  }, []);

  useEffect(() => {
    navigationPendingRef.current = false;

    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (!isVisible) {
      return;
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const finishTimer = window.setTimeout(() => {
      startTransition(() => {
        setWidth(100);
      });
    }, 0);

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
      setWidth(0);
    }, 180);

    return () => {
      window.clearTimeout(finishTimer);
      window.clearTimeout(hideTimer);
    };
  }, [isVisible, pathname, searchParams]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-[#00d1ff] shadow-[0_2px_0_0_#000] transition-[width] duration-150 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
