"use client";

import { useEffect, useRef, useState } from "react";
import { journeyStore } from "@/three/animation/journeyStore";

export function JourneyDebugHud() {
  const ref = useRef<HTMLPreElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(new URLSearchParams(window.location.search).get("debug") === "1");
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const render = () => {
      if (ref.current) {
        ref.current.textContent = [
          "CARGOFLOW JOURNEY DEBUG",
          "",
          `scrollY       ${journeyStore.scrollY.toFixed(0)}`,
          `section top   ${journeyStore.sectionTop.toFixed(0)}`,
          `section h     ${journeyStore.sectionHeight.toFixed(0)}`,
          `travel        ${journeyStore.travel.toFixed(0)}`,
          "",
          `RAW           ${journeyStore.rawProgress.toFixed(4)}`,
          `PROGRESS      ${journeyStore.progress.toFixed(4)}`,
          `VELOCITY      ${journeyStore.velocity.toFixed(3)}`,
          `DIRECTION     ${journeyStore.direction > 0 ? "FORWARD" : "REVERSE"}`,
          `STAGE         ${journeyStore.stage}`,
          `WEBGL         ${journeyStore.canvasReady ? "READY" : "WAITING"}`,
          `RAF           ${journeyStore.rafActive ? "ACTIVE" : "IDLE"}`
        ].join("\n");
      }
      raf = window.requestAnimationFrame(render);
    };
    render();
    return () => window.cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) return null;
  return <pre ref={ref} className="debug-hud" aria-live="polite" />;
}
