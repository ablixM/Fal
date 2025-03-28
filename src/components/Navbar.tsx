import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FlipLink } from "./FlipLink";

interface NavItem {
  name: string;
  path: string;
}

function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > prevScrollY;

      // Only hide navbar after scrolling down 50px
      if (scrollingDown && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  return isVisible;
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isVisible = useScrollDirection();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About-Us", path: "/about" },
    { name: "Contact-Us", path: "/contact" },
  ];
  const navItemsMobile: NavItem[] = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About-Us", path: "/about" },
    { name: "Contact-Us", path: "/contact" },
  ];

  // Shared transition properties for consistent animation
  const transitionProps = {
    type: "tween",
    ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    duration: 0.6,
  };

  // Main navbar animation variants
  const navbarVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: transitionProps,
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: transitionProps,
    },
  };

  // Mobile overlay animation variants
  const overlayVariants = {
    closed: {
      opacity: 0,

      transition: {
        ...transitionProps,

        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,

      transition: {
        ...transitionProps,
        delayChildren: 0.1,
        staggerChildren: 0.09,
      },
    },
  };

  // Animation variants for mobile menu items
  const itemVariants = {
    closed: {
      opacity: 0,
      y: 50,
      x: 50,
      transition: {
        duration: 1,
        ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
    },
    open: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 1,
        ease: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
    },
  };

  return (
    <motion.header
      variants={navbarVariants}
      initial="visible"
      animate={isVisible ? "visible" : "hidden"}
      className="w-full z-999 fixed top-0 left-0 right-0"
    >
      <div className="max-w-screen-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex justify-between items-center bg-primary">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className=" transition-colors duration-500">
            <span className="text-[var(--color-secondary)] font-normal text-xl">
              FAHL
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 lg:space-x-8">
          {navItems.map((item) => (
            <FlipLink
              key={item.name}
              to={item.path}
              className={`${
                isMenuOpen
                  ? "text-[var(--color-primary)]"
                  : "text-[var(--color-secondary)]"
              } font-normal text-lg transition-colors duration-500`}
              lineHeight="1.2"
            >
              {item.name}
            </FlipLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden text-md uppercase tracking-wider transition-colors duration-500 ${
            isMenuOpen
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-secondary)]"
          }`}
          onClick={toggleMenu}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile Menu Overlay with synchronized animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-[var(--color-secondary)] z-30 flex flex-col md:hidden h-screen overflow-hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="max-w-screen-4xl w-full px-4 sm:px-6 md:px-8 mx-auto py-3 sm:py-4 flex justify-between items-center">
              {/* Logo in mobile menu */}
              <div className="flex items-center">
                <Link to="/">
                  <span className="text-[var(--color-primary)] font-medium text-xl">
                    FAHL
                  </span>
                </Link>
              </div>

              {/* Close button */}
              <button
                className="text-[var(--color-primary)] text-md uppercase tracking-wider"
                onClick={toggleMenu}
              >
                CLOSE
              </button>
            </div>

            {/* Menu items - vertical layout with animation */}
            <motion.nav className="flex flex-col px-4 sm:px-6 md:px-8 bg-[var(--color-secondary)] h-screen items-start justify-center ml-4 sm:ml-8 md:ml-12">
              {navItemsMobile.map((item, index) => (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  custom={index}
                  className="py-4"
                >
                  <Link
                    to={item.path}
                    className="text-[var(--color-quinary)] font-inter font-normal uppercase text-4xl sm:text-6xl text-left  tracking-wide block transition-colors duration-300 hover:text-primary"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
