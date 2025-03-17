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
const TRANSITION_DURATION = 1.5; // Reduced duration for better responsiveness

function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(true);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [displayedChildren, setDisplayedChildren] =
    useState<ReactNode>(children);
  const [isAnimating, setIsAnimating] = useState(false);

  // Timeline for enter animation (revealing content)
  const enterAnimation = () => {
    const tl = gsap.timeline();

    // Reset bars to full height and ensure proper transform origin
    gsap.set(".bar", {
      height: "100%",
      transformOrigin: "top",
      xPercent: 0,
    });

    // Animate bars to height 0 (revealing content)
    tl.to(".bar", {
      duration: TRANSITION_DURATION,
      height: 0,
      stagger: {
        amount: 0.5,
        from: "start",
      },
      ease: customEase,
      delay: 0.2,
      onComplete: () => {
        setIsAnimating(false);
      },
    });

    gsap.from(".overlay-2", {
      duration: TRANSITION_DURATION,
      opacity: 1,
      ease: customEase,
      delay: 0.2,
    });

    gsap.to(".overlay-2", {
      xPercent: 100,
      duration: 0.8,
      ease: "power2.out",
    });

    return tl;
  };

  // Timeline for exit animation (hiding content)
  const exitAnimation = () => {
    const tl = gsap.timeline();

    // Reset bars to height 0 and ensure proper transform origin
    gsap.set(".bar", {
      height: 0,
      transformOrigin: "top",
      xPercent: 0,
    });

    // Animate bars to full height (covering content)
    tl.to(".bar", {
      duration: TRANSITION_DURATION,
      height: "100%",
      stagger: {
        amount: 0.5,
        from: "start",
      },
      ease: customEase,
    });

    return tl;
  };

  // Handle path changes
  useEffect(() => {
    if (prevPath !== location.pathname && !isAnimating) {
      setIsNavigating(true);
      setPrevPath(location.pathname);
      setIsAnimating(true);
    }
  }, [location.pathname, prevPath, isAnimating]);

  // Handle animation sequence
  useGSAP(() => {
    if (isNavigating && isAnimating) {
      const ctx = gsap.context(() => {
        // Start exit animation
        exitAnimation().then(() => {
          // After exit animation completes, update the displayed children
          setDisplayedChildren(children);

          // Start enter animation after a short delay
          setTimeout(() => {
            enterAnimation().then(() => {
              setIsNavigating(false);
            });
          }, 100);
        });
      });

      return () => {
        ctx.revert();
      };
    }
  }, [location.pathname, isNavigating, children, isAnimating]);

  // Initial animation on first load
  useEffect(() => {
    if (isNavigating && location.pathname === prevPath && !isAnimating) {
      setIsAnimating(true);
      // Run enter animation on initial load
      const tl = gsap.timeline();

      // Ensure proper initial state and transform origin
      gsap.set(".bar", {
        height: "100%",
        transformOrigin: "top",
        xPercent: 0,
      });

      tl.to(".bar", {
        duration: TRANSITION_DURATION,
        height: 0,
        stagger: {
          amount: 0.5,
          from: "start",
        },
        ease: customEase,
        delay: 0.2,
        onComplete: () => {
          setIsNavigating(false);
          setIsAnimating(false);
        },
      });
    }
  }, [isNavigating, prevPath, location.pathname, isAnimating]);

  return (
    <>
      {/* Content */}
      <div className="relative z-10">{displayedChildren}</div>

      {/* Overlay with bars */}
      <div className="overlay fixed inset-0 z-50 pointer-events-none">
        <div className="grid grid-cols-10 h-full w-full">
          {arr.map((item) => (
            <div
              key={item}
              className="bar bg-[var(--color-secondary)] w-full h-full"
              style={{ transformOrigin: "top" }}
            />
          ))}
        </div>
      </div>
      <div className="overlay-2 bg-[var(--color-secondary)] fixed inset-0 z-50 pointer-events-none"></div>
    </>
  );
}

export default PageTransition;
