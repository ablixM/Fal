import { useRef } from "react";
import { products } from "../data/products";
import ProductCard from "./ProductCard";
import { useScroll } from "framer-motion";

function ProductsSection() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  return (
    <div ref={container} className="mt-6">
      {products.map((product, index) => {
        const targetScale = 1 - (products.length - index) * 0.05;
        return (
          <ProductCard
            key={index}
            product={product}
            index={index}
            range={[index * 0.25, 1]}
            targetScale={targetScale}
            progress={scrollYProgress}
          />
        );
      })}
    </div>
  );
}

export default ProductsSection;
