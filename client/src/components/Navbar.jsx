// import { MenuIcon, LogOutIcon, BellIcon, AppleIcon } from "lucide-react";
// import { Link, useLocation } from "react-router"; // ✅ you're using `react-router`
// import useAuthUser from "../hooks/useAuthUser";
// import useLogout from "../hooks/useLogout";
// import ThemeSelector from "./ThemeSelector";

// const Navbar = ({ onOpenDrawer }) => {
//   const { authUser } = useAuthUser();
//   const location = useLocation();
//   const isChatPage = location.pathname?.startsWith("/chat");
//   const { logoutMutation } = useLogout();

//   return (
//     <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
//       {/* <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between"> */}
//       <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
//         {/* Hamburger only on mobile */}
//         <button
//           onClick={onOpenDrawer}
//           className="lg:hidden btn btn-ghost btn-circle"
//         >
//           <MenuIcon className="h-6 w-6 text-base-content opacity-70" />
//         </button>

//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2.5">
//           <AppleIcon className="size-7 text-primary" />
//           <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
//             PearStream
//           </span>
//         </Link>

//         {/* Right-side buttons */}
//         <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto shrink-0">
//           <Link to="/notifications">
//             <button className="btn btn-ghost btn-circle">
//               <BellIcon className="h-6 w-6 text-base-content opacity-70" />
//             </button>
//           </Link>

//           <ThemeSelector />

//           <div className="avatar">
//             <div className="w-9 rounded-full">
//               <img src={authUser?.profilePic} alt="User Avatar" />
//             </div>
//           </div>

//           <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
//             <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { MenuIcon, LogOutIcon, BellIcon, AppleIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";

const Navbar = ({ onOpenDrawer }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
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
            PearStream
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

          <div className="avatar">
            <div className="w-8 sm:w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>

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
