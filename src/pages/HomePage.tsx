import LandingText from "../components/LandingText";
import HeroImageSlide from "../components/HeroImageSlide";
import ScrollIndicator from "../components/ScrollIndicator";

function HomePage() {
  return (
    <div>
      <LandingText />
      <ScrollIndicator />
      <HeroImageSlide />
    </div>
  );
}

export default HomePage;
