"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrolling() {
  useEffect(() => {
    const scrolling = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.8,
      gestureOrientation: "vertical",
      syncTouch: false,
      autoRaf: true,
      anchors: { offset: -84 },
      respectReducedMotion: true,
      virtualScroll: ({ event }) => !event.defaultPrevented,
      prevent: element => !!element.closest("dialog[open], .hotspot-panel, .header-search-panel")
    });
    return () => scrolling.destroy();
  }, []);
  return null;
}
