"use client";

import { RefObject, useEffect } from "react";
import { clamp01 } from "@/lib/math";
import { getJourneyStage, journeyStore } from "@/three/animation/journeyStore";

export function JourneyScrollController({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let scheduled = 0;
    let destroyed = false;
    let previousTime = performance.now();
    let previousProgress = journeyStore.progress;
    const meterNumber = section.querySelector<HTMLElement>(".journey-meter__number");

    const measure = () => {
      scheduled = 0;
      if (destroyed) return;

      const rect = section.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const sectionTop = scrollY + rect.top;
      const sectionHeight = section.offsetHeight;
      const travel = Math.max(sectionHeight - window.innerHeight, 1);
      const raw = (scrollY - sectionTop) / travel;
      const next = clamp01(raw);
      const now = performance.now();
      const dt = Math.max((now - previousTime) / 1000, 1 / 120);

      journeyStore.scrollY = scrollY;
      journeyStore.sectionTop = sectionTop;
      journeyStore.sectionHeight = sectionHeight;
      journeyStore.travel = travel;
      journeyStore.rawProgress = raw;
      journeyStore.previousProgress = journeyStore.progress;
      journeyStore.progress = next;
      journeyStore.velocity = (next - previousProgress) / dt;
      journeyStore.direction = next >= previousProgress ? 1 : -1;
      journeyStore.stage = getJourneyStage(next);
      journeyStore.rafActive = true;

      section.style.setProperty("--journey-progress", next.toFixed(5));
      section.dataset.stage = journeyStore.stage.toLowerCase();
      if (meterNumber) meterNumber.textContent = `${Math.round(next * 100)}%`;

      previousProgress = next;
      previousTime = now;
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule, { passive: true });
    schedule();

    document.fonts?.ready.then(schedule).catch(() => undefined);

    return () => {
      destroyed = true;
      if (scheduled) window.cancelAnimationFrame(scheduled);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      journeyStore.rafActive = false;
    };
  }, [sectionRef]);

  return null;
}
