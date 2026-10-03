"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ServiceGlyph } from "@/components/ui/ServiceGlyph";

const FRAME_SECONDS = 46 / 1103;
const TRANSITION_MS = 1000;
const scenes = [
  { id: "road", label: "Road", icon: "truck", start: 0, end: 216, entry: null, entryEnd: null, hotspots: [{ left: "27%", top: "37%", title: "Road" }, { right: "30%", top: "33%", title: "Our freight forwarders" }], text: "More than 1,000 vehicles connect customers across Europe and Asia. General cargo, part loads and full truckloads move through one coordinated road network." },
  { id: "logistics", label: "Logistics", icon: "warehouse", start: 258, end: 403, entry: 220, entryEnd: 254, hotspots: [{ left: "39%", top: "29%", title: "Our logistics facilities" }], text: "Smart warehouse solutions, careful handling and connected information support the entire journey, from goods arriving to orders leaving the warehouse." },
  { id: "air", label: "Air & Sea", icon: "plane", start: 470, end: 614, entry: 410, entryEnd: 467, hotspots: [{ left: "27%", top: "24%", title: "Customs" }, { left: "47%", top: "53%", title: "Sea" }, { right: "30%", top: "27%", title: "Air" }], text: "International freight combines air and ocean connections with customs expertise. Our teams coordinate the collection, documentation and onward delivery." },
  { id: "rail", label: "Rail", icon: "train", start: 662, end: 788, entry: 622, entryEnd: 652, hotspots: [{ left: "39%", top: "38%", title: "Rail Cargo" }], text: "Daily departures, our own locomotives and connected terminals bring road and rail together for dependable international freight transport." },
  { id: "digital", label: "Digital", icon: "package", start: 827, end: 1091, entry: 795, entryEnd: 824, hotspots: [{ right: "36%", top: "29%", title: "Headquarters" }], text: "Our people, locations and digital systems work together to plan, coordinate and follow every shipment through a worldwide logistics network." }
] as const;

