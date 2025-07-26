import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />
          {/* {children ?? <Outlet />} */}
          {/* Falls back to Outlet if children aren't provided use for nested routes in refactored APp.jsx*/}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;
