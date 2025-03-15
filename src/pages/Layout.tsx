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
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1.0,
      touchInertiaMultiplier: 0.6,
    });

    // Integrate Lenis with GSAP
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Update ScrollTrigger on scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Prevent lag during scroll
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup
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
