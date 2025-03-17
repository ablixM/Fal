import { useRef, useEffect, useState, useCallback } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  createDebouncedResizeHandler,
  killScrollTriggers,
} from "../utils/gsapInit";
import "../styles/HomeImageSlider.css"; // Import the CSS

// Import images - adjust these paths to match your project structure
import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";

// Define a threshold for significant window size changes
const SIZE_CHANGE_THRESHOLD = 100; // pixels

function HeroImageSlide() {
  // Create refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const stickySectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [lenisReady, setLenisReady] = useState(false);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // Store current and previous size in refs instead of state to avoid re-renders
  const sizeRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const prevSizeRef = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size only if change is significant
  const handleResize = useCallback(() => {
    const debouncedResize = createDebouncedResizeHandler(() => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const prevWidth = prevSizeRef.current.width;
      const prevHeight = prevSizeRef.current.height;

      // Only update if the change is significant (exceeds threshold)
      if (
        Math.abs(newWidth - prevWidth) > SIZE_CHANGE_THRESHOLD ||
        Math.abs(newHeight - prevHeight) > SIZE_CHANGE_THRESHOLD
      ) {
        prevSizeRef.current = { width: prevWidth, height: prevHeight };
        sizeRef.current = { width: newWidth, height: newHeight };

        // Force GSAP animations to recalculate for significant size changes
        if (lenisReady) {
          setupGSAPAnimations();
        }
      }
    });

    return debouncedResize();
  }, [lenisReady]);

  // Setup resize listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

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

    // Adjust this value if needed for scrolling - make it larger to ensure scrollability
    const stickyHeight = window.innerHeight * 6;
    const slidesContainer = slidesContainerRef.current;
    const slider = sliderRef.current;
    const totalMove = slidesContainer.offsetWidth - slider.offsetWidth;
    const slideWidth = slider.offsetWidth;

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
        root: slider,
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
        const mainMove = progress * totalMove;

        gsap.set(slidesContainer, {
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
  }, [lenisReady]);

  // Run setup when component mounts and lenisReady changes
  useGSAP(
    () => {
      // Add a small delay to ensure other components have initialized
      const initTimeout = setTimeout(() => {
        setupGSAPAnimations();
      }, 100);

      // Add event listener for orientation changes
      const handleOrientationChange = () => {
        setTimeout(() => {
          setupGSAPAnimations();
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
      };
    },
    { scope: containerRef, dependencies: [setupGSAPAnimations] }
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
                  src={img1}
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
                  src={img2}
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
                  src={img3}
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
