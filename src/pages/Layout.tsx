import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import PageTransition from "../components/PageTransition";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <PageTransition>
        <main className="flex-grow pt-16">
          <Outlet />
        </main>
      </PageTransition>
    </div>
  );
}

export default Layout;
