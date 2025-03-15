import { Link } from "react-router-dom";
import { useRef } from "react";

interface MessageProps {
  profileImage?: string;
}

function Message({ profileImage = "/src/assets/FALCH.png" }: MessageProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className="w-full bg-secondary text-primary min-h-screen flex items-center relative overflow-hidden"
      data-scroll-section
    >
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16 lg:gap-24">
          {/* Left side - Title and Image */}
          <div className="flex flex-col items-center  space-y-8 md:w-2/5 lg:w-1/3">
            <div data-scroll data-scroll-speed="1" data-scroll-delay="0.05">
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                MEET, FAHL
              </h2>
              <p className="text-xl md:text-2xl">
                The Vision Behind Fal Trading"
              </p>
            </div>
            <div
              className="w-full max-w-[250px] mx-auto md:mx-0 object-cover"
              data-scroll
              data-scroll-speed="1.2"
            >
              <img
                src={profileImage}
                alt="Fahl - Founder of Fal Trading"
                className="w-full h-auto rounded-sm"
              />
            </div>
          </div>

          {/* Right side - Quote */}
          <div className="md:w-3/5 lg:w-2/3 flex items-center">
            <div className="flex flex-col space-y-6">
              <p
                className="text-xl md:text-2xl lg:text-3xl leading-relaxed"
                data-scroll
                data-scroll-speed="0.8"
              >
                With a passion for premium products and global trade, I founded
                Fal Trading to connect businesses with the world's finest
                coffee, cashews, and dates. Our commitment to quality and trust
                ensures that every product we deliver meets the highest
                standards."
              </p>
              <div className="text-right" data-scroll data-scroll-speed="1">
                <p className="text-xl md:text-2xl font-bold">FAHL</p>
              </div>
              <div className="pt-8" data-scroll data-scroll-speed="1.5">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-4 border border-primary rounded-full px-8 py-4 text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <span className="text-lg md:text-xl">Let's Connect</span>
                  <span className="w-32 h-[1px] bg-primary"></span>
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
