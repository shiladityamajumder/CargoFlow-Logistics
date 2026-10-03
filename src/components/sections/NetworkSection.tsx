"use client";

import { Fragment, useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";
import { globeEase, routeEase } from "@/lib/motion";

const statistics = [
  ["1928", "Founded"], ["667 million", "annual turnover"], ["120+", "locations worldwide"],
  ["3.900", "Emonsians worldwide"], ["+1000", "Truck in permanent use"], ["370,000 m²", "warehouse space"]
] as const;

export function NetworkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const routesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const globe = globeRef.current;
    const routes = routesRef.current;
    if (!section || !globe || !routes) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation: AnimationItem | undefined;
    let disposed = false;
    let frame = 0;
    let previousTime = 0;
    let progress = 0;
    let target = 0;

    const render = () => {
      const grow = globeEase((progress - 0.15) / 0.55);
      const remainder = motion.matches ? 0 : 1 - grow;
      globe.style.transform = `translate3d(0, ${remainder * 100}svh, 0) scale(${1 + remainder}) rotate(${-15 * remainder}deg)`;
      const routeFrame = routeEase((progress - 0.3) / 0.7) * 0.65 * (animation?.totalFrames ?? 81);
      animation?.goToAndStop(routeFrame, true);
      section.dataset.progress = progress.toFixed(5);
      section.dataset.routeFrame = routeFrame.toFixed(3);
    };

    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 1000 / 60;
      previousTime = time;
      // The original timeline uses 90% smoothing: 10% convergence per 60Hz frame.
      progress += (target - progress) * (1 - Math.pow(0.9, elapsed / (1000 / 60)));
      if (Math.abs(target - progress) < 0.00001) progress = target;
      render();
      if (progress !== target) frame = requestAnimationFrame(tick);
      else { frame = 0; previousTime = 0; }
    };

    const measure = () => {
      const rect = section.getBoundingClientRect();
      target = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
      if (motion.matches) progress = target;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    void import("lottie-web").then(({ default: lottie }) => {
      if (disposed) return;
      animation = lottie.loadAnimation({
        container: routes,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/reference/planet-routes.json",
        rendererSettings: { preserveAspectRatio: "xMidYMid meet", progressiveLoad: false }
      });
      animation.addEventListener("DOMLoaded", render);
    });

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    motion.addEventListener("change", measure);
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      animation?.destroy();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      motion.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section ref={sectionRef} id="network" className="network-section" aria-label="Emons in numbers">
      <div className="network-panel">
        <div className="network-sticky">
          <p className="section-tag network-tag">Stats</p>
          <div className="network-stats">
            {[statistics.slice(0, 3), statistics.slice(3)].map((row, rowIndex) => (
              <div className="network-stat-row" key={rowIndex}>
                {row.map(([number, label], index) => (
                  <Fragment key={number}>
                    {index > 0 && <span className="network-divider" aria-hidden="true" />}
                    <div className="network-stat"><strong>{number === "370,000 m²" ? <>370,000 m<sup>2</sup></> : number}</strong><span>{label}</span></div>
                  </Fragment>
                ))}
              </div>
            ))}
          </div>
          <div ref={globeRef} className="network-globe">
            <div className="network-globe-art">
              <img className="network-planet" src="/reference/planet.webp" alt="A worldwide transport and logistics network" loading="lazy" />
              <div ref={routesRef} className="network-routes" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
