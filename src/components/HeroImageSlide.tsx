import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef, useEffect, useState, useCallback } from "react";
import "../styles/HomeImageSlider.css"; // Import the CSS

// Import images - adjust these paths to match your project structure
import img1 from "../assets/img1.jpeg";
import img2 from "../assets/img2.jpeg";
import img3 from "../assets/img3.jpeg";
import img4 from "../assets/img4.jpeg";
import img5 from "../assets/img5.jpeg";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

function HeroImageSlide() {
  // Create refs for DOM elements
  const stickySectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const [lenisReady, setLenisReady] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size
  const handleResize = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 200);
    return () => clearTimeout(timeoutId);
  }, []);

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
      !lenisReady
    )
      return;

    // Kill existing ScrollTriggers before creating new ones
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

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

    // Reset initial state for titles
    slides.forEach((slide) => {
      const title = slide.querySelector(".title h1");
      if (title) gsap.set(title, { y: -200 });
    });

    let currentVisibleIndex: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slideElement = entry.target as HTMLDivElement;
          const currentIndex = slides.indexOf(slideElement);
          const titles = slides.map((slide) =>
            slide.querySelector(".title h1")
          );

          if (entry.intersectionRatio >= 0.25) {
            currentVisibleIndex = currentIndex;
            titles.forEach((title, index) => {
              if (title) {
                gsap.to(title, {
                  y: index === currentIndex ? 0 : -200,
                  duration: 0.5,
                  ease: "power2.out",
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
                  duration: 0.5,
                  ease: "power2.out",
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
    ScrollTrigger.create({
      trigger: stickySectionRef.current,
      start: "top top",
      end: `+=${stickyHeight}px`,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const mainMove = progress * totalMove;

        gsap.set(slidesContainer, {
          x: -mainMove,
          ease: "power2.out",
        });

        const currentSlide = Math.floor(mainMove / slideWidth);
        const slideProgress = (mainMove % slideWidth) / slideWidth;

        slides.forEach((slide, index) => {
          const image = slide.querySelector("img");
          if (image) {
            if (index === currentSlide || index === currentSlide + 1) {
              const relativeProgress =
                index === currentSlide ? slideProgress : slideProgress - 1;
              const parallaxAmount = relativeProgress * slideWidth * 0.25;
              gsap.set(image, {
                x: parallaxAmount,
                scale: 1.35,
                ease: "power2.out",
              });
            } else {
              gsap.set(image, {
                x: 0,
                scale: 1.35,
                ease: "power2.out",
              });
            }
          }
        });
      },
    });

    // Log for debugging
    console.log("ScrollTrigger created:");

    return () => {
      // Cleanup
      observer.disconnect();
    };
  }, [lenisReady, windowSize]); // Add windowSize as dependency

  // Run setup when dependencies change
  useEffect(() => {
    setupGSAPAnimations();
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [setupGSAPAnimations]);

  // Function to add slide elements to the ref array
  const addToSlidesRef = (el: HTMLDivElement | null, index: number) => {
    if (el && slidesRef.current) {
      slidesRef.current[index] = el;
    }
  };

  return (
    <div className="image-slider-container">
      <section ref={stickySectionRef} className="sticky">
        <div ref={sliderRef} className="slider">
          <div ref={slidesContainerRef} className="slides">
            <div ref={(el) => addToSlidesRef(el, 0)} className="slide">
              <div className="img">
                <img src={img1} alt="Refined Reception" />
              </div>
              <div className="title">
                <h1>
                  Refined Reception
                  <br />
                  Lasting Impact
                </h1>
              </div>
            </div>
            <div ref={(el) => addToSlidesRef(el, 1)} className="slide">
              <div className="img">
                <img src={img2} alt="Practical Luxury" />
              </div>
              <div className="title">
                <h1>
                  Practical Luxury
                  <br />
                  Smart Living
                </h1>
              </div>
            </div>
            <div ref={(el) => addToSlidesRef(el, 2)} className="slide">
              <div className="img">
                <img src={img3} alt="Modern Concrete" />
              </div>
              <div className="title">
                <h1>
                  Modern Concrete
                  <br />
                  Warm Details
                </h1>
              </div>
            </div>
            <div ref={(el) => addToSlidesRef(el, 3)} className="slide">
              <div className="img">
                <img src={img4} alt="Curved Elements" />
              </div>
              <div className="title">
                <h1>
                  Curved Elements
                  <br />
                  Modern Flow
                </h1>
              </div>
            </div>
            <div ref={(el) => addToSlidesRef(el, 4)} className="slide">
              <div className="img">
                <img src={img5} alt="Minimal Design" />
              </div>
              <div className="title">
                <h1>
                  Minimal Design
                  <br />
                  Natural Light
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="outro">
        <h1>Shaping timeless spaces with contemporary vision</h1>
      </section>
    </div>
  );
}

export default HeroImageSlide;
