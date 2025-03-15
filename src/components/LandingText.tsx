import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import CustomEase from "gsap/CustomEase";
import { useLayoutEffect, useRef } from "react";
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(useGSAP);

function LandingText() {
  const headerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const splitInstancesRef = useRef<SplitType[]>([]);
  const hasAnimatedRef = useRef(false);

  // Create custom ease for smooth animation
  CustomEase.create(
    "textReveal",
    "M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1"
  );

  // Initial animation using useGSAP
  useGSAP(
    () => {
      if (hasAnimatedRef.current) return;

      // Initial setup of text splitting
      setupTextSplitting();

      // Run the animation
      const tl = gsap.timeline();
      tl.fromTo(
        ".header .line span",
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          duration: 1.5,
          ease: "textReveal",
          stagger: {
            amount: 0.5,
            from: "start",
          },
          delay: 2.5,
          onComplete: () => {
            hasAnimatedRef.current = true;
          },
        }
      );
    },
    { scope: headerRef }
  );

  // Handle responsive updates
  useLayoutEffect(() => {
    // Create resize observer for recalculating layout only
    const resizeObserver = new ResizeObserver(
      debounce(() => {
        if (hasAnimatedRef.current) {
          // Reset the animation state temporarily to allow for re-splitting
          const wasAnimated = hasAnimatedRef.current;
          hasAnimatedRef.current = false;

          // Re-setup text splitting
          setupTextSplitting();

          // Restore animation state and instantly show text
          hasAnimatedRef.current = wasAnimated;
          gsap.set(".header .line span", {
            y: "0%",
            opacity: 1,
          });
        }
      }, 250)
    );

    // Observe the header element
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      splitInstancesRef.current.forEach((instance) => instance.revert());
    };
  }, []);

  // Function to setup text splitting
  const setupTextSplitting = () => {
    // Clean up previous split instances
    splitInstancesRef.current.forEach((instance) => instance.revert());
    splitInstancesRef.current = [];

    // Split title1
    if (title1Ref.current) {
      const split1 = new SplitType(title1Ref.current, {
        types: "lines",
      });
      splitInstancesRef.current.push(split1);

      split1.lines?.forEach((line: HTMLElement) => {
        const content = line.innerHTML;
        line.innerHTML = `<div class="line"><span>${content}</span></div>`;
      });
    }

    // Split title2
    if (title2Ref.current) {
      const split2 = new SplitType(title2Ref.current, {
        types: "lines",
      });
      splitInstancesRef.current.push(split2);

      split2.lines?.forEach((line: HTMLElement) => {
        const content = line.innerHTML;
        line.innerHTML = `<div class="line"><span>${content}</span></div>`;
      });
    }
  };

  // Debounce helper function
  function debounce(func: (...args: unknown[]) => void, wait: number) {
    let timeout: number;
    return function executedFunction(...args: unknown[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = window.setTimeout(later, wait);
    };
  }

  return (
    <div
      ref={headerRef}
      className="header  mt-16 max-w-[--width-8xl] w-full mx-auto flex flex-col lg:flex-row justify-between items-center lg:items-start px-8"
    >
      <div className="col ">
        <h1
          ref={title1Ref}
          className="title-1 font-normal font-inter lg:text-left text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
        >
          EMPIRE GLOBAL <br />
          INVESTMENT <br />
          MANAGEMENT
        </h1>
      </div>

      <div className="col ">
        <h2
          ref={title2Ref}
          className="title-2 font-normal leading-tight p-0 lg:text-right text-center text-md sm:text-2xl lg:text-4xl"
        >
          One of the leading holding groups of <br /> major industry companies
          in the <br /> <span className="text-red-500">UAE</span>
        </h2>
      </div>
    </div>
  );
}

export default LandingText;
