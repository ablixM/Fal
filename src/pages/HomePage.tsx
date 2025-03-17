import LandingText from "../components/LandingText";
import HeroImageSlide from "../components/HeroImageSlide";
import Message from "../components/Message";
import AnimatedTitle from "../components/AnimatedTitle";
import WhyChooseUs from "../components/WhyChooseUs";
function HomePage() {
  return (
    <>
      <LandingText />

      <WhyChooseUs />
      <HeroImageSlide />
      <AnimatedTitle title1="A" title2="MESSAGE" />
      <Message />
    </>
  );
}

export default HomePage;
