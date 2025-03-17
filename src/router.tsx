import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import ProductPage from "./pages/ProductPage";
import ServicePage from "./pages/ServicePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PageLoadDelay from "./components/PageLoadDelay";

// Match delay with the transition duration in PageTransition.tsx
const TRANSITION_DELAY = 1500; // Same as TRANSITION_DURATION in milliseconds

// Add loading delay wrapper
const withLoadingDelay = (Component: React.ComponentType) => {
  return (props: Record<string, unknown>) => {
    return (
      <PageLoadDelay delay={TRANSITION_DELAY}>
        <Component {...props} />
      </PageLoadDelay>
    );
  };
};

// Wrap components with loading delay
const DelayedHomePage = withLoadingDelay(HomePage);
const DelayedProductPage = withLoadingDelay(ProductPage);
const DelayedServicePage = withLoadingDelay(ServicePage);
const DelayedAboutPage = withLoadingDelay(AboutPage);
const DelayedContactPage = withLoadingDelay(ContactPage);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        index: true,
        element: <DelayedHomePage />,
      },
      {
        path: "/products",
        element: <DelayedProductPage />,
      },
      {
        path: "/services",
        element: <DelayedServicePage />,
      },
      {
        path: "/about",
        element: <DelayedAboutPage />,
      },
      {
        path: "/contact",
        element: <DelayedContactPage />,
      },
    ],
  },
]);

export default router;
