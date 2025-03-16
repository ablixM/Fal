import { Link } from "react-router-dom";
import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin once outside the component to avoid multiple registrations
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Define a threshold for significant window size changes
const SIZE_CHANGE_THRESHOLD = 50; // pixels

interface MessageProps {
  profileImage?: string;
}

function Message({ profileImage = "/FALCH.png" }: MessageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [letterElements, setLetterElements] = useState<HTMLSpanElement[]>([]);

  // Use refs instead of state to avoid re-renders
  const windowSizeRef = useRef<{ width: number; height: number }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Use ref to track ScrollTrigger instance to avoid re-renders
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Track if animation needs to be updated
  const needsUpdate = useRef<boolean>(true);

  const quote =
    "With a passion for premium products and global trade, I founded Fal Trading to connect businesses with the world's finest coffee, cashews, and dates. Our commitment to quality and trust ensures that every product we deliver meets the highest standards.";

  // Responsive animation settings based on screen size - uses ref to avoid re-renders
  const getAnimationSettings = useCallback(() => {
    const currentWidth = windowSizeRef.current.width;

    // Mobile settings
    if (currentWidth < 640) {
      return {
        // Viewport scroll points
        startTrigger: "top 85%", // Start revealing when section top reaches 85% down the viewport
        endTrigger: "center 30%", // Complete reveal when section center reaches 30% down the viewport
        // Animation parameters
        batchSize: 3,
        maxOpacity: 1,
        minOpacity: 0.1,
      };
    }
    // Tablet settings
    else if (currentWidth < 1024) {
      return {
        // Slightly different trigger points for tablets
        startTrigger: "top 80%",
        endTrigger: "center 35%",
        // Animation parameters
        batchSize: 4,
        maxOpacity: 1,
        minOpacity: 0.1,
      };
    }
    // Desktop settings
    else {
      return {
        // More space to scroll on desktop
        startTrigger: "top 75%",
        endTrigger: "center 40%",
        // Animation parameters
        batchSize: 5,
        maxOpacity: 1,
        minOpacity: 0.1,
      };
    }
  }, []);

  // Calculate letter batches for more efficient animation
  const getLetterBatches = useCallback(() => {
    if (letterElements.length === 0) return [];

    const settings = getAnimationSettings();
    const { batchSize } = settings;

    // Group letters into batches for more efficient animation
    const batches = [];

    // Create word-aware batches (keep words together when possible)
    let currentBatch: HTMLSpanElement[] = [];
    let currentWordIndex = -1;

    letterElements.forEach((letter) => {
      // Get the parent word element
      const wordEl = letter.parentElement;
      if (!wordEl) return;

      // Get the word index from the key attribute
      const keyAttr = wordEl.getAttribute("data-word-index");
      const wordIndex = keyAttr ? parseInt(keyAttr, 10) : -1;

      // If we're starting a new word and the current batch is getting large
      if (wordIndex !== currentWordIndex && currentBatch.length >= batchSize) {
        batches.push([...currentBatch]);
        currentBatch = [];
      }

      currentBatch.push(letter);
      currentWordIndex = wordIndex;

      // Cap batch size for long words
      if (currentBatch.length >= batchSize * 2) {
        batches.push([...currentBatch]);
        currentBatch = [];
      }
    });

    // Add the last batch if it's not empty
    if (currentBatch.length > 0) {
      batches.push(currentBatch);
    }

    return batches;
  }, [letterElements, getAnimationSettings]);

  // Setup scroll-based animation
  const setupAnimation = useCallback(() => {
    if (letterElements.length === 0 || !quoteRef.current || !sectionRef.current)
      return;

    // Clear any existing ScrollTrigger
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    const settings = getAnimationSettings();
    const batches = getLetterBatches();

    // Set initial opacity
    letterElements.forEach((letter) => {
      gsap.set(letter, { opacity: settings.minOpacity });
    });

    // Create ScrollTrigger for scroll-based reveal
    const st = ScrollTrigger.create({
      id: "message-text-reveal",
      trigger: sectionRef.current,
      start: settings.startTrigger,
      end: settings.endTrigger,
      scrub: 0.3, // Smooth scrubbing effect
      markers: false,
      onUpdate: (self) => {
        // Calculate how many batches should be visible based on scroll progress
        const progress = self.progress;
        const totalBatches = batches.length;

        // Determine how many batches to fully reveal based on progress
        const fullyRevealedBatches = Math.floor(progress * totalBatches);

        // Get the partially revealed batch
        const partialBatchIndex = fullyRevealedBatches;
        const partialProgress = progress * totalBatches - fullyRevealedBatches;

        // Update each batch based on its position relative to scroll progress
        batches.forEach((batch, index) => {
          let targetOpacity;

          if (index < fullyRevealedBatches) {
            // Batches that should be fully revealed
            targetOpacity = settings.maxOpacity;
          } else if (index === partialBatchIndex) {
            // The batch that's partially revealed
            targetOpacity =
              settings.minOpacity +
              (settings.maxOpacity - settings.minOpacity) * partialProgress;
          } else {
            // Batches that should remain hidden
            targetOpacity = settings.minOpacity;
          }

          // Apply the opacity to each letter in the batch
          batch.forEach((letter) => {
            gsap.to(letter, {
              opacity: targetOpacity,
              duration: 0.1,
              overwrite: true,
            });
          });
        });
      },
    });

    // Store the ScrollTrigger instance in the ref
    scrollTriggerRef.current = st;

    needsUpdate.current = false;
  }, [letterElements, getAnimationSettings, getLetterBatches]);

  // Handle window resize without causing re-renders
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const currentWidth = windowSizeRef.current.width;
      const currentHeight = windowSizeRef.current.height;

      // Only update if width changed significantly (prevents micro-adjustments)
      if (
        Math.abs(newWidth - currentWidth) > SIZE_CHANGE_THRESHOLD ||
        Math.abs(newHeight - currentHeight) > SIZE_CHANGE_THRESHOLD
      ) {
        // Update the ref without causing a re-render
        windowSizeRef.current = { width: newWidth, height: newHeight };

        // Mark that animation needs to be updated
        needsUpdate.current = true;

        // Refresh ScrollTrigger to adapt to new size
        ScrollTrigger.refresh();

        // If significant change, rebuild the animation
        if (letterElements.length > 0) {
          setupAnimation();
        }
      }
    };

    // Debounced resize handler
    let resizeTimer: number;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(handleResize, 200);
    };

    window.addEventListener("resize", debouncedResize);

    // Add handling for orientation changes
    const handleOrientationChange = () => {
      setTimeout(() => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        windowSizeRef.current = { width: newWidth, height: newHeight };
        needsUpdate.current = true;
        setupAnimation();
      }, 300);
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", debouncedResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      clearTimeout(resizeTimer);
    };
  }, [letterElements, setupAnimation]);

  // Setup animation when letterElements change or component mounts
  useEffect(() => {
    if (letterElements.length > 0 && needsUpdate.current) {
      setupAnimation();
    }

    // Clean up function
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [letterElements, setupAnimation]);

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
      <span
        key={`word_${i}`}
        data-word-index={i}
        className="inline-block mr-2 mb-1"
      >
        {splitLetters(word)}
      </span>
    ));
  };

  const splitLetters = (word: string) => {
    return word.split("").map((letter, i) => (
      <span
        key={`letter_${i}`}
        className="letter opacity-10 inline-block transition-opacity duration-100"
      >
        {letter}
      </span>
    ));
  };

  return (
    <div
      ref={sectionRef}
      className="w-full bg-secondary  min-h-screen text-primary  flex items-center relative overflow"
      id="message-section"
    >
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 lg:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-24">
          {/* Left side - Title and Image */}
          <div className="flex flex-col items-start space-y-6 md:space-y-8 md:w-2/5 lg:w-1/3">
            <div className="text-start">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-2">
                MEET, FAHL
              </h2>
              <p className="text-md sm:text-lg  md:text-xl lg:text-2xl uppercase">
                The Vision Behind Fal Trading
              </p>
            </div>
            <div className="relative overflow-hidden max-w-[350px] sm:max-w-[450px] w-full ">
              <img
                src={profileImage}
                alt="Fahl - Founder of Fal Trading"
                className="w-full h-full object-cover object-center rounded-sm"
              />
            </div>
          </div>

          {/* Right side - Quote */}
          <div className="md:w-3/5 lg:w-2/3 flex items-center">
            <div className="flex flex-col px-4 sm:px-6 space-y-4 md:space-y-6">
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
              <div className="">
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
