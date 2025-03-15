import LandingText from "../components/LandingText";
import HeroImageSlide from "../components/HeroImageSlide";
import ScrollIndicator from "../components/ScrollIndicator";
import Message from "../components/Message";
function HomePage() {
  return (
    <div>
      <LandingText />
      <ScrollIndicator />
      <HeroImageSlide />
      <Message />
    </div>
  );
}

export default HomePage;
