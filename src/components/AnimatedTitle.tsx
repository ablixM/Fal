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
    offset: ["start start", "0.5 start"],
  });

  const forwardX = useTransform(scrollYProgress, [0, 1], ["350%", "-250%"]);
  const backwardsX = useTransform(scrollYProgress, [0, 1], ["-250%", "350%"]);

  return (
    <div ref={containerA}>
      <div className="sticky-wrapper text-septenary h-[100vh]">
        <motion.p className="motion-paragraph" style={{ x: forwardX }}>
          {title1.trim()}
        </motion.p>
        <motion.p className="motion-paragraph" style={{ x: backwardsX }}>
          {title2.trim()}
        </motion.p>
      </div>
    </div>
  );
}
