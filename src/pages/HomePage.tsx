import LandingText from "../components/LandingText";
import Message from "../components/Message";
import WhyChooseUs from "../components/WhyChooseUs";
import HeroVideo from "../components/HeroVideo";
import ProductsSection from "../components/ProductsSection";
import AnimatedTitle from "../components/AnimatedTitle";
import HeroImageSlide from "../components/HeroImageSlide";

function HomePage() {
  return (
    <>
      <LandingText />

      <HeroVideo />
      <Message />
      <AnimatedTitle title1="OUR" title2="PRODUCTS" />
      <HeroImageSlide />
      <ProductsSection />
      <AnimatedTitle title1="WHY" title2="CHOOSE US" />
      <WhyChooseUs />
    </>
  );
}

export default HomePage;
