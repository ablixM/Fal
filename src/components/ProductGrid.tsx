import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export interface ProductImage {
  url: string;
  subtitle: string;
}

export interface Product {
  title: string;
  description: string;
  images: ProductImage[];
}

interface ProductGridProps {
  products: Product;
  index: number;
}

function ProductGrid({ products, index }: ProductGridProps) {
  // Create individual refs
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);

  // Setup individual scroll animations
  const { scrollYProgress: scrollYProgress1 } = useScroll({
    target: ref1,
    offset: ["start end", "end start"],
  });
  const scale1 = useTransform(scrollYProgress1, [0, 0.5, 1], [2, 1, 1]);

  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: ref2,
    offset: ["start end", "end start"],
  });
  const scale2 = useTransform(scrollYProgress2, [0, 0.5, 1], [2, 1, 1]);

  const { scrollYProgress: scrollYProgress3 } = useScroll({
    target: ref3,
    offset: ["start end", "end start"],
  });
  const scale3 = useTransform(scrollYProgress3, [0, 1], [2, 1]);

  const { scrollYProgress: scrollYProgress4 } = useScroll({
    target: ref4,
    offset: ["start end", "end start"],
  });
  const scale4 = useTransform(scrollYProgress4, [0, 0.5, 1], [2, 1, 1]);

  const { scrollYProgress: scrollYProgress5 } = useScroll({
    target: ref5,
    offset: ["start end", "end start"],
  });
  const scale5 = useTransform(scrollYProgress5, [0, 0.5, 1], [2, 1, 1]);

  const { scrollYProgress: scrollYProgress6 } = useScroll({
    target: ref6,
    offset: ["start end", "end start"],
  });
  const scale6 = useTransform(scrollYProgress6, [0, 0.5, 1], [2, 1, 1]);

  const { scrollYProgress: scrollYProgress7 } = useScroll({
    target: ref7,
    offset: ["start end", "end start"],
  });
  const scale7 = useTransform(scrollYProgress7, [0, 1], [2, 1]);

  const { scrollYProgress: scrollYProgress8 } = useScroll({
    target: ref8,
    offset: ["start end", "end start"],
  });
  const scale8 = useTransform(scrollYProgress8, [0, 1], [2, 1]);

  return (
    <>
      <div className="md:px-16 mx-auto">
        <div key={index}>
          <div className="grid grid-cols-8 grid-rows-10 gap-4 mt-4 sm:mt-8 md:mt-16">
            {/* Grid position 1 */}
            <div className="col-span-5 row-span-4 relative overflow-hidden">
              <motion.div
                ref={ref1}
                className="w-full h-full flex items-center justify-center"
                style={{ scale: scale1 }}
              >
                <video
                  className="w-full h-full object-cover"
                  src={products.images[0].url}
                  muted
                  loop
                  playsInline
                  autoPlay={true}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent flex items-end">
                <p className="text-denary font-medium text-2xl sm:text-4xl md:text-6xl p-4">
                  {products.images[0].subtitle}
                </p>
              </div>
            </div>

            {/* Grid position 2 */}
            <div className="col-span-3 row-span-4 col-start-6 relative overflow-hidden">
              <motion.div
                ref={ref2}
                className="w-full h-full flex items-center justify-center"
                style={{ scale: scale2 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={products.images[1].url}
                  alt={products.images[1].subtitle}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent flex items-end">
                <p className="text-denary font-medium text-2xl sm:text-4xl md:text-6xl p-4">
                  {products.images[1].subtitle}
                </p>
              </div>
            </div>

            {/* Grid position 3 */}
            <div className="col-span-2 row-span-4 row-start-5 relative overflow-hidden">
              <motion.div
                ref={ref3}
                className="w-full h-full flex items-center justify-center"
                style={{ scale: scale3 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={products.images[2].url}
                  alt={products.images[2].subtitle}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent flex items-end">
                <p className="text-denary font-medium text-2xl sm:text-4xl md:text-6xl p-4">
                  {products.images[2].subtitle}
                </p>
              </div>
            </div>

            {/* Grid position 4 */}
            <div className="col-span-3 row-span-3 col-start-3 row-start-5 relative overflow-hidden">
              <motion.div
                ref={ref4}
                className="w-full h-full flex items-center justify-center"
                style={{ scale: scale4 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={products.images[3].url}
                  alt={products.images[3].subtitle}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent flex items-end">
                <p className="text-denary font-medium text-2xl sm:text-4xl md:text-6xl p-4">
                  {products.images[3].subtitle}
                </p>
              </div>
            </div>

            {/* Grid position 5 */}
            <div className="col-span-3 row-span-4 col-start-6 row-start-5 relative overflow-hidden">
              <motion.div
                ref={ref5}
                className="w-full h-full flex items-center justify-center"
                style={{ scale: scale5 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={products.images[4].url}
                  alt={products.images[4].subtitle}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent flex items-end">
                <p className="text-denary font-medium text-2xl sm:text-4xl md:text-6xl p-4">
                  {products.images[4].subtitle}
                </p>
              </div>
            </div>

            {/* Grid position 6 */}
            <div className="col-span-3 row-span-3 col-start-3 row-start-8 relative overflow-hidden">
              <motion.div
                ref={ref6}
                className="w-full h-full flex items-center justify-center"
                style={{ scale: scale6 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={products.images[5].url}
                  alt={products.images[5].subtitle}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent flex items-end">
                <p className="text-denary font-medium text-2xl sm:text-4xl md:text-6xl p-4">
                  {products.images[5].subtitle}
                </p>
              </div>
            </div>

            {/* Grid position 7 */}
            <div className="col-span-2 row-span-2 row-start-9 relative overflow-hidden">
              <motion.div
                ref={ref7}
                className="w-full h-full flex items-center justify-center"
                style={{ scale: scale7 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={products.images[6].url}
                  alt={products.images[6].subtitle}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent flex items-end">
                <p className="text-denary font-medium text-2xl sm:text-4xl md:text-6xl p-4">
                  {products.images[6].subtitle}
                </p>
              </div>
            </div>

            {/* Grid position 8 */}
            <div className="col-span-3 row-span-2 col-start-6 row-start-9 relative overflow-hidden">
              <motion.div
                ref={ref8}
                className="w-full h-full flex items-center justify-center"
                style={{ scale: scale8 }}
              >
                <img
                  className="w-full h-full object-cover"
                  src={products.images[7].url}
                  alt={products.images[7].subtitle}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-nonary to-transparent flex items-end">
                <p className="text-denary font-medium text-2xl sm:text-4xl md:text-6xl p-4">
                  {products.images[7].subtitle}
                </p>
              </div>
            </div>
          </div>
          {/* Contact Us Button */}
          <motion.div
            className="mt-16 flex justify-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button className="group relative inline-flex items-center px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors duration-300">
              <span className="mr-8">Contact Us</span>
              <span className="group-hover:translate-x-2 transition-transform">
                &#8594;
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ProductGrid;
