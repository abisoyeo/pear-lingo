import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileDrawer from "./MobileDrawer";
import { Outlet } from "react-router";

const Layout = ({ children, showSidebar = false }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Drawer overlay for mobile */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex">
        {/* Sidebar - sticky only on desktop */}
        {showSidebar && <Sidebar />}

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Sticky Navbar */}
          <Navbar onOpenDrawer={() => setDrawerOpen(true)} />

          {/* Scrollable main content */}
          <main className="flex-1 overflow-y-auto">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
