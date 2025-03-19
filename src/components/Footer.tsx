import { useState } from "react";
import { motion } from "framer-motion";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing email:", email);
    setEmail("");
  };

  const siteMapLinks = [
    "Chair-man Message",
    "What we Do",
    "Why choose FAL Services",
    "What our client say",
    "Our Partners",
  ];

  return (
    <footer className="bg-secondary text-primary py-16 z-50 relative">
      <div className="container mx-auto px-4">
        {/* Header section with CTA */}
        <div className="mb-20">
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-quinary mb-8">
            Get in touch to
            <br />
            hear more.
          </h2>
          <div className="flex justify-end">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block border border-primary rounded-full py-3 px-8 sm:py-4 sm:px-10 md:py-5 md:px-12 lg:py-6 lg:px-14 text-primary hover:bg-primary hover:text-secondary transition-colors text-sm sm:text-xl md:text-3xl lg:text-4xl"
            >
              CONTACT US
            </motion.a>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 text-primary md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Newsletter subscription */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-xl font-medium mb-6">
              SUBSCRIBE TO NEWS LETTER
            </h3>
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 pr-12 bg-transparent border-b border-gray-500 text-primary focus:outline-none focus:border-primary"
                required
              />
              <button
                type="submit"
                className="absolute right-0 bottom-2"
                aria-label="Subscribe"
              >
                <motion.svg
                  whileHover={{ x: 5 }}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>
            </form>
          </div>

          {/* Site Map */}
          <div>
            <h3 className="text-xl font-medium mb-6">SITE MAP</h3>
            <ul className="space-y-2">
              {siteMapLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-medium mb-6">HEADQUARTER</h3>
            <p className="text-gray-300 mb-4">
              Building 88-89, Musaffah 26, Abu Dhabi UAE
            </p>

            <h3 className="text-xl font-medium mt-8 mb-6">CONTACT INFO</h3>
            <p className="text-gray-300 mb-4">
              Office phone number: +97124412253
            </p>

            <h3 className="text-xl font-medium mt-8 mb-6">EMAIL</h3>
            <p className="text-gray-300">info@faltrading.com</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
          <p>Copyright © 2025 All Rights Reserved by FAL Trading LLC</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
