import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ProductGrid from "./ProductGrid";
import { Product } from "./ProductGrid";
interface VideoSlide {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
}

const products: Product[] = [
  {
    title: "DATES",
    description:
      "Pure, rich, and naturally sweet – the finest dates from trusted farms.",
    images: [
      { url: "/assets/hero-vid.mp4", subtitle: "Premium Selection" },
      { url: "/assets/dates-hero.webp", subtitle: "Organic Farming" },
      { url: "/assets/dates-hero.webp", subtitle: "Harvest Process" },
      { url: "/assets/dates-hero.webp", subtitle: "Quality Control" },
      { url: "/assets/dates-hero.webp", subtitle: "Hand-Picked" },
      { url: "/assets/dates-hero.webp", subtitle: "Nutritional Benefits" },
      { url: "/assets/dates-hero.webp", subtitle: "Sustainable Practices" },
      { url: "/assets/dates-hero.webp", subtitle: "Global Export" },
    ],
  },
  {
    title: "GREEN AND ROASTED COFEE BEANS",
    description:
      "Pure, rich, and naturally sweet – the finest dates from trusted farms.",
    images: [
      { url: "/assets/hero-vid.mp4", subtitle: "Arabica Beans" },
      { url: "/assets/cofee-hero.webp", subtitle: "Roasting Process" },
      { url: "/assets/cofee-hero.webp", subtitle: "Fair Trade" },
      { url: "/assets/cofee-hero.webp", subtitle: "Specialty Blends" },
      { url: "/assets/cofee-hero.webp", subtitle: "Artisan Roasting" },
      { url: "/assets/cofee-hero.webp", subtitle: "Flavor Profiles" },
      { url: "/assets/cofee-hero.webp", subtitle: "Single Origin" },
      { url: "/assets/cofee-hero.webp", subtitle: "Premium Packaging" },
    ],
  },
  {
    title: "CASHEW NUTS",
    description:
      "Pure, rich, and naturally sweet – the finest dates from trusted farms.",
    images: [
      { url: "/assets/hero-vid.mp4", subtitle: "Premium Cashews" },
      { url: "/assets/cashe-hero.webp", subtitle: "Ethically Sourced" },
      { url: "/assets/cashe-hero.webp", subtitle: "Processing Facility" },
      { url: "/assets/cashe-hero.webp", subtitle: "Bulk Selection" },
      { url: "/assets/cashe-hero.webp", subtitle: "Natural Farming" },
      { url: "/assets/cashe-hero.webp", subtitle: "Quality Grading" },
      { url: "/assets/cashe-hero.webp", subtitle: "Export Standard" },
      { url: "/assets/cashe-hero.webp", subtitle: "Packaging Process" },
    ],
  },
];

const videoSlides: VideoSlide[] = [
  {
    id: 1,
    title: "Premium Date Harvesting",
    description: "Watch how we carefully select and harvest the finest dates",
    videoUrl: "/assets/hero-vid.mp4",
  },
  {
    id: 2,
    title: "Coffee Bean Roasting",
    description: "Our artisanal coffee roasting process",
    videoUrl: "/assets/hero-vid.mp4",
  },
  {
    id: 3,
    title: "Cashew Processing",
    description: "From farm to package - our quality process",
    videoUrl: "/assets/hero-vid.mp4",
  },
];

function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videoSlides.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, []);

  const currentSlide = videoSlides[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-gray-900  overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <video
            className="w-full h-full object-cover"
            src={currentSlide.videoUrl}
            muted
            loop
            playsInline
            autoPlay={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-nonary to-transparent flex flex-col items-center justify-center text-denary">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-center px-4"
            >
              {currentSlide.title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-lg md:text-xl text-center max-w-2xl px-4"
            >
              {currentSlide.description}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {videoSlides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            title={`Go to slide ${index + 1}: ${slide.title}`}
            aria-label={`Go to slide ${index + 1}: ${slide.title}`}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Products() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full mx-auto sm:px-4 pt-16 py-4">
        <motion.h1
          className="text-5xl md:text-6xl font-bold my-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          PRODUCTS
        </motion.h1>
      </div>

      {/* Video Carousel Section */}
      <div className="mb-16">
        <VideoCarousel />
      </div>

      <div className="w-full mx-auto sm:px-4 py-4">
        {products.map((product, index) => {
          return <ProductGrid key={index} products={product} index={index} />;
        })}
      </div>
    </div>
  );
}
