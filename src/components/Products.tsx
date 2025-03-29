import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ProductGrid from "./ProductGrid";
import { Product } from "./ProductGrid";
import AnimatedText from "./AnimatedText";
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
      {
        url: "/assets/hero-vid.mp4",
        subtitle: "Premium Selection",
        description:
          "Our carefully selected premium dates offer exceptional quality and taste.",
      },
      {
        url: "/assets/dates-hero.webp",
        subtitle: "Organic Farming",
        description:
          "Grown using sustainable methods without harmful pesticides or chemicals.",
      },
      {
        url: "/assets/dates-hero.webp",
        subtitle: "Harvest Process",
        description:
          "Handpicked at peak ripeness to ensure optimal flavor and texture.",
      },
      {
        url: "/assets/dates-hero.webp",
        subtitle: "Quality Control",
        description:
          "Rigorous inspection ensures only the finest dates reach our customers.",
      },
      {
        url: "/assets/dates-hero.webp",
        subtitle: "Hand-Picked",
        description:
          "Each date is individually selected to guarantee premium quality.",
      },
      {
        url: "/assets/dates-hero.webp",
        subtitle: "Nutritional Benefits",
        description:
          "Rich in fiber, antioxidants, and essential nutrients for overall health.",
      },
      {
        url: "/assets/dates-hero.webp",
        subtitle: "Sustainable Practices",
        description:
          "Environmentally conscious farming that preserves natural resources.",
      },
      {
        url: "/assets/dates-hero.webp",
        subtitle: "Global Export",
        description:
          "Delivering premium dates to customers worldwide with care and precision.",
      },
    ],
  },
  {
    title: "GREEN AND ROASTED COFEE BEANS",
    description:
      "Pure, rich, and naturally sweet – the finest dates from trusted farms.",
    images: [
      {
        url: "/assets/hero-vid.mp4",
        subtitle: "Arabica Beans",
        description:
          "Premium arabica beans known for their smooth, complex flavor profiles.",
      },
      {
        url: "/assets/cofee-hero.webp",
        subtitle: "Roasting Process",
        description:
          "Artisanal roasting techniques that enhance aroma and flavor complexity.",
      },
      {
        url: "/assets/cofee-hero.webp",
        subtitle: "Fair Trade",
        description:
          "Supporting farmers with fair prices and sustainable business practices.",
      },
      {
        url: "/assets/cofee-hero.webp",
        subtitle: "Specialty Blends",
        description:
          "Unique coffee blends crafted to deliver exceptional taste experiences.",
      },
      {
        url: "/assets/cofee-hero.webp",
        subtitle: "Artisan Roasting",
        description:
          "Small-batch roasting methods that ensure optimal flavor development.",
      },
      {
        url: "/assets/cofee-hero.webp",
        subtitle: "Flavor Profiles",
        description:
          "Diverse taste notes ranging from fruity and floral to nutty and chocolatey.",
      },
      {
        url: "/assets/cofee-hero.webp",
        subtitle: "Single Origin",
        description:
          "Beans sourced from specific regions to showcase unique regional characteristics.",
      },
      {
        url: "/assets/cofee-hero.webp",
        subtitle: "Premium Packaging",
        description:
          "Sealed for freshness with packaging that preserves aromatic qualities.",
      },
    ],
  },
  {
    title: "CASHEW NUTS",
    description:
      "Pure, rich, and naturally sweet – the finest dates from trusted farms.",
    images: [
      {
        url: "/assets/hero-vid.mp4",
        subtitle: "Premium Cashews",
        description:
          "Selected for size, color, and taste to ensure superior quality.",
      },
      {
        url: "/assets/cashe-hero.webp",
        subtitle: "Ethically Sourced",
        description:
          "Responsibly harvested with fair practices supporting local communities.",
      },
      {
        url: "/assets/cashe-hero.webp",
        subtitle: "Processing Facility",
        description:
          "State-of-the-art facilities that maintain highest standards of cleanliness.",
      },
      {
        url: "/assets/cashe-hero.webp",
        subtitle: "Bulk Selection",
        description:
          "Available in various quantities to meet different customer needs.",
      },
      {
        url: "/assets/cashe-hero.webp",
        subtitle: "Natural Farming",
        description:
          "Grown without harmful chemicals to preserve natural flavor and nutrients.",
      },
      {
        url: "/assets/cashe-hero.webp",
        subtitle: "Quality Grading",
        description:
          "Classified by size and appearance to meet international standards.",
      },
      {
        url: "/assets/cashe-hero.webp",
        subtitle: "Export Standard",
        description:
          "Meeting rigorous international quality and safety requirements.",
      },
      {
        url: "/assets/cashe-hero.webp",
        subtitle: "Packaging Process",
        description:
          "Sealed in protective packaging to maintain freshness and flavor.",
      },
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
              <AnimatedText
                text={currentSlide.title}
                as="h2"
                className="text-3xl md:text-4xl font-bold mb-4 text-center px-4"
                duration={1}
                delay={0.2}
                splitTypes={["words"]}
                staggerAmount={0.4}
              />
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-lg md:text-xl text-center max-w-2xl px-4"
            >
              <AnimatedText
                text={currentSlide.description}
                as="p"
                className="text-lg md:text-xl text-center max-w-2xl px-4"
                duration={1}
                delay={0.2}
                splitTypes={["words"]}
                staggerAmount={0.4}
              />
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
    <div className="w-full px-2 md:px-4">
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
