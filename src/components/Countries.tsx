import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import CountryLogoParallex from "./CountryLogoParallex";
const Countries = () => {
  return (
    <div className="bg-neutral-800">
      <CountriesSection />
    </div>
  );
};

const CountriesSection = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-100%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh]  bg-neutral-900">
      <div className="sticky top-1/4 sm:top-0 flex  items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            return <Card card={card} key={card.id} />;
          })}
        </motion.div>
      </div>
      <div
        ref={targetRef}
        className="sticky top-80 flex h-screen
         items-center overflow-hidden"
      >
        <CountryLogoParallex />
      </div>
    </section>
  );
};

const Card = ({ card }: { card: CardType }) => {
  return (
    <div
      key={card.id}
      className="group relative h-[450px] w-[450px] overflow-hidden bg-neutral-200"
    >
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center"></div>
    </div>
  );
};

export default Countries;

type CardType = {
  url: string;
  title: string;
  id: number;
};

const cards: CardType[] = [
  {
    url: "/GR.png",
    title: "GERMANY",
    id: 1,
  },
  {
    url: "/IQ.png",
    title: "IRAQ",
    id: 2,
  },
  {
    url: "/IY.png",
    title: "ITALY",
    id: 3,
  },
  {
    url: "/RU.png",
    title: "RUSSIA",
    id: 4,
  },
  {
    url: "/SZ.png",
    title: "SWITZERLAND",
    id: 5,
  },
  {
    url: "/TU.png",
    title: "TURKEY",
    id: 6,
  },
];
