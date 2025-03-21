"use client";
import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  initScrollTriggerWithPriority,
} from "../utils/gsapInit";
import "../styles/whyChooseUs.css";

// Add window interface extension
declare global {
  interface Window {
    resizeTimer: number;
  }
}

interface CardProps {
  title: string;
  copy: string;
  index: number;
}

const Card = ({ title, copy, index }: CardProps) => {
  return (
    <div className="why-choose-us__card" id={`why-choose-us-card-${index + 1}`}>
      <div className="why-choose-us__card-inner">
        <div className="why-choose-us__card-content ">
          <h1 className="text-quinary">{title}</h1>
          <p>{copy}</p>
        </div>
        <div className="why-choose-us__card-img">
          <img
            className="why-choose-us__card-img-element"
            src={`/assets/card-${index + 1}.png`}
            alt={title}
          />
        </div>
      </div>
    </div>
  );
};

export default function WhyChooseUs() {
  const cards = [
    {
      title: "FAST & SECURE Global Shipping",
      copy: "We offer fast and secure global shipping services to ensure your products reach their destination on time and in perfect condition.",
    },
    {
      title: "Sustainably Sourced, Premium Quality",
      copy: "We source our products from sustainable and ethical suppliers to ensure the highest quality and ethical production.",
    },
    {
      title: "Competitive Pricing & Bulk Orders",
      copy: "We offer competitive pricing and bulk order discounts to ensure you get the best value for your money.",
    },
    {
      title: "Trusted by Global Clients",
      copy: "We have a reputation for delivering exceptional service and products to clients around the world.",
    },
  ];

  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Use scoped selectors to avoid conflicts with other components
      const cards = gsap.utils.toArray<HTMLElement>(".why-choose-us__card");
      // Store context for cleanup - using proper type
      let whyChooseUsContext: ScrollTrigger | null = null;

      // Create a media match condition for non-mobile devices
      const mediaMatch = window.matchMedia("(min-width: 768px)");

      // Function to initialize animations based on screen size
      const initAnimations = () => {
        // First clear all ScrollTriggers that belong to this component
        ScrollTrigger.getAll().forEach((st) => {
          const id = st.vars.id as string | undefined;
          if (id && id.includes("why-choose-us")) {
            st.kill();
          }
        });

        // Now clear any ScrollTriggers that don't have an ID and aren't from other components
        ScrollTrigger.getAll().forEach((st) => {
          const id = st.vars.id as string | undefined;
          if (!id || (!id.includes("hero-") && !id.includes("why-choose-us"))) {
            st.kill();
          }
        });

        // Reset any inline styles applied by GSAP that might be causing issues
        gsap.set(
          [cards, ".why-choose-us__intro", ".why-choose-us__card-inner"],
          {
            clearProps: "all",
          }
        );

        // Create a context for this component with a unique timestamp to ensure freshness
        ScrollTrigger.config({ limitCallbacks: true });

        const contextId = "why-choose-us-context";
        // First kill any existing context with this ID
        const existingContext = ScrollTrigger.getById(contextId);
        if (existingContext) {
          existingContext.kill();
        }

        // Create a fresh context
        whyChooseUsContext = ScrollTrigger.create({
          id: contextId,
          start: 0,
          end: 99999,
          markers: false,
        });

        if (mediaMatch.matches) {
          // Desktop animations
          ScrollTrigger.create({
            trigger: cards[0],
            start: "top 35%",
            endTrigger: cards[cards.length - 1],
            end: "top 30%",
            pin: ".why-choose-us__intro",
            pinSpacing: false,
            id: "why-choose-us-intro",
            anticipatePin: 1,
          });

          // Create ScrollTrigger for each card
          cards.forEach((card, index) => {
            const isLastCard = index === cards.length - 1;
            const cardInner = card.querySelector(".why-choose-us__card-inner");

            if (!isLastCard) {
              // Pin each card
              ScrollTrigger.create({
                trigger: card,
                start: "top 35%",
                endTrigger: ".why-choose-us__outro",
                end: "top 65%",
                pin: true,
                pinSpacing: false,
                id: `why-choose-us-card-pin-${index}`,
              });

              if (cardInner) {
                // Animate card inner content
                gsap.to(cardInner, {
                  y: `-${(cards.length - index) * 14}vh`,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 35%",
                    endTrigger: ".why-choose-us__outro",
                    end: "top 65%",
                    scrub: true,
                    id: `why-choose-us-card-anim-${index}`,
                  },
                });
              }
            }
          });
        } else {
          // Mobile animations - simplified version without complex pinning
          cards.forEach((card, index) => {
            // For mobile, just add a fade-in animation without pinning
            gsap.fromTo(
              card,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 80%",
                  end: "top 50%",
                  scrub: true,
                  id: `why-choose-us-mobile-anim-${index}`,
                },
              }
            );
          });
        }

        // Force ScrollTrigger to recalculate positions
        ScrollTrigger.refresh(true);
      };

      // Use a higher delay for the WhyChooseUs component
      // Initialize animations based on current screen size with priority
      // Production environments may need more time to ensure DOM is ready
      const initDelay =
        typeof window !== "undefined" &&
        window.location.hostname !== "localhost"
          ? 500
          : 100;

      setTimeout(() => {
        initScrollTriggerWithPriority(() => {
          initAnimations();
        }, 20); // Higher priority value than HeroImageSlide
      }, initDelay);

      // Update animations when window is resized
      mediaMatch.addEventListener("change", initAnimations);

      // Also handle general resize events for safety
      const resizeHandler = () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 250) as unknown as number;
      };

      window.addEventListener("resize", resizeHandler);

      // Clean up event listeners on component unmount
      return () => {
        mediaMatch.removeEventListener("change", initAnimations);
        window.removeEventListener("resize", resizeHandler);
        clearTimeout(window.resizeTimer);

        // Clean up context
        if (whyChooseUsContext) {
          try {
            whyChooseUsContext.kill();
          } catch (e) {
            console.error("Error killing ScrollTrigger context:", e);
          }
        }

        // Clean up all scrolltriggers related to this component
        ScrollTrigger.getAll().forEach((st) => {
          const id = st.vars.id as string | undefined;
          if (id && id.includes("why-choose-us")) {
            try {
              st.kill();
            } catch (e) {
              console.error("Error killing ScrollTrigger:", e);
            }
          }
        });
      };
    },
    { scope: container }
  );

  return (
    <div className="why-choose-us-container" ref={container}>
      <section className="why-choose-us__intro "></section>
      <section className="why-choose-us__cards">
        {cards.map((card, index) => (
          <Card key={index} {...card} index={index} />
        ))}
      </section>

      <section className="why-choose-us__outro"></section>
    </div>
  );
}
