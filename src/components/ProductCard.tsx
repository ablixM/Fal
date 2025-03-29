"use client";
import { Product } from "../types/Products";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ProductCardProps {
  product: Product;
  index: number;
  range: [number, number];
  targetScale: number;
  progress: MotionValue<number>;
}
function ProductCard({
  product,
  index,
  range,
  targetScale,
  progress,
}: ProductCardProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-[100vh] flex items-center justify-center sticky top-0 md:top-[100px] "
    >
      <motion.div
        className="w-[90%] h-[50%] md:w-[80%] md:h-[80%] relative flex flex-col items-center justify-end rounded-lg text-octonary overflow-hidden"
        style={{
          scale,
          top: `calc(-10% + ${index * 55}px)`,
        }}
      >
        {/* Background image with scale animation */}
        <motion.div
          className="absolute inset-0 w-full h-full z-0"
          style={{ scale: imageScale }}
        >
          <img
            className="w-full h-full object-cover"
            src={product.src}
            alt={product.title}
          />
        </motion.div>

        {/* Black overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent"></div>

        {/* Content */}
        <div className="z-20 relative flex flex-col justify-end px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-left">
            {product.title || "DATES"}
          </h1>
          <p className="text-sm md:text-xl text-gray-300 mb-8 max-w-lg text-left">
            {product.subTitle ||
              "Pure, rich, and naturally sweet – the finest dates from trusted farms."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductCard;
