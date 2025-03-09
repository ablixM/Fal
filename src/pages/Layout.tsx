import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import PageTransition from "../components/PageTransition";

function Layout() {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Navbar />
        <main className="flex-grow pt-16">
          {" "}
          {/* Add padding-top to account for fixed navbar */}
          <Outlet />
        </main>
      </div>
    </PageTransition>
  );
}

export default Layout;
