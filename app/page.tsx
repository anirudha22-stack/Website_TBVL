"use client";

import { useCallback, useEffect, useState } from "react";
import { SceneHost } from "@/components/canvas/SceneHost";
import { Preloader } from "@/components/intro/Preloader";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { Hero } from "@/components/hero/Hero";
import { Principles } from "@/components/sections/Principles";
import { Research } from "@/components/sections/Research";
import { Publications } from "@/components/sections/Publications";
import { Startups } from "@/components/sections/Startups";
import { Members } from "@/components/sections/Members";
import { News } from "@/components/sections/News";
import { Achievements } from "@/components/sections/Achievements";
import { Footer } from "@/components/sections/Footer";
import { startSmoothScroll } from "@/lib/smooth";

export default function Page() {
  const [entered, setEntered] = useState(false);
  // The intro decides when three.js may start. Building the scene costs
  // one long synchronous block, and it is spent during the intro's hold
  // rather than across one of its fades.
  const [prepared, setPrepared] = useState(false);

  useEffect(() => startSmoothScroll(), []);

  // Stable identities. Passed as inline arrows these changed on every
  // render, which restarted the intro's sequence effect part-way through.
  const handlePrepare = useCallback(() => setPrepared(true), []);
  const handleDone = useCallback(() => setEntered(true), []);

  return (
    <>
      {/* Room light. A cold pool behind the face, one warm-violet bloom
          low and left, and a deep vignette so the page and the 3D above
          it agree about where the light is coming from. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(115% 80% at 50% 4%, rgba(38,92,190,0.20) 0%, transparent 58%)," +
            "radial-gradient(85% 65% at 8% 88%, rgba(120,88,220,0.10) 0%, transparent 62%)," +
            "radial-gradient(140% 130% at 50% 50%, transparent 38%, rgba(5,7,11,0.88) 100%)",
        }}
      />

      <SceneHost start={prepared} />

      <Preloader onPrepare={handlePrepare} onDone={handleDone} />
      <FloatingNav />

      <main className="relative z-10">
        <Hero ready={entered} />
        <Principles />
        <Research />
        <Publications />
        <Startups />
        <Members />
        <News />
        <Achievements />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
