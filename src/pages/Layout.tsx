import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import PageTransition from "../components/PageTransition";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        {" "}
        {/* Add padding-top to account for fixed navbar */}
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}

export default Layout;
