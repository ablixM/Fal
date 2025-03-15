import { Link } from "react-router-dom";
import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin once outside the component to avoid multiple registrations
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MessageProps {
  profileImage?: string;
}

function Message({ profileImage = "/src/assets/FALCH.png" }: MessageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [letterElements, setLetterElements] = useState<HTMLSpanElement[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  // Use ref instead of state to avoid re-renders and infinite loops
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  // Track if animation needs to be recalculated
  const needsRecalculation = useRef<boolean>(false);

  const quote =
    "With a passion for premium products and global trade, I founded Fal Trading to connect businesses with the world's finest coffee, cashews, and dates. Our commitment to quality and trust ensures that every product we deliver meets the highest standards.";

  // Responsive animation settings based on screen size
  const getAnimationSettings = useCallback(() => {
    // Mobile settings
    if (windowWidth < 640) {
      return {
        staggerAmount: 0.002,
        duration: 0.08,
        startPoint: "top bottom",
        endPoint: "bottom top-=200",
        // Smaller batch size for mobile (reveal fewer letters at once)
        batchSize: 2,
        // Shorter viewport means fewer letters visible at once
        visibleBatches: Math.ceil(letterElements.length / 5),
      };
    }
    // Tablet settings
    else if (windowWidth < 1024) {
      return {
        staggerAmount: 0.0025,
        duration: 0.1,
        startPoint: "top bottom",
        endPoint: "bottom top-=100",
        // Medium batch size for tablets
        batchSize: 3,
        // Medium viewport means moderate number of letters visible
        visibleBatches: Math.ceil(letterElements.length / 4),
      };
    }
    // Desktop settings
    else {
      return {
        staggerAmount: 0.003,
        duration: 0.12,
        startPoint: "top bottom",
        endPoint: "bottom top",
        // Larger batch size for desktop (reveal more letters at once)
        batchSize: 4,
        // Larger viewport means more letters visible at once
        visibleBatches: Math.ceil(letterElements.length / 3),
      };
    }
  }, [windowWidth, letterElements.length]);

  // Calculate letter batches for more efficient animation
  const getLetterBatches = useCallback(() => {
    if (letterElements.length === 0) return [];

    const settings = getAnimationSettings();
    const { batchSize } = settings;

    // Group letters into batches for more efficient animation
    const batches = [];
    for (let i = 0; i < letterElements.length; i += batchSize) {
      batches.push(letterElements.slice(i, i + batchSize));
    }

    return batches;
  }, [letterElements, getAnimationSettings]);

  // Setup animation
  const setupAnimation = useCallback(() => {
    if (letterElements.length === 0 || !quoteRef.current) return;

    // Clear any existing ScrollTrigger
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    const settings = getAnimationSettings();
    const batches = getLetterBatches();

    // Calculate visible percentage per batch
    const totalBatches = batches.length;
    const visiblePercentage = Math.min(
      1,
      settings.visibleBatches / totalBatches
    );

    // Create a new timeline with ScrollTrigger
    const scrollTriggerConfig = {
      id: "message-text-reveal",
      trigger: quoteRef.current,
      start: settings.startPoint,
      end: settings.endPoint,
      scrub: true,
      markers: false,
      toggleActions: "play reverse play reverse", // Ensures animation works in both directions
      onUpdate: (self: { progress: number }) => {
        // Calculate how many batches should be visible based on scroll progress
        const progress = self.progress;
        const visibleCount = Math.ceil(
          totalBatches * progress * visiblePercentage
        );

        // Update letter visibility directly for optimal performance
        batches.forEach((batch, index) => {
          const shouldBeVisible = index < visibleCount;
          batch.forEach((letter) => {
            gsap.to(letter, {
              opacity: shouldBeVisible ? 1 : 0.2,
              duration: 0.1,
              overwrite: true,
            });
          });
        });
      },
    };

    // Create ScrollTrigger
    gsap.timeline({
      scrollTrigger: scrollTriggerConfig,
    });

    // Initial setup of all letters' opacity
    letterElements.forEach((letter) => {
      gsap.set(letter, { opacity: 0.2 });
    });

    needsRecalculation.current = false;
  }, [letterElements, getAnimationSettings, getLetterBatches]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;

      // Only update if width changed significantly (prevents micro-adjustments)
      if (Math.abs(newWidth - windowWidth) > 20) {
        setWindowWidth(newWidth);
        needsRecalculation.current = true;
      }
    };

    // Debounced resize handler
    let resizeTimer: number;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [windowWidth]);

  // Re-setup animation when letterElements or window size changes
  useEffect(() => {
    if (
      letterElements.length > 0 &&
      (needsRecalculation.current || !scrollTriggerRef.current)
    ) {
      setupAnimation();
    }

    // Clean up function
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [letterElements, windowWidth, setupAnimation]);

  // Collect letter elements after component mounts
  useEffect(() => {
    if (!quoteRef.current) return;

    const letters = quoteRef.current.querySelectorAll(".letter");
    setLetterElements(Array.from(letters) as HTMLSpanElement[]);

    // Clean up function for unmounting
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, []);

  // Word splitting with responsive classes
  const splitWords = (phrase: string) => {
    const words = phrase.split(" ");
    return words.map((word, i) => (
      <span key={`word_${i}`} className="inline-block mr-2 mb-1">
        {splitLetters(word)}
      </span>
    ));
  };

  const splitLetters = (word: string) => {
    return word.split("").map((letter, i) => (
      <span
        key={`letter_${i}`}
        className="letter opacity-20 inline-block transition-opacity duration-300"
      >
        {letter}
      </span>
    ));
  };

  return (
    <div
      ref={sectionRef}
      className="w-full bg-secondary text-primary min-h-screen flex items-center relative overflow-hidden"
      id="message-section"
    >
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 lg:py-24">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12 lg:gap-24">
          {/* Left side - Title and Image */}
          <div className="flex flex-col items-center space-y-6 md:space-y-8 md:w-2/5 lg:w-1/3">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                MEET, FAHL
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl">
                The Vision Behind Fal Trading"
              </p>
            </div>
            <div className="w-full max-w-[200px] sm:max-w-[250px] mx-auto md:mx-0 object-cover">
              <img
                src={profileImage}
                alt="Fahl - Founder of Fal Trading"
                className="w-full h-auto rounded-sm"
              />
            </div>
          </div>

          {/* Right side - Quote */}
          <div className="md:w-3/5 lg:w-2/3 flex items-center">
            <div className="flex flex-col space-y-4 md:space-y-6">
              <div
                ref={quoteRef}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed flex flex-wrap"
                id="message-quote"
              >
                {splitWords(quote)}
              </div>
              <div className="text-right">
                <p className="text-lg sm:text-xl md:text-2xl font-bold">FAHL</p>
              </div>
              <div className="pt-6 md:pt-8">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 sm:space-x-4 border border-primary rounded-full px-5 sm:px-8 py-3 sm:py-4 text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <span className="text-base sm:text-lg md:text-xl">
                    Let's Connect
                  </span>
                  <span className="w-16 sm:w-24 md:w-32 h-[1px] bg-primary"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
