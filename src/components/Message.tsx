import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import Pharagraph from "./Pharagraph";

// Register plugins
gsap.registerPlugin(ScrollTrigger, CustomEase);

interface MessageProps {
  profileImage?: string;
}

const quote =
  "With a passion for premium products and global trade, I founded Fal Trading to connect businesses with the world’s finest coffee, cashews, and dates. Our commitment to quality and trust ensures that every product we deliver meets the highest standards.";

function Message({ profileImage = "/FALCH.png" }: MessageProps) {
  return (
    <div
      className="w-full bg-secondary md:min-h-screen text-primary flex items-center relative overflow"
      id="message-section"
    >
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 lg:py-24 text-center">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-24">
          {/* Left side - Title and Image */}
          <div className="flex flex-col  md:flex-col space-y-6 md:space-y-8 md:w-2/5 lg:w-1/3">
            <div className="relative overflow-hidden max-w-[350px] sm:max-w-[450px]">
              <img
                src={profileImage}
                alt="Fahl - Founder of Fal Trading"
                className="w-full h-full object-cover object-center rounded-sm"
              />
            </div>
            <div className="flex px-2 flex-col items-center justify-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-2">
                MEET, FAHL
              </h2>
              <p className="text-md sm:text-lg md:text-xl lg:text-2xl uppercase text-center ">
                The Vision Behind Fal Trading
              </p>
            </div>
          </div>

          {/* Right side - Quote */}
          <div className="w-full md:w-4/5 lg:w-2/3 flex items-center justify-center">
            <div className="flex flex-col w-full px-0 sm:px-6 space-y-4 md:space-y-6">
              <div>
                <Pharagraph text={quote} />
              </div>

              <div className="">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 sm:space-x-4 border border-primary rounded-full px-5 sm:px-8 py-3 sm:py-4 text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <span className="text-base sm:text-lg md:text-xl">
                    Let's Connect
                  </span>
                  <span className="w-16 sm:w-24 md:w-32 h-[1px] bg-primary"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
