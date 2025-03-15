import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Lenis from "lenis";
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Layout() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => gsap.parseEase("power2.out")(t),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.2,
      wheelMultiplier: 1.0,
      touchInertiaMultiplier: 0.4,
      syncTouch: true,
    });

    let isTouching = false;

    document.addEventListener(
      "touchstart",
      () => {
        isTouching = true;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      () => {
        isTouching = false;
      },
      { passive: true }
    );

    gsap.ticker.add((time) => {
      if (!isTouching || lenis.velocity < 5) {
        lenis.raf(time * 1000);
      }
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-16">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
