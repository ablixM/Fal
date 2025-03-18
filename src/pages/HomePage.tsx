import LandingText from "../components/LandingText";
import HeroImageSlide from "../components/HeroImageSlide";
import Message from "../components/Message";
import WhyChooseUs from "../components/WhyChooseUs";
function HomePage() {
  return (
    <>
      <LandingText />

      <WhyChooseUs />
      <HeroImageSlide />

      <Message />
      <div className="h-screen bg-primary"></div>
    </>
  );
}

export default HomePage;
