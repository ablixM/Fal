"use client";
import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "../utils/gsapInit";
import "../styles/whyChooseUs.css";

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

      // Create ScrollTrigger for intro section
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
          });

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
              // Add unique ID for debugging
            },
          });
        }
      });
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
