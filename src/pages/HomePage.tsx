import LandingText from "../components/LandingText";
import HeroImageSlide from "../components/HeroImageSlide";
import Message from "../components/Message";
import AnimatedTitle from "../components/AnimatedTitle";

function HomePage() {
  return (
    <div>
      <LandingText />

      <HeroImageSlide />
      <Message />
      <AnimatedTitle title1="OUR" title2="PRODUCTS" />
    </div>
  );
}

export default HomePage;
