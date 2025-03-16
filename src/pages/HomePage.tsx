import LandingText from "../components/LandingText";
import HeroImageSlide from "../components/HeroImageSlide";
import ScrollIndicator from "../components/ScrollIndicator";
import Message from "../components/Message";
import AnimatedTitle from "../components/AnimatedTitle";

function HomePage() {
  return (
    <div>
      <LandingText />
      <ScrollIndicator />
      <HeroImageSlide />
      <Message />
      <AnimatedTitle title1="OUR" title2="PRODUCTS" />
    </div>
  );
}

export default HomePage;
