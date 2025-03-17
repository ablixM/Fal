import { ReactNode } from "react";
import { usePageTransitionDelay } from "../hooks/usePageTransitionDelay";

interface PageLoadDelayProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Component that delays rendering its children to allow for page transitions
 * without adding a second animation
 */
function PageLoadDelay({ children, delay = 800 }: PageLoadDelayProps) {
  const isDelayComplete = usePageTransitionDelay(delay);

  // Simply render or don't render based on delay
  // No additional animation to avoid conflict with PageTransition
  if (!isDelayComplete) {
    return null;
  }

  return <>{children}</>;
}

export default PageLoadDelay;
