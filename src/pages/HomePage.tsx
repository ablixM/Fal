import LandingText from "../components/LandingText";
import HeroImageSlide from "../components/HeroImageSlide";
import Message from "../components/Message";
import AnimatedTitle from "../components/AnimatedTitle";
import WhyChooseUs from "../components/WhyChooseUs";
function HomePage() {
  return (
    <div>
      <LandingText />

      <WhyChooseUs />
      {/* <AnimatedTitle title1="OUR" title2="PRODUCTS" /> */}

      <HeroImageSlide />
      <Message />
    </div>
  );
}

export default HomePage;
