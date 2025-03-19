import LandingText from "../components/LandingText";
import Message from "../components/Message";
import WhyChooseUs from "../components/WhyChooseUs";
import HeroVideo from "../components/HeroVideo";
import ProductsSection from "../components/ProductsSection";
function HomePage() {
  return (
    <>
      <LandingText />

      <HeroVideo />
      <Message />
      <ProductsSection />
      <WhyChooseUs />
    </>
  );
}

export default HomePage;
