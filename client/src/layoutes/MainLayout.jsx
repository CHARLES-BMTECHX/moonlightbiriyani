import NavbarSection from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      {/* Fixed Navbar */}
      <NavbarSection />

      {/* Main content (offset for navbar height) */}
      <main className="pt-20 min-h-[calc(100vh-80px)]">
        <Outlet />
      </main>

      {/* Common Footer */}
      <Footer />
    </>
  );
};

export default MainLayout;
