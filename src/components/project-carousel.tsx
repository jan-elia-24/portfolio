"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import FeaturedCard from "@/components/featured-card";
import type { Featured } from "@/lib/github";

const ANGLE_STEP = 42;
const RADIUS = 400;
const CARD_WIDTH = 280;
const CARD_HALF_HEIGHT = 168;
const TILT_DEG = 22;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const rand = seededRandom(7);
const STARS = Array.from({ length: 46 }, () => ({
  left: rand() * 100,
  top: rand() * 100,
  size: 1 + rand() * 2,
  opacity: 0.3 + rand() * 0.5,
  delay: rand() * 4,
  duration: 2.5 + rand() * 3,
}));

export default function ProjectCarousel({ items }: { items: Featured[] }) {
  const [active, setActive] = useState(0);
  const count = items.length;

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + count) % count);

  return (
    <div className="relative">
      <button
        onClick={() => go(-1)}
        aria-label="Previous project"
        className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-12 rounded-full border border-white/15 bg-black/30 backdrop-blur text-neutral-200 transition-all duration-200 hover:border-emerald-400 hover:text-emerald-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next project"
        className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center size-12 rounded-full border border-white/15 bg-black/30 backdrop-blur text-neutral-200 transition-all duration-200 hover:border-emerald-400 hover:text-emerald-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div
        className="relative mx-auto h-[460px]"
        style={{ perspective: "1600px" }}
      >
        {/* Starfield + planet-atmosphere glow backdrop */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 560,
              height: 560,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 40%, transparent 72%)",
              filter: "blur(6px)",
            }}
          />
          {STARS.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white"
              style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
              animate={{ opacity: [s.opacity * 0.35, s.opacity, s.opacity * 0.35] }}
              transition={{ duration: s.duration, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
            />
          ))}
        </div>

        {/* Tilted 3D ring — viewed from slightly above. pointer-events-none so the
            tilted ring plane doesn't swallow clicks on the half of each card that
            sits behind it in 3D space; cards re-enable pointer events themselves. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transformStyle: "preserve-3d", transform: `rotateX(${TILT_DEG}deg)` }}
        >
          {items.map((p, i) => {
            let offset = i - active;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const angle = offset * ANGLE_STEP;
            const rad = (angle * Math.PI) / 180;
            const x = Math.sin(rad) * RADIUS;
            const z = Math.cos(rad) * RADIUS - RADIUS;
            const isActive = offset === 0;
            const abs = Math.abs(offset);

            return (
              <motion.div
                key={p.slug}
                className="absolute left-1/2 top-1/2"
                style={{
                  width: CARD_WIDTH,
                  marginLeft: -CARD_WIDTH / 2,
                  zIndex: 10 - abs,
                  pointerEvents: abs > 2 ? "none" : "auto",
                }}
                initial={false}
                animate={{
                  x,
                  y: -CARD_HALF_HEIGHT,
                  z,
                  rotateX: -TILT_DEG,
                  rotateY: -angle,
                  scale: isActive ? 1.15 : Math.max(0.58, 0.9 - abs * 0.18),
                  opacity: abs > 2 ? 0 : 1 - abs * 0.4,
                  filter: isActive ? "brightness(1)" : "brightness(0.4) blur(1.5px)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <div className="relative">
                  <FeaturedCard p={p} />
                  {!isActive && (
                    <button
                      aria-label={`Show ${p.title}`}
                      onClick={() => setActive(i)}
                      className="absolute inset-0 cursor-pointer"
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
