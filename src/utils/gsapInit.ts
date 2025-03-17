import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP plugins once at the application level
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export { gsap, useGSAP, ScrollTrigger };

// Utility function to safely kill ScrollTrigger instances
export function killScrollTriggers(instances: ScrollTrigger[]) {
  if (instances && instances.length > 0) {
    instances.forEach((trigger) => {
      if (trigger && trigger.kill) {
        trigger.kill();
      }
    });
  }
}

// Utility function to create a debounced resize handler
export function createDebouncedResizeHandler(
  callback: () => void,
  delay = 200
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, delay);
  };
}

// Utility function to refresh ScrollTrigger
export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

// Add this function to the file
export function initScrollTriggerWithPriority(
  callback: () => void,
  priority = 0
) {
  // Higher priority means it initializes later (giving earlier components time to set up)
  setTimeout(() => {
    callback();
  }, priority * 50);
}
