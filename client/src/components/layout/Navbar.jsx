import { MenuIcon, LogOutIcon, BellIcon, AppleIcon } from "lucide-react";
import { Link } from "react-router";
import useLogout from "../../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ onOpenDrawer }) => {
  const { authUser } = useAuth();
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Hamburger only on mobile */}
        <button
          onClick={onOpenDrawer}
          className="lg:hidden btn btn-ghost btn-circle btn-sm sm:btn-md"
        >
          <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5">
          <AppleIcon className="size-6 sm:size-7 text-primary" />
          <span className="text-lg sm:text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            Pear Lingo
          </span>
        </Link>

        {/* Right-side buttons */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 ml-auto shrink-0">
          <Link to="/notifications">
            <button className="btn btn-ghost btn-circle btn-sm sm:btn-md">
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
            </button>
          </Link>

          <ThemeSelector />

          <Link to="/profile">
            <div className="avatar cursor-pointer">
              <div className="w-8 sm:w-9 rounded-full transition-all hover:ring-2 hover:ring-gray-400/50">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
          </Link>

          <button
            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            onClick={logoutMutation}
          >
            <LogOutIcon className="h-5 w-5 sm:h-6 sm:w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
