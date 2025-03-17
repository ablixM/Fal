"use client";
import { useRef } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  killScrollTriggers,
  initScrollTriggerWithPriority,
} from "../utils/gsapInit";
import "../styles/whyChooseUs.css";
import AnimatedTitle from "./AnimatedTitle";

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
          <h1>{title}</h1>
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
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useGSAP(
    () => {
      if (!container.current) return;

      // Initialize with higher priority (executes after HeroImageSlide)
      initScrollTriggerWithPriority(() => {
        // Clean up any existing ScrollTriggers for this component
        killScrollTriggers(scrollTriggersRef.current);
        scrollTriggersRef.current = [];

        // Force a complete refresh
        ScrollTrigger.refresh(true);

        // Use scoped selectors to avoid conflicts with other components
        const cards = gsap.utils.toArray<HTMLElement>(".why-choose-us__card");

        // Create ScrollTrigger for intro section
        const introTrigger = ScrollTrigger.create({
          trigger: cards[0],
          start: "top 35%",
          endTrigger: cards[cards.length - 1],
          end: "top 30%",
          pin: ".why-choose-us__intro",
          pinSpacing: false,
          id: "why-choose-us-intro",
          anticipatePin: 1,
        });

        scrollTriggersRef.current.push(introTrigger);

        // Create ScrollTrigger for each card
        cards.forEach((card, index) => {
          const isLastCard = index === cards.length - 1;
          const cardInner = card.querySelector(".why-choose-us__card-inner");

          if (!isLastCard && cardInner) {
            // Pin each card
            const pinTrigger = ScrollTrigger.create({
              trigger: card,
              start: "top 35%",
              endTrigger: ".why-choose-us__outro",
              end: "top 65%",
              pin: true,
              pinSpacing: false,
              id: `why-choose-us-card-pin-${index + 5}`, // Add unique ID for debugging
            });

            scrollTriggersRef.current.push(pinTrigger);

            // Animate card inner content
            const animTrigger = gsap.to(cardInner, {
              y: `-${(cards.length - index) * 14}vh`,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top 35%",
                endTrigger: ".why-choose-us__outro",
                end: "top 65%",
                scrub: true,
                id: `why-choose-us-card-anim-${index + 5}`, // Add unique ID for debugging
              },
            }).scrollTrigger;

            if (animTrigger) {
              scrollTriggersRef.current.push(animTrigger);
            }
          }
        });
      }, 1); // Priority 1 means it runs after priority 0

      return () => {
        killScrollTriggers(scrollTriggersRef.current);
        scrollTriggersRef.current = [];
      };
    },
    { scope: container }
  );

  return (
    <div className="why-choose-us-container" ref={container}>
      <section className="why-choose-us__intro relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="object-cover w-full h-full md:h-full "
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/assets/hero-vid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <AnimatedTitle
            title1="Premium Coffee, Cashew & Dates"
            title2="from farm to global markets"
          />
          <p className="text-white text-xl md:text-2xl mt-6 max-w-3xl mx-auto text-center font-light">
            We connect quality producers with discerning buyers through ethical
            sourcing and reliable global distribution.
          </p>
        </div>
      </section>

      <section className="why-choose-us__cards">
        {cards.map((card, index) => (
          <Card key={index} {...card} index={index} />
        ))}
      </section>

      <section className="why-choose-us__outro"></section>
    </div>
  );
}
