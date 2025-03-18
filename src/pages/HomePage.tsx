import LandingText from "../components/LandingText";
import Message from "../components/Message";
import WhyChooseUs from "../components/WhyChooseUs";
import HeroVideo from "../components/HeroVideo";
function HomePage() {
  return (
    <>
      <LandingText />
      <HeroVideo />
      <Message />
      <WhyChooseUs />
      {/* <HeroImageSlide /> */}
    </>
  );
}

export default HomePage;
