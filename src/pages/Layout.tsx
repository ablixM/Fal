import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import Lenis from "lenis";
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
    <div>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
