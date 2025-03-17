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
            src={`/assets/card-${index + 1}.jpeg`}
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
      title: "Brand Foundation",
      copy: " The heart of your company's story. It shapes your vision, values, and voice, ensuring a clear and powerful impact in every, interaction.",
    },
    {
      title: "Design Identity",
      copy: "Your brand's visual fingerprint. It crafts a distinctive look that sparks recognition and builds emotional connections with your audience.",
    },
    {
      title: "Digital Presence",
      copy: "Our web solutions combine cutting-edge design and seamless functionality to create experiences that captivate and inspire your audience.",
    },
    {
      title: "Product Design",
      copy: "We craft user-first products that are both functional and visually appealing, delivering solutions that leave a lasting impression.",
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
    <div className="why-choose-us-container " ref={container}>
      <section className="why-choose-us__intro"></section>

      <section className="why-choose-us__cards">
        {cards.map((card, index) => (
          <Card key={index} {...card} index={index} />
        ))}
      </section>

      <section className="why-choose-us__outro"></section>
    </div>
  );
}
