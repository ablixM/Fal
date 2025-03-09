import { ReactNode, useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface PageTransitionProps {
  children: ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
  const container = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(".revealer", {
        duration: 1,
        width: "0",
        ease: "power3.inOut",
      });

      gsap.to(".revealer", {
        duration: 0.8,
        left: "100%",
        ease: "power3.inOut",
        delay: 1,
      });
    },
    { scope: container }
  );
  return (
    <div ref={container} className="relative w-full h-100vh overflow-hidden">
      <div className="revealer absolute inset-0 z-50 top-0 left-0 w-full h-100vh bg-black"></div>
      {children}
    </div>
  );
}

export default PageTransition;
