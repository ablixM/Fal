import { motion, useScroll, useTransform } from "framer-motion";

import "../styles/AnimatedTitle.css";
import { useRef } from "react";

interface AnimatedTitleProps {
  title1: string;
  title2: string;
}

export default function AnimatedTitle({ title1, title2 }: AnimatedTitleProps) {
  const containerA = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerA,
    offset: ["start start", "0.5 0.7"],
  });

  const forwardX = useTransform(scrollYProgress, [0, 1], ["0%", "-200%"]);
  const backwardsX = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);

  return (
    <div ref={containerA}>
      <div className="sticky-wrapper text-septenary ">
        <motion.p
          className="motion-paragraph text-left"
          style={{ x: forwardX }}
        >
          {title1.trim()}
        </motion.p>
        <motion.p
          className="motion-paragraph text-right"
          style={{ x: backwardsX }}
        >
          {title2.trim()}
        </motion.p>
      </div>
    </div>
  );
}