export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const selectRef = useRef<(index: number) => void>(() => undefined);
  const [stage, setStage] = useState(0);
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const [hotspot, setHotspot] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const element = interfaceRef.current;
    const section = sectionRef.current;
    if (!element || !section) return;
    const measure = () => section.style.setProperty("--journey-interface-height", `${element.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;
    const panels = panelsRef.current.filter((panel): panel is HTMLDivElement => panel !== null);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 0;
    let busy = false;
    let disposed = false;
    let loopEnabled = true;
    let loopTimer: ReturnType<typeof setTimeout> | undefined;
    let pendingMetadata: (() => void) | undefined;
    let wheelAmount = 0;
    let lastWheelAt = 0;
    let touchY = 0;
    let touchConsumed = false;

    const atTop = () => Math.abs(section.getBoundingClientRect().top) <= 4;
    const insideControl = (target: EventTarget | null) => target instanceof Element &&
      !!target.closest(".hotspot-panel, .header-search-panel, .site-nav--open, dialog[open], input, textarea, select, [data-native-scroll]");

    const context = gsap.context(() => {
      panels.forEach((panel, index) => gsap.set(panel, { yPercent: index === 0 ? 0 : 100, autoAlpha: index === 0 ? 1 : 0 }));
    }, section);

    const playScene = (index: number, forward: boolean) => {
      clearTimeout(loopTimer);
      if (pendingMetadata) video.removeEventListener("loadedmetadata", pendingMetadata);
      const scene = scenes[index];
      const transition = forward && scene.entry !== null;
      loopEnabled = !transition;
      const activate = () => {
        if (disposed) return;
        video.currentTime = (transition ? scene.entry! : scene.start) * FRAME_SECONDS;
        if (motion.matches) video.pause();
        else void video.play().catch(() => undefined);
        if (transition) {
          const duration = (scene.entryEnd! - scene.entry!) / 24;
          loopTimer = setTimeout(() => { loopEnabled = true; }, duration * 1000);
        }
      };
      if (video.readyState >= 1) activate();
      else {
        pendingMetadata = activate;
        video.addEventListener("loadedmetadata", activate, { once: true });
      }
    };

    const changeScene = (index: number) => {
      if (busy || index === current || index < 0 || index >= scenes.length) return false;
      const from = current;
      const direction = index > from ? 1 : -1;
      busy = true;
      current = index;
      setStage(index);
      setMoving(true);
      setHotspot(null);
      playScene(index, direction > 0);
      const duration = motion.matches ? 0 : TRANSITION_MS / 1000;
      gsap.killTweensOf(panels);
      gsap.set(panels.filter((_, i) => i !== from && i !== index), { autoAlpha: 0 });
      gsap.fromTo(panels[from], { yPercent: 0, autoAlpha: 1 }, { yPercent: -100 * direction, duration, ease: "power1.out" });
      gsap.fromTo(panels[index], { yPercent: 100 * direction, autoAlpha: 1 }, {
        yPercent: 0, duration, ease: "power1.out",
        onComplete: () => {
          if (disposed) return;
          gsap.set(panels[from], { autoAlpha: 0 });
          busy = false;
          setMoving(false);
          setActiveTab(index === scenes.length - 1 ? null : index);
        }
      });
      return true;
    };

    selectRef.current = (index: number) => {
      if (!atTop()) {
        const top = scrollY + section.getBoundingClientRect().top;
        window.scrollTo({ top, behavior: "instant" });
      }
      changeScene(index);
    };

    const onWheel = (event: WheelEvent) => {
      if (!atTop() || insideControl(event.target) || event.ctrlKey) return;
      if (busy) { event.preventDefault(); return; }
      const now = performance.now();
      if (now - lastWheelAt > 150) wheelAmount = 0;
      lastWheelAt = now;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      const forward = delta > 0;
      const canChange = forward ? current < scenes.length - 1 : current > 0;
      if (!canChange) return;
      event.preventDefault();
      if (Math.sign(wheelAmount) !== Math.sign(delta)) wheelAmount = 0;
      wheelAmount += delta;
      if (Math.abs(wheelAmount) > 10) {
        wheelAmount = 0;
        changeScene(current + (forward ? 1 : -1));
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      touchY = event.touches[0]?.clientY ?? 0;
      touchConsumed = false;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!atTop() || insideControl(event.target) || event.touches.length !== 1) return;
      if (touchConsumed || busy) { event.preventDefault(); return; }
      const delta = touchY - event.touches[0].clientY;
      if (Math.abs(delta) <= 10) return;
      const next = current + (delta > 0 ? 1 : -1);
      if (next >= 0 && next < scenes.length) {
        event.preventDefault();
        touchConsumed = true;
        changeScene(next);
      }
    };

    const onKey = (event: KeyboardEvent) => {
      if (!atTop() || insideControl(event.target) || event.altKey || event.metaKey || event.ctrlKey) return;
      const forward = event.key === "ArrowDown" || event.key === "PageDown" || (event.key === " " && !event.shiftKey);
      const backward = event.key === "ArrowUp" || event.key === "PageUp" || (event.key === " " && event.shiftKey);
      if (!forward && !backward) return;
      if (event.key === " " && event.target instanceof Element && event.target.closest("button,a")) return;
      const next = current + (forward ? 1 : -1);
      if (busy || (next >= 0 && next < scenes.length)) {
        event.preventDefault();
        if (!busy) changeScene(next);
      }
    };

    const loop = () => {
      if (!loopEnabled || motion.matches) return;
      const scene = scenes[current];
      if (video.currentTime >= scene.end * FRAME_SECONDS - 0.1) video.currentTime = scene.start * FRAME_SECONDS;
    };
    const visibility = () => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= innerHeight || document.hidden || motion.matches) video.pause();
      else if (video.paused) void video.play().catch(() => undefined);
    };

    if (section.getBoundingClientRect().top < -4) {
      current = scenes.length - 1;
      setStage(current);
      setActiveTab(null);
      gsap.set(panels, { autoAlpha: 0 });
      gsap.set(panels[current], { yPercent: 0, autoAlpha: 1 });
    }
    playScene(current, false);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("scroll", visibility, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", visibility);
    video.addEventListener("timeupdate", loop);
    return () => {
      disposed = true;
      clearTimeout(loopTimer);
      if (pendingMetadata) video.removeEventListener("loadedmetadata", pendingMetadata);
      gsap.killTweensOf(panels);
      context.revert();
      video.pause();
      video.removeEventListener("timeupdate", loop);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("keydown", onKey, { capture: true });
      window.removeEventListener("scroll", visibility);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", visibility);
      selectRef.current = () => undefined;
    };
  }, []);

  return (
    <section ref={sectionRef} id="journey" className="journey-section" data-stage={scenes[stage].id} data-transitioning={moving} aria-label="Explore the Emons transport and logistics world">
      <div className="journey-sticky">
        <div className="journey-film" aria-hidden="true">
          <img className={`journey-poster${ready ? " journey-poster--hidden" : ""}`} src="/reference/hero-poster.webp" alt="" fetchPriority="high" />
          <video ref={videoRef} src="/reference/journey.mp4" poster="/reference/hero-poster.webp" muted playsInline preload="auto" onLoadedData={() => setReady(true)} />
        </div>
        <div className="journey-wash" aria-hidden="true" />

        {scenes.map((scene, index) => (
          <div ref={element => { panelsRef.current[index] = element; }} key={scene.id} className={`journey-scene-panel journey-scene-panel--${scene.id}`} aria-hidden={index !== stage} inert={index !== stage}>
            <div className="hero-hotspots">
              {scene.hotspots.map((point, pointIndex) => (
                <div className="hero-hotspot-anchor" key={point.title} style={{ left: "left" in point ? point.left : undefined, right: "right" in point ? point.right : undefined, top: point.top }}>
                  <button type="button" className={`hero-hotspot${stage === index && hotspot === pointIndex ? " is-open" : ""}`} aria-expanded={stage === index && hotspot === pointIndex} aria-label={`Explore ${point.title}`} onClick={() => setHotspot(hotspot === pointIndex ? null : pointIndex)}>{stage === index && hotspot === pointIndex ? "−" : "+"}</button>
                  {stage === index && hotspot === pointIndex && (
                    <aside className="hotspot-panel"><p className="section-tag">{scene.label}</p><h2>{point.title}</h2><p>{scene.text}</p><a href="#services" className="pill-link" onClick={() => setHotspot(null)}>Find out more <span>↗</span></a></aside>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div ref={interfaceRef} className="journey-interface">
        <article className="hero-copy">
          <h1>Emons - your forwarding company for transport &amp; logistics</h1>
          <p>Tailored services — global, connected and efficient. Whether by road, air, water or rail — we deliver your cargo safely to its destination. With digital tools and personal service.</p>
          <div className="hero-actions"><a href="#services" className="pill-link">Services overview</a><a href="#contact" className="pill-link">For the freight request</a></div>
        </article>

        <div className="journey-controls">
          <nav className="journey-tabs" aria-label="Choose a transport scene">
            {scenes.map((scene, index) => (
              <button key={scene.id} type="button" className={activeTab === index ? "is-active" : ""} aria-pressed={activeTab === index} aria-label={`Explore ${scene.label}`} onClick={() => selectRef.current(index)}>
                <span className="journey-tab-number">0{index + 1}</span><span className="journey-tab-content"><ServiceGlyph type={scene.icon} /><span className="journey-tab-label">{scene.label}</span></span>
              </button>
            ))}
          </nav>
          <a href="#services" className="pill-link journey-all-services">All services <span>↗</span></a>
        </div>
        </div>
      </div>
    </section>
  );
}
