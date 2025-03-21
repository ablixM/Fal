import LandingText from "../components/LandingText";
import Message from "../components/Message";
import WhyChooseUs from "../components/WhyChooseUs";
import HeroVideo from "../components/HeroVideo";
import ProductsSection from "../components/ProductsSection";
import AnimatedTitle from "../components/AnimatedTitle";
function HomePage() {
  return (
    <>
      <LandingText />

      <HeroVideo />
      <Message />
      <AnimatedTitle title1="OUR" title2="PRODUCTS" />
      <ProductsSection />
      <AnimatedTitle title1="FAL TRADING" title2="WHY CHOOSE " />
      <WhyChooseUs />
    </>
  );
}

export default HomePage;
