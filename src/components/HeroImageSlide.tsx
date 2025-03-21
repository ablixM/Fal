import { useRef, useEffect, useState, useCallback, memo } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  killScrollTriggers,
  initScrollTriggerWithPriority,
} from "../utils/gsapInit";
import "../styles/HeroImageSlider.css"; // Import the CSS

// Resize observer throttle time (ms)
const RESIZE_THROTTLE = 200;
// Breakpoints for responsive adjustments
const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
};

// Memoize slide component for better performance
const Slide = memo(
  ({
    index,
    title,
    subtitle,
    imageSrc,
    refCallback,
  }: {
    index: number;
    title: string;
    subtitle: string;
    imageSrc: string;
    refCallback: (el: HTMLDivElement | null) => void;
  }) => (
    <div ref={refCallback} className="hero-image-slider__slide">
      <div className="hero-image-slider__img-container">
        <img
          className="hero-slide__img"
          src={imageSrc}
          alt={title}
          loading={index === 0 ? "eager" : "lazy"}
        />
      </div>
      <div className="hero-slide__title px-4 sm:px-6 md:px-8 lg:px-12">
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        <div
          className="hero-slide__subtitle mt-2 sm:mt-3 md:mt-4"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        />
      </div>
    </div>
  )
);

function HeroImageSlide() {
  // Create refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const stickySectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [lenisReady, setLenisReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const visibilityObserverRef = useRef<MutationObserver | null>(null);
  const dimensionsRef = useRef({
    width: 0,
    height: 0,
    slidesContainerWidth: 0,
    sliderWidth: 0,
    slideWidth: 0,
    totalMove: 0,
  });
  const resizeTimeoutRef = useRef<number | null>(null);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);

  // Slide data to avoid recreating them on each render
  const slidesData = useRef([
    {
      title: "GREEN AND ROASTED<br />COFEE BEANS",
      subtitle:
        "Sourced from the finest plantations,<br />delivering unmatched aroma and taste.",
      imageSrc: "/assets/cofee-hero.webp",
    },
    {
      title: "CASHEW<br />NUTS",
      subtitle:
        "Golden, crunchy, and creamy –<br />the highest quality handpicked cashews",
      imageSrc: "/assets/cashe-hero.webp",
    },
    {
      title: "DATES<br />",
      subtitle:
        "Pure, rich, and naturally sweet –<br />the finest dates from trusted farms.",
      imageSrc: "/assets/dates-hero.webp",
    },
  ]);

  // Set CSS variables for responsive values - memoized to avoid recreation
  const setCSSVariables = useCallback(() => {
    if (!containerRef.current) return;

    const root = document.documentElement;
    // Get accurate viewport dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Set responsive variables on root element - batch these operations
    const cssVars = {
      "--viewport-width": `${width}px`,
      "--viewport-height": `${height}px`,
      "--slide-width": `${width}px`,
      "--title-offset":
        width <= BREAKPOINTS.mobile
          ? "20vh"
          : width <= BREAKPOINTS.tablet
          ? "25vh"
          : "30vh",
      "--title-font-size":
        width <= BREAKPOINTS.mobile
          ? "6vw"
          : width <= BREAKPOINTS.tablet
          ? "7vw"
          : "8vw",
    };

    // Apply all CSS vars in one batch
    Object.entries(cssVars).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });

    // Immediately update container width if available
    if (slidesContainerRef.current && sliderRef.current) {
      const slidesContainer = slidesContainerRef.current;
      const slider = sliderRef.current;

      // Force dimensions recalculation
      dimensionsRef.current.width = width;
      dimensionsRef.current.height = height;
      dimensionsRef.current.slidesContainerWidth = slidesContainer.offsetWidth;
      dimensionsRef.current.sliderWidth = slider.offsetWidth;
      dimensionsRef.current.slideWidth = width;
      dimensionsRef.current.totalMove =
        slidesContainer.offsetWidth - slider.offsetWidth;
    }

    return { width, height };
  }, []);

  // Calculate and store dimensions for animation use
  const calculateDimensions = useCallback(() => {
    if (
      !slidesContainerRef.current ||
      !sliderRef.current ||
      !containerRef.current ||
      !isVisible
    )
      return;

    const slidesContainer = slidesContainerRef.current;
    const slider = sliderRef.current;

    // Update CSS variables first
    const viewportDimensions = setCSSVariables();
    if (!viewportDimensions) return;

    const { width, height } = viewportDimensions;

    // Get fresh measurements
    dimensionsRef.current = {
      width,
      height,
      slidesContainerWidth: slidesContainer.offsetWidth,
      sliderWidth: slider.offsetWidth,
      slideWidth: width, // Use viewport width for slide width
      totalMove: slidesContainer.offsetWidth - slider.offsetWidth,
    };

    return dimensionsRef.current;
  }, [setCSSVariables, isVisible]);

  // Handle media query changes more efficiently
  const handleMediaQueryChange = useCallback(
    (e: MediaQueryListEvent) => {
      // First kill all ScrollTriggers from this component to avoid interference
      killScrollTriggers(scrollTriggersRef.current);
      scrollTriggersRef.current = [];

      // Also remove any instances that might not be in our refs
      ScrollTrigger.getAll().forEach((st) => {
        const id = st.vars.id as string | undefined;
        if (id && (id === "hero-image-slider" || id === "hero-context")) {
          st.kill();
        }
      });

      // Add small delay to allow DOM to update
      setTimeout(() => {
        const isCurrentlyVisible = containerRef.current
          ? window.getComputedStyle(containerRef.current).display !== "none"
          : false;

        setIsVisible(isCurrentlyVisible);

        if (e.matches && isCurrentlyVisible) {
          // Going from hidden to visible, need to reinitialize
          window.requestAnimationFrame(() => {
            calculateDimensions();
            // Wait a bit for WhyChooseUs to settle if present
            setTimeout(() => {
              // Use priority to ensure ordering with WhyChooseUs
              initScrollTriggerWithPriority(() => {
                // We call setupGSAPAnimations directly here, not from dependencies
                if (
                  stickySectionRef.current &&
                  sliderRef.current &&
                  slidesContainerRef.current &&
                  lenisReady &&
                  containerRef.current &&
                  isVisible
                ) {
                  // Kill existing ScrollTriggers for this component before creating new ones
                  killScrollTriggers(scrollTriggersRef.current);
                  scrollTriggersRef.current = [];

                  // Then run the setup
                  setupGSAPAnimations();

                  // Final refresh after a delay to ensure all is set
                  setTimeout(() => ScrollTrigger.refresh(true), 100);
                }
              }, 0); // Lower priority means this runs first
            }, 200);
          });
        }
      }, 50);
    },
    [calculateDimensions, lenisReady, isVisible]
  );

  // Cleanup function - centralized to avoid duplication
  const cleanup = useCallback(() => {
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    if (visibilityObserverRef.current) {
      visibilityObserverRef.current.disconnect();
      visibilityObserverRef.current = null;
    }

    if (mediaQueryRef.current) {
      mediaQueryRef.current.removeEventListener(
        "change",
        handleMediaQueryChange
      );
    }

    window.visualViewport?.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleOrientationChange);

    if (resizeTimeoutRef.current) {
      window.clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = null;
    }

    killScrollTriggers(scrollTriggersRef.current);
    scrollTriggersRef.current = [];
  }, [handleMediaQueryChange]);

  // Setup GSAP animations - optimized to avoid unnecessary recalculations
  const setupGSAPAnimations = useCallback(() => {
    if (
      !stickySectionRef.current ||
      !sliderRef.current ||
      !slidesContainerRef.current ||
      !lenisReady ||
      !containerRef.current ||
      !isVisible
    )
      return;

    // Kill existing ScrollTriggers for this component before creating new ones
    killScrollTriggers(scrollTriggersRef.current);
    scrollTriggersRef.current = [];

    const slides = slidesRef.current;
    if (slides.length === 0) return;

    // Calculate dimensions first
    calculateDimensions();
    if (!dimensionsRef.current.width) return;

    // Use CSS variables for heights - calculate once
    const slidesCount = slides.length;
    const stickyHeight = window.innerHeight * slidesCount * 2;

    // Reset initial state for titles in one batch operation
    const titles = slides.map((slide) =>
      slide.querySelector(".hero-slide__title h1")
    );
    const subtitles = slides.map((slide) =>
      slide.querySelector(".hero-slide__title .hero-slide__subtitle")
    );

    gsap.set(titles, { y: -200 });
    gsap.set(subtitles, { y: -450 });

    let currentVisibleIndex: number | null = null;

    // Optimize the intersection observer to use one instance
    const observer = new IntersectionObserver(
      (entries) => {
        let needsUpdate = false;
        let newVisibleIndex: number | null = currentVisibleIndex;

        entries.forEach((entry) => {
          const slideElement = entry.target as HTMLDivElement;
          const currentIndex = slides.indexOf(slideElement);

          if (
            entry.intersectionRatio >= 0.25 &&
            currentVisibleIndex !== currentIndex
          ) {
            newVisibleIndex = currentIndex;
            needsUpdate = true;
          } else if (
            entry.intersectionRatio < 0.25 &&
            currentVisibleIndex === currentIndex
          ) {
            const prevIndex = currentIndex - 1;
            newVisibleIndex = prevIndex >= 0 ? prevIndex : null;
            needsUpdate = true;
          }
        });

        // Only update animations if needed
        if (needsUpdate && newVisibleIndex !== currentVisibleIndex) {
          currentVisibleIndex = newVisibleIndex;

          // Batch these animation updates
          titles.forEach((title, index) => {
            if (title) {
              gsap.to(title, {
                y: index === currentVisibleIndex ? 0 : -200,
                duration: 1,
                ease: "expo.out",
                overwrite: true,
              });
            }
          });

          subtitles.forEach((subtitle, index) => {
            if (subtitle) {
              gsap.to(subtitle, {
                y: index === currentVisibleIndex ? 0 : -450,
                duration: 1,
                delay: 0.1,
                ease: "expo.out",
                overwrite: true,
              });
            }
          });
        }
      },
      {
        root: sliderRef.current,
        threshold: [0, 0.25],
      }
    );

    slides.forEach((slide) => observer.observe(slide));

    // Create a context for this component's ScrollTriggers
    ScrollTrigger.config({ limitCallbacks: true });
    const heroContext = ScrollTrigger.getAll()
      .map((st) => st.vars.id)
      .includes("hero-context")
      ? ScrollTrigger.getById("hero-context")
      : ScrollTrigger.create({
          id: "hero-context",
          start: 0,
          end: 99999,
          markers: false,
        });

    // Configure ScrollTrigger for scrolling
    const mainScrollTrigger = ScrollTrigger.create({
      trigger: stickySectionRef.current,
      start: "top top",
      end: `+=${stickyHeight}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      id: "hero-image-slider",
      onUpdate: (self) => {
        const progress = self.progress;
        const { totalMove, slideWidth } = dimensionsRef.current;
        const mainMove = progress * totalMove;

        // Set container position
        gsap.set(slidesContainerRef.current, {
          x: -mainMove,
          ease: "expo.out",
        });

        const currentSlide = Math.floor(mainMove / slideWidth);
        const slideProgress = (mainMove % slideWidth) / slideWidth;

        // Only animate visible and neighboring slides for performance
        slides.forEach((slide, index) => {
          if (Math.abs(index - currentSlide) <= 1) {
            const image = slide.querySelector(".hero-slide__img");
            if (image) {
              if (index === currentSlide || index === currentSlide + 1) {
                const relativeProgress =
                  index === currentSlide ? slideProgress : slideProgress - 1;
                const parallaxAmount = relativeProgress * slideWidth * 0.25;
                gsap.set(image, {
                  x: parallaxAmount,
                  scale: 1.35,
                });
              }
            }
          }
        });
      },
    });

    // Store the ScrollTrigger instance for cleanup
    scrollTriggersRef.current.push(mainScrollTrigger);
    if (heroContext) scrollTriggersRef.current.push(heroContext);

    return () => {
      observer.disconnect();
      killScrollTriggers(scrollTriggersRef.current);
      scrollTriggersRef.current = [];
    };
  }, [lenisReady, calculateDimensions, isVisible]);

  // Handle window resize with debounce - add a manual trigger
  const forceResize = useCallback(() => {
    // First update CSS variables
    setCSSVariables();

    // Then trigger a forced resize after a brief delay
    setTimeout(() => {
      // Force recalculation of all dimensions
      calculateDimensions();

      // Kill and reinitialize ScrollTrigger
      killScrollTriggers(scrollTriggersRef.current);
      scrollTriggersRef.current = [];

      // Clean any leftover instances
      ScrollTrigger.getAll().forEach((st) => {
        const id = st.vars.id as string | undefined;
        if (id && (id === "hero-image-slider" || id === "hero-context")) {
          st.kill();
        }
      });

      // Recreate animations
      setupGSAPAnimations();

      // Final refresh
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    }, 50);
  }, [setCSSVariables, calculateDimensions, setupGSAPAnimations]);

  // Optimized resize handler
  const handleResize = useCallback(() => {
    // Clear any existing timeout
    if (resizeTimeoutRef.current !== null) {
      window.clearTimeout(resizeTimeoutRef.current);
    }

    // Update CSS variables immediately
    setCSSVariables();

    // Use RAF for smoother updates
    requestAnimationFrame(() => {
      resizeTimeoutRef.current = window.setTimeout(() => {
        if (lenisReady && isVisible) {
          // Force a complete resize process
          forceResize();
        }
        resizeTimeoutRef.current = null;
      }, RESIZE_THROTTLE);
    });
  }, [setCSSVariables, lenisReady, isVisible, forceResize]);

  // Handle orientation changes
  const handleOrientationChange = useCallback(() => {
    if (resizeTimeoutRef.current !== null) {
      window.clearTimeout(resizeTimeoutRef.current);
    }

    // First kill all ScrollTriggers to avoid interference during orientation change
    killScrollTriggers(scrollTriggersRef.current);
    scrollTriggersRef.current = [];

    setCSSVariables();

    // Schedule multiple refreshes to ensure everything settles
    setTimeout(() => {
      forceResize();
    }, 100);
  }, [setCSSVariables, forceResize]);

  // Observe changes to display property - simplified
  useEffect(() => {
    if (!containerRef.current) return;

    // Check initial visibility
    const isCurrentlyVisible =
      window.getComputedStyle(containerRef.current).display !== "none";
    setIsVisible(isCurrentlyVisible);

    // Set up media query listener
    mediaQueryRef.current = window.matchMedia("(min-width: 1024px)");
    mediaQueryRef.current.addEventListener("change", handleMediaQueryChange);

    return () => {
      if (mediaQueryRef.current) {
        mediaQueryRef.current.removeEventListener(
          "change",
          handleMediaQueryChange
        );
      }
    };
  }, [handleMediaQueryChange]);

  // More efficient resize handling
  useEffect(() => {
    if (!containerRef.current) return;

    // Initial setup
    setCSSVariables();

    // Only create observers if component is visible
    if (isVisible) {
      // Create a ResizeObserver
      resizeObserverRef.current = new ResizeObserver(handleResize);

      // Additional event listeners for mobile
      window.visualViewport?.addEventListener("resize", handleResize, {
        passive: true,
      });

      window.addEventListener("orientationchange", handleOrientationChange);
    }

    return cleanup;
  }, [
    setCSSVariables,
    handleResize,
    handleOrientationChange,
    cleanup,
    isVisible,
  ]);

  // Setup smooth scrolling - simplified
  useEffect(() => {
    setLenisReady(true);
  }, []);

  // Initial GSAP setup
  useGSAP(
    () => {
      // Only run if component is visible
      if (!isVisible) return;

      setCSSVariables();
      calculateDimensions();

      // Production environments may need more robust initialization
      const initDelay =
        typeof window !== "undefined" &&
        window.location.hostname !== "localhost"
          ? 300
          : 100;

      // Use requestAnimationFrame for smoother initialization
      const initTimeout = window.setTimeout(() => {
        // Initialize with a priority to ensure proper sequence with other components
        initScrollTriggerWithPriority(() => {
          // Ensure clean start by killing any existing instances
          ScrollTrigger.getAll().forEach((st) => {
            const id = st.vars.id as string | undefined;
            if (id && id === "hero-image-slider") {
              st.kill();
            }
          });

          setupGSAPAnimations();

          // Add a safety refresh after everything is set up
          setTimeout(() => {
            ScrollTrigger.refresh(true);

            // Force resize once more after init to ensure all dimensions are correct
            window.addEventListener("load", forceResize, { once: true });
          }, 100);
        }, 0); // Lower priority number runs first
      }, initDelay);

      return () => {
        clearTimeout(initTimeout);
        window.removeEventListener("load", forceResize);
        cleanup();
      };
    },
    {
      scope: containerRef,
      dependencies: [isVisible, forceResize],
    }
  );

  // Function to add slide elements to the ref array - memoized
  const addToSlidesRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      if (el) {
        slidesRef.current[index] = el;
      }
    },
    []
  );

  return (
    <div
      className="hero-image-slider-container hidden lg:block"
      ref={containerRef}
    >
      <section ref={stickySectionRef} className="hero-image-slider__sticky">
        <div ref={sliderRef} className="hero-image-slider__slider">
          <div ref={slidesContainerRef} className="hero-image-slider__slides">
            {slidesData.current.map((slide, index) => (
              <Slide
                key={index}
                index={index}
                title={slide.title}
                subtitle={slide.subtitle}
                imageSrc={slide.imageSrc}
                refCallback={(el) => addToSlidesRef(el, index)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroImageSlide;
