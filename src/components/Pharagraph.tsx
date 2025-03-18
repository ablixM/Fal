"use client";
import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";

interface PharagraphProps {
  text: string;
}

function Pharagraph({ text }: PharagraphProps) {
  const element = useRef(null);
  const { scrollYProgress } = useScroll({
    target: element,
    offset: ["start end", "start start"],
  });

  const words = text.split(" ");
  return (
    <p
      ref={element}
      className="text-center md:text-left text-xl sm:text-2xl md:text-2xl lg:text-4xl flex flex-wrap leading-10 sm:leading-13 md:leading-14 lg:leading-15"
    >
      {words.map((word, index) => {
        const start = index / words.length;
        const end = start + 1 / words.length;

        return (
          <Word key={index} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

const Word = ({
  children,
  range,
  progress,
}: {
  children: React.ReactNode;
  range: number[];
  progress: MotionValue<number>;
}) => {
  const characters = children?.toString().split("");
  const amount = range[1] - range[0];
  const step = amount / (typeof children === "string" ? children.length : 0);
  return (
    <span className="mr-3 relative">
      {characters?.map((character, index) => {
        const start = range[0] + step * index;
        const end = range[0] + step * (index + 1);
        return (
          <Character key={index} range={[start, end]} progress={progress}>
            {character}
          </Character>
        );
      })}
    </span>
  );
};

export default Pharagraph;

const Character = ({
  children,
  range,
  progress,
}: {
  children: React.ReactNode;
  range: number[];
  progress: MotionValue<number>;
}) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative">
      <span className="opacity-10 absolute ">{children}</span>
      <motion.span style={{ opacity }}>
        <span>{children}</span>
      </motion.span>
    </span>
  );
};
