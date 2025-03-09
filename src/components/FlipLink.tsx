import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Animation constants
const DURATION = 0.25;
const STAGGER = 0;

interface FlipLinkProps {
  children: string;
  to: string;
  className?: string;
  onClick?: () => void;
  lineHeight?: string;
  fontSize?: string;
}

export function FlipLink({
  children,
  to,
  className,
  onClick,
  lineHeight = "1", // Default line height
  fontSize, // Optional explicit font size
}: FlipLinkProps) {
  return (
    <motion.div
      initial="initial"
      whileHover="hovered"
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      style={{
        lineHeight, // Apply line height control
        fontSize, // Apply font size if provided
      }}
    >
      <Link to={to} onClick={onClick} className="block">
        <div>
          {children.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </div>
        <div className="absolute inset-0">
          {children.split("").map((l, i) => (
            <motion.span
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              transition={{
                duration: DURATION,
                ease: "easeInOut",
                delay: STAGGER * i,
              }}
              className="inline-block text-black"
              key={i}
            >
              {l}
            </motion.span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
