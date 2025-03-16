import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import CustomEase from "gsap/CustomEase";
import { useLayoutEffect, useRef, useState } from "react";
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(useGSAP);

interface AnimatedTitleProps {
  title1: string;
  title2: string;
}

function AnimatedTitle({ title1, title2 }: AnimatedTitleProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const splitInstancesRef = useRef<SplitType[]>([]);
  const hasAnimatedRef = useRef(false);
  const [isInView, setIsInView] = useState(false);

  // Create custom ease for smooth animation
  CustomEase.create(
    "textReveal",
    "M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1"
  );

  // Setup Intersection Observer to detect when the element is in view
  useLayoutEffect(() => {
    if (!headerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.25, // Trigger when 25% of the element is visible
        rootMargin: "0px",
      }
    );

    observer.observe(headerRef.current);

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  // Animation using useGSAP, triggered when in view
  useGSAP(
    () => {
      if (!isInView || hasAnimatedRef.current) return;

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
          onComplete: () => {
            hasAnimatedRef.current = true;
          },
        }
      );
    },
    { scope: headerRef, dependencies: [isInView] }
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
      className="header  my-16 max-w-[--width-8xl] w-full mx-auto flex flex-col lg:flex-row justify-between items-center  px-8"
    >
      <div className="col w-full">
        <h1
          ref={title1Ref}
          className="title-1 font-semibold font-inter lg:text-left text-left text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <br />
          {title1}
          <br />
          {title2}
        </h1>
      </div>
    </div>
  );
}

export default AnimatedTitle;
