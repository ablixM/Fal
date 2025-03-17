import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook to handle page transition delays
 * @param delay - The delay in milliseconds before showing the page content
 * @returns isReady - Boolean indicating if the page should be displayed
 */
export function usePageTransitionDelay(delay = 800): boolean {
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset ready state on location change
    setIsReady(false);

    // Set a timeout to mark the component as ready after the delay
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    // Clean up the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [location.pathname, delay]);

  return isReady;
}
