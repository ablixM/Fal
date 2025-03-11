import { ReactNode, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLocation } from "react-router-dom";

gsap.registerPlugin(useGSAP);

interface PageTransitionProps {
  children: ReactNode;
}

const arr = [1, 2, 3, 4, 5];
const customEase = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(true);
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Timeline for enter animation
  const enterAnimation = () => {
    const tl = gsap.timeline();

    // Reset bars to full height
    gsap.set(".bar", { height: "100%" });

    // Animate bars to height 0 (revealing content)
    tl.to(".bar", {
      duration: 1.5,
      height: 0,
      stagger: {
        amount: 0.5,
        from: "start",
      },
      ease: customEase,
      delay: 0.2,
    });

    gsap.from(".overlay-2", {
      duration: 1.5,
      opacity: 1,
      ease: customEase,
      delay: 0.2,
    });

    gsap.to(".overlay-2", {
      duration: 1.5,
      opacity: 0,
      ease: customEase,
      delay: 0.2,
    });

    return tl;
  };

  // Timeline for exit animation
  const exitAnimation = () => {
    const tl = gsap.timeline();

    // Reset bars to height 0
    gsap.set(".bar", { height: 0 });

    // Animate bars to full height (covering content)
    tl.to(".bar", {
      duration: 1.5,
      height: "100%",
      stagger: {
        amount: 0.5,
        from: "start",
      },
      ease: customEase,
    });

    return tl;
  };

  useEffect(() => {
    // If the path has changed, trigger the transition
    if (prevPath !== location.pathname) {
      setIsNavigating(true);
      setPrevPath(location.pathname);
    }
  }, [location.pathname, prevPath]);

  useGSAP(() => {
    if (isNavigating) {
      const ctx = gsap.context(() => {
        exitAnimation().then(() => {
          enterAnimation();
          setIsNavigating(false);
        });
      });
      return () => ctx.revert();
    }
  }, [location.pathname, isNavigating]);

  return (
    <>
      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Overlay with bars */}
      <div className="overlay fixed inset-0 z-50 pointer-events-none">
        <div className="grid grid-cols-10 h-full w-full">
          {arr.map((item) => (
            <div
              key={item}
              className="bar bg-[var(--color-secondary)] w-full h-full transform-origin-top"
            />
          ))}
        </div>
      </div>
      <div className="overlay-2 bg-[var(--color-secondary)] fixed inset-0 z-50 pointer-events-none"></div>
    </>
  );
}

export default PageTransition;
