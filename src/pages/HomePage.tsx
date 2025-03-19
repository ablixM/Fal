import LandingText from "../components/LandingText";
import Message from "../components/Message";
import WhyChooseUs from "../components/WhyChooseUs";
import HeroVideo from "../components/HeroVideo";
import HeroImageSlide from "../components/HeroImageSlide";
function HomePage() {
  return (
    <>
      <LandingText />

      <HeroVideo />
      <WhyChooseUs />
      <HeroImageSlide />
      <Message />
    </>
  );
}

export default HomePage;
