import NavbarSection from "../components/Navbar";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <NavbarSection />

      {/* Offset content for fixed navbar (h-20 = 80px) */}
      <main className="pt-20">
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
