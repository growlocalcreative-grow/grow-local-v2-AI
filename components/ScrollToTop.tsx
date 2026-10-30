"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const getTargetHash = () => {
      if (typeof window === "undefined") return "";
      // Check custom window variable first if passed during cross-page navigation
      const globalTarget = (window as unknown as { __targetHash?: string | null }).__targetHash;
      if (globalTarget) return globalTarget;

      // Check standard location hash
      if (window.location.hash) return window.location.hash;

      // Fallback check in href
      const href = window.location.href;
      const hashIdx = href.indexOf("#");
      if (hashIdx !== -1) {
        return href.substring(hashIdx);
      }
      return "";
    };

    const scrollToHash = (smooth = true): boolean => {
      const rawHash = getTargetHash();
      if (!rawHash) return false;
      const targetId = rawHash.replace(/^#/, "");
      if (!targetId) return false;

      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: smooth ? "smooth" : "auto",
        });
        return true;
      }
      return false;
    };

    const rawHash = getTargetHash();
    if (rawHash) {
      // Clear global pending target after reading
      if (typeof window !== "undefined") {
        (window as unknown as { __targetHash?: string | null }).__targetHash = null;
      }

      // First attempt immediately
      if (!scrollToHash(false)) {
        // If the section element hasn't mounted yet, retry on animation frames / intervals
        const retries = [40, 90, 180, 350, 600, 1000];
        const timers = retries.map((delay) =>
          setTimeout(() => {
            scrollToHash(true);
          }, delay)
        );
        return () => timers.forEach(clearTimeout);
      } else {
        // Run once more after 150ms to ensure any late font/image layout shift is compensated
        const timer = setTimeout(() => {
          scrollToHash(true);
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      // No hash present: scroll to top of page on route change
      window.scrollTo(0, 0);
      const timer = setTimeout(() => {
        if (!window.location.hash && !getTargetHash()) {
          window.scrollTo(0, 0);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Handle in-page hash changes (e.g. back/forward navigation or manual URL updates)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const targetId = hash.replace(/^#/, "");
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  return null;
}

