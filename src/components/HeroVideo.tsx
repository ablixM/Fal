import "../styles/heroVideo.css";
function HeroVideo() {
  return (
    <section className="hero-video__intro relative overflow-hidden m-0 md:m-4 rounded-none md:rounded-lg">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="object-cover w-full h-full md:h-full"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/assets/fahl-heroVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      {/* <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        <p className="text-primary text-xl md:text-2xl mt-6 max-w-3xl mx-auto text-center font-light">
          We connect quality producers with discerning buyers through ethical
          sourcing and reliable global distribution.
        </p>
      </div> */}
    </section>
  );
}

export default HeroVideo;
