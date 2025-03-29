import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import CustomEase from "gsap/CustomEase";
import {
  useLayoutEffect,
  useRef,
  createElement,
  useEffect,
  useState,
} from "react";
import "../styles/animated-text.css";

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(useGSAP);

interface AnimatedTextProps {
  text: string | string[];
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span";
  className?: string;
  delay?: number;
  staggerAmount?: number;
  duration?: number;
  splitTypes?: ("lines" | "words" | "chars")[];
  customEase?: string;
  threshold?: number;
  rootMargin?: string;
}

function AnimatedText({
  text,
  as = "div",
  className = "",
  delay = 0.5,
  staggerAmount = 0.5,
  duration = 1.5,
  splitTypes = ["lines"],
  customEase = "M0,0 C0.355,0.022 0.448,0.079 0.5,0.5 0.542,0.846 0.615,1 1,1",
  threshold = 0.1,
  rootMargin = "0px",
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const splitInstancesRef = useRef<SplitType[]>([]);
  const hasAnimatedRef = useRef(false);
  const [isInView, setIsInView] = useState(false);

  // Format text to array if it's a string
  const textArray = Array.isArray(text) ? text : [text];

  // Create custom ease for smooth animation
  CustomEase.create("textReveal", customEase);

  // Add initial hide style to prevent flash of unstyled content
  useLayoutEffect(() => {
    if (textRef.current) {
      gsap.set(textRef.current, { opacity: 0 });
    }
  }, []);

  // Setup Intersection Observer to detect when element is in view
  useEffect(() => {
    const options = {
      root: null, // viewport
      rootMargin,
      threshold,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          setIsInView(true);
        }
      });
    }, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, rootMargin]);

  // Initial animation using useGSAP, triggered by isInView
  useGSAP(
    () => {
      if (!isInView || hasAnimatedRef.current) return;

      // Set text to visible now that we're ready to animate it
      if (textRef.current) {
        gsap.set(textRef.current, { opacity: 1 });
      }

      // Initial setup of text splitting
      setupTextSplitting();

      // Run the animation
      const tl = gsap.timeline();
      tl.fromTo(
        ".animated-text-container .line span",
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          duration: duration,
          ease: "textReveal",
          stagger: {
            amount: staggerAmount,
            from: "start",
          },
          delay: delay,
          onComplete: () => {
            hasAnimatedRef.current = true;
          },
        }
      );
    },
    { scope: containerRef, dependencies: [isInView] }
  );

  // Handle responsive updates
  useLayoutEffect(() => {
    // Create resize observer for recalculating layout on resize
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
          gsap.set(".animated-text-container .line span", {
            y: "0%",
            opacity: 1,
          });
        }
      }, 250)
    );

    // Observe the container element
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      splitInstancesRef.current.forEach((instance) => instance.revert());
    };
  }, [text]);

  // Function to setup text splitting
  const setupTextSplitting = () => {
    // Clean up previous split instances
    splitInstancesRef.current.forEach((instance) => instance.revert());
    splitInstancesRef.current = [];

    // Split text
    if (textRef.current) {
      const splitInstance = new SplitType(textRef.current, {
        types: splitTypes,
      });
      splitInstancesRef.current.push(splitInstance);

      // Handle lines
      if (splitTypes.includes("lines") && splitInstance.lines) {
        splitInstance.lines.forEach((line: HTMLElement) => {
          const content = line.innerHTML;
          line.innerHTML = `<div class="line"><span>${content}</span></div>`;
        });
      }

      // Handle words if no lines
      else if (
        splitTypes.includes("words") &&
        splitInstance.words &&
        !splitTypes.includes("lines")
      ) {
        splitInstance.words.forEach((word: HTMLElement) => {
          const content = word.innerHTML;
          word.innerHTML = `<div class="line"><span>${content}</span></div>`;
        });
      }

      // Handle chars if no lines or words
      else if (
        splitTypes.includes("chars") &&
        splitInstance.chars &&
        !splitTypes.includes("lines") &&
        !splitTypes.includes("words")
      ) {
        splitInstance.chars.forEach((char: HTMLElement) => {
          const content = char.innerHTML;
          char.innerHTML = `<div class="line"><span>${content}</span></div>`;
        });
      }
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
    <div ref={containerRef} className={`animated-text-container ${className}`}>
      {createElement(
        as,
        { ref: textRef, className: "animated-text" },
        textArray.map((line, index) => (
          <span key={index} className="animated-text-line">
            {line}
            {index < textArray.length - 1 && <br />}
          </span>
        ))
      )}
    </div>
  );
}

export default AnimatedText;
