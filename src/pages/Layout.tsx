import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ReactLenis } from "../utils/lenis";

function Layout() {
  return (
    <ReactLenis>
      <Navbar />
      <Outlet />
    </ReactLenis>
  );
}

export default Layout;
