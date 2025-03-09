import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ServicePage from "./pages/ServicePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/products"
            element={
              <PageTransition>
                <ProductPage />
              </PageTransition>
            }
          />
          <Route
            path="/services"
            element={
              <PageTransition>
                <ServicePage />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <AboutPage />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <ContactPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
