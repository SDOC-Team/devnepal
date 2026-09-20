"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

import { createGlobeScene } from "./hero-globe/scene";

const LAND_MASK_URL = "/hero/land-mask.png";

function HeroDataViz({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = hostRef.current;
    const canvasHost = canvasHostRef.current;
    if (!shell || !canvasHost) return;

    const globe = createGlobeScene(canvasHost);
    if (!globe) return;

    // Data marks (arcs, hub, cities) use the chart blue, which is the same in
    // both themes and stays readable on the dark page where --primary darkens.
    // Land dots and graticule use the neutral.
    const syncPalette = () => {
      const style = getComputedStyle(shell);
      globe.setPalette(
        style.getPropertyValue("--chart-3"),
        style.getPropertyValue("--muted-foreground"),
      );
    };
    syncPalette();

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => globe.setReducedMotion(reducedMotion.matches);
    syncMotion();
    reducedMotion.addEventListener("change", syncMotion);

    const abort = new AbortController();
    globe.loadLand(LAND_MASK_URL, abort.signal).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("hero globe: land mask failed to load", error);
    });

    // Frame loop. Paused while the box is scrolled off-screen; hidden tabs
    // already stop requestAnimationFrame on their own.
    let frameId = 0;
    let last = 0;
    let running = false;
    const loop = (now: number) => {
      frameId = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      globe.frame(dt);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      frameId = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(frameId);
    };
    const intersection = new IntersectionObserver((entries) => {
      if (entries[entries.length - 1].isIntersecting) start();
      else stop();
    });
    intersection.observe(shell);
    start();

    // Refitting clears the canvas, so paint a frame right away rather than
    // waiting for the next animation frame.
    const resize = new ResizeObserver(() => {
      globe.resize();
      globe.frame(0);
    });
    resize.observe(canvasHost);

    const theme = new MutationObserver(syncPalette);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      abort.abort();
      stop();
      intersection.disconnect();
      resize.disconnect();
      theme.disconnect();
      reducedMotion.removeEventListener("change", syncMotion);
      globe.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      data-slot="hero-data-viz"
      className={cn("relative isolate h-64 min-w-0 sm:h-80 lg:h-full lg:min-h-[26rem]", className)}
    >
      <div
        ref={canvasHostRef}
        className="absolute inset-0 cursor-grab data-dragging:cursor-grabbing lg:-inset-12"
      />
    </div>
  );
}

export { HeroDataViz };
