import { useRef, useEffect, useState, useCallback } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  killScrollTriggers,
} from "../utils/gsapInit";
import "../styles/HomeImageSlider.css"; // Import the CSS

// Resize observer throttle time (ms)
const RESIZE_THROTTLE = 200;

function HeroImageSlide() {
  // Create refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const stickySectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [lenisReady, setLenisReady] = useState(false);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const dimensionsRef = useRef({
    width: 0,
    height: 0,
    slidesContainerWidth: 0,
    sliderWidth: 0,
    slideWidth: 0,
    totalMove: 0,
  });
  const resizeTimeoutRef = useRef<number | null>(null);

  // Calculate and store dimensions for animation use
  const calculateDimensions = useCallback(() => {
    if (
      !slidesContainerRef.current ||
      !sliderRef.current ||
      !containerRef.current
    )
      return;

    const slidesContainer = slidesContainerRef.current;
    const slider = sliderRef.current;

    // Get fresh measurements
    const dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      slidesContainerWidth: slidesContainer.offsetWidth,
      sliderWidth: slider.offsetWidth,
      slideWidth: slider.offsetWidth,
      totalMove: slidesContainer.offsetWidth - slider.offsetWidth,
    };

    // Store calculated dimensions
    dimensionsRef.current = dimensions;

    return dimensions;
  }, []);

  // Setup GSAP animations
  const setupGSAPAnimations = useCallback(() => {
    if (
      !stickySectionRef.current ||
      !sliderRef.current ||
      !slidesContainerRef.current ||
      !lenisReady ||
      !containerRef.current
    )
      return;

    // Kill existing ScrollTriggers for this component before creating new ones
    killScrollTriggers(scrollTriggersRef.current);
    scrollTriggersRef.current = [];

    // Force a reflow/repaint
    ScrollTrigger.refresh();

    const slides = slidesRef.current;
    if (slides.length === 0) return;

    // Calculate dimensions first
    calculateDimensions();
    if (!dimensionsRef.current) return;

    // Adjust this value if needed for scrolling - make it larger to ensure scrollability
    const stickyHeight = window.innerHeight * slides.length * 2;

    // Reset initial state for titles - use component-specific selectors
    slides.forEach((slide) => {
      const title = slide.querySelector(".hero-slide__title h1");
      const subtitle = slide.querySelector(
        ".hero-slide__title .hero-slide__subtitle"
      );
      if (title) gsap.set(title, { y: -200 });
      if (subtitle) gsap.set(subtitle, { y: -450 });
    });

    let currentVisibleIndex: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slideElement = entry.target as HTMLDivElement;
          const currentIndex = slides.indexOf(slideElement);
          const titles = slides.map((slide) =>
            slide.querySelector(".hero-slide__title h1")
          );
          const subtitles = slides.map((slide) =>
            slide.querySelector(".hero-slide__title .hero-slide__subtitle")
          );

          if (entry.intersectionRatio >= 0.25) {
            currentVisibleIndex = currentIndex;
            titles.forEach((title, index) => {
              if (title) {
                gsap.to(title, {
                  y: index === currentIndex ? 0 : -200,
                  duration: 1,
                  ease: (t: number) =>
                    Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                  overwrite: true,
                });
              }
            });
            subtitles.forEach((subtitle, index) => {
              if (subtitle) {
                gsap.to(subtitle, {
                  y: index === currentIndex ? 0 : -450,
                  duration: 1,
                  delay: 0.1, // Slight delay for staggered effect
                  ease: (t: number) =>
                    Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                  overwrite: true,
                });
              }
            });
          } else if (
            entry.intersectionRatio < 0.25 &&
            currentVisibleIndex === currentIndex
          ) {
            const prevIndex = currentIndex - 1;
            currentVisibleIndex = prevIndex >= 0 ? prevIndex : null;

            titles.forEach((title, index) => {
              if (title) {
                gsap.to(title, {
                  y: index === prevIndex ? 0 : -200,
                  duration: 1,
                  ease: (t: number) =>
                    Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                  overwrite: true,
                });
              }
            });
            subtitles.forEach((subtitle, index) => {
              if (subtitle) {
                gsap.to(subtitle, {
                  y: index === prevIndex ? 0 : -450,
                  duration: 1,
                  ease: (t: number) =>
                    Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                  overwrite: true,
                });
              }
            });
          }
        });
      },
      {
        root: sliderRef.current,
        threshold: [0, 0.25],
      }
    );

    slides.forEach((slide) => observer.observe(slide));

    // Configure ScrollTrigger for scrolling
    const mainScrollTrigger = ScrollTrigger.create({
      trigger: stickySectionRef.current,
      start: "top top",
      end: `+=${stickyHeight}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      id: "hero-image-slider", // Add unique ID for debugging
      onUpdate: (self) => {
        const progress = self.progress;
        // Use the latest dimensions for calculations
        const { totalMove, slideWidth } = dimensionsRef.current;
        const mainMove = progress * totalMove;

        gsap.set(slidesContainerRef.current, {
          x: -mainMove,
          ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        const currentSlide = Math.floor(mainMove / slideWidth);
        const slideProgress = (mainMove % slideWidth) / slideWidth;

        slides.forEach((slide, index) => {
          const image = slide.querySelector(".hero-slide__img");
          if (image) {
            if (index === currentSlide || index === currentSlide + 1) {
              const relativeProgress =
                index === currentSlide ? slideProgress : slideProgress - 1;
              const parallaxAmount = relativeProgress * slideWidth * 0.25;
              gsap.set(image, {
                x: parallaxAmount,
                scale: 1.35,
                ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            } else {
              gsap.set(image, {
                x: 0,
                scale: 1.35,
                ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            }
          }
        });
      },
    });

    // Store the ScrollTrigger instance for cleanup
    scrollTriggersRef.current.push(mainScrollTrigger);

    return () => {
      // Cleanup
      observer.disconnect();
      killScrollTriggers(scrollTriggersRef.current);
      scrollTriggersRef.current = [];
    };
  }, [lenisReady, calculateDimensions]);

  // Handle resize with a ResizeObserver for better performance
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      // Clear any existing timeout
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      // Set a new timeout to throttle the resize handler
      resizeTimeoutRef.current = window.setTimeout(() => {
        // Recalculate dimensions and reset animations
        if (lenisReady) {
          calculateDimensions();
          setupGSAPAnimations();
        }
        resizeTimeoutRef.current = null;
      }, RESIZE_THROTTLE);
    };

    // Create a ResizeObserver for more accurate size change detection
    resizeObserverRef.current = new ResizeObserver(handleResize);

    // Observe both window and container element for size changes
    resizeObserverRef.current.observe(containerRef.current);

    // Also listen for window resize as a fallback
    window.addEventListener("resize", handleResize);

    return () => {
      // Cleanup
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [lenisReady, setupGSAPAnimations, calculateDimensions]);

  // Setup smooth scrolling with Lenis
  useEffect(() => {
    // Set the scrolling behavior
    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.height = "auto";

    // Mark Lenis as ready
    setLenisReady(true);

    return () => {
      // Cleanup
      document.documentElement.style.overflowY = "";
      document.body.style.overflowY = "";
      document.documentElement.style.height = "";
      document.body.style.height = "";
    };
  }, []);

  // Run setup when component mounts and lenisReady changes
  useGSAP(
    () => {
      // Initial calculation of dimensions
      calculateDimensions();

      // Add a small delay to ensure other components have initialized
      const initTimeout = setTimeout(() => {
        setupGSAPAnimations();
      }, 100);

      // Add event listener for orientation changes
      const handleOrientationChange = () => {
        // Clear previous timeout if it exists
        if (resizeTimeoutRef.current !== null) {
          window.clearTimeout(resizeTimeoutRef.current);
        }

        // Set a longer timeout for orientation changes as they take longer to settle
        resizeTimeoutRef.current = window.setTimeout(() => {
          calculateDimensions();
          setupGSAPAnimations();
          resizeTimeoutRef.current = null;
        }, 300);
      };

      window.addEventListener("orientationchange", handleOrientationChange);

      return () => {
        clearTimeout(initTimeout);
        killScrollTriggers(scrollTriggersRef.current);
        scrollTriggersRef.current = [];
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
        if (resizeTimeoutRef.current !== null) {
          window.clearTimeout(resizeTimeoutRef.current);
        }
      };
    },
    {
      scope: containerRef,
      dependencies: [setupGSAPAnimations, calculateDimensions],
    }
  );

  // Function to add slide elements to the ref array
  const addToSlidesRef = (el: HTMLDivElement | null, index: number) => {
    if (el && slidesRef.current) {
      slidesRef.current[index] = el;
    }
  };

  return (
    <div className="hero-image-slider-container" ref={containerRef}>
      <section ref={stickySectionRef} className="hero-image-slider__sticky">
        <div ref={sliderRef} className="hero-image-slider__slider">
          <div ref={slidesContainerRef} className="hero-image-slider__slides">
            <div
              ref={(el) => addToSlidesRef(el, 0)}
              className="hero-image-slider__slide"
            >
              <div className="hero-image-slider__img-container">
                <img
                  className="hero-slide__img"
                  src="/assets/cofee-hero.jpg"
                  alt="Refined Reception"
                />
              </div>
              <div className="hero-slide__title px-4 sm:px-6 md:px-8 lg:px-12">
                <h1>
                  GREEN AND ROASTED
                  <br />
                  COFEE BEANS
                </h1>
                <div className="hero-slide__subtitle mt-2 sm:mt-3 md:mt-4">
                  Sourced from the finest plantations,
                  <br />
                  delivering unmatched aroma and taste.
                </div>
              </div>
            </div>
            <div
              ref={(el) => addToSlidesRef(el, 1)}
              className="hero-image-slider__slide"
            >
              <div className="hero-image-slider__img-container">
                <img
                  className="hero-slide__img"
                  src="/assets/cashe-hero.jpg"
                  alt="Practical Luxury"
                />
              </div>
              <div className="hero-slide__title px-4 sm:px-6 md:px-8 lg:px-12">
                <h1>
                  CASHEW
                  <br />
                  NUTS
                </h1>
                <div className="hero-slide__subtitle mt-2 sm:mt-3 md:mt-4">
                  Golden, crunchy, and creamy –
                  <br />
                  the highest quality handpicked cashews
                </div>
              </div>
            </div>
            <div
              ref={(el) => addToSlidesRef(el, 2)}
              className="hero-image-slider__slide"
            >
              <div className="hero-image-slider__img-container">
                <img
                  className="hero-slide__img"
                  src="/assets/dates-hero.jpg"
                  alt="Modern Concrete"
                />
              </div>
              <div className="hero-slide__title px-4 sm:px-6 md:px-8 lg:px-12">
                <h1>
                  DATES
                  <br />
                </h1>
                <div className="hero-slide__subtitle mt-2 sm:mt-3 md:mt-4">
                  Pure, rich, and naturally sweet –
                  <br />
                  the finest dates from trusted farms.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroImageSlide;
