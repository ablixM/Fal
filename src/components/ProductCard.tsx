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
        className="w-[90%] h-[50%] md:w-[80%] md:h-[80%] relative flex flex-col items-center justify-start rounded-lg "
        style={{
          backgroundColor: product.color,
          scale,
          top: `calc(-10% + ${index * 55}px)`,
        }}
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 text-center pt-16">
          {product.title || "DATES"}
        </h1>
        <p className="text-sm md:text-xl px-2 text-gray-300 mb-8 md:mb-16 max-w-lg text-center">
          {product.subTitle ||
            "Pure, rich, and naturally sweet – the finest dates from trusted farms."}
        </p>

        <div className="rounded-lg overflow-hidden w-full max-w-sm sm:max-w-xl md:max-w-2xl relative">
          <motion.div
            className="w-full h-full flex items-center justify-center "
            style={{ scale: imageScale }}
          >
            <img
              className="w-full h-full object-cover rounded-lg"
              src={product.src}
              alt={product.title}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default ProductCard;
