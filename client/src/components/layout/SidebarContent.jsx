import { Link, useLocation } from "react-router";
import { BellIcon, HomeIcon, UsersIcon, UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SidebarContent = () => {
  const { authUser } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col h-full bg-base-200 border-base-300">
      <nav className="flex-1 p-4 space-y-2 mt-[35px]">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>
            {authUser?.role === "admin" || authUser?.role === "super_admin"
              ? "Admin Friends"
              : "Friends"}
          </span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>
            {authUser?.role === "admin" || authUser?.role === "super_admin"
              ? "Admin Alerts"
              : "Notifications"}
          </span>
        </Link>

        <Link
          to="/profile"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/profile" ? "btn-active" : ""
          }`}
        >
          <UserIcon className="size-5 text-base-content opacity-70" />
          <span>Profile</span>
        </Link>

        {(authUser?.role === "admin" || authUser?.role === "super_admin") && (
          <>
            <Link
              to="/admin"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/admin" ? "btn-active" : ""
              }`}
            >
              <UsersIcon className="size-5 text-base-content opacity-70" />
              <span>
                {authUser?.role === "super_admin" ? "Super Admin" : "Admin"}
              </span>
            </Link>

            <Link
              to="/admin/users"
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === "/admin/users" ? "btn-active" : ""
              }`}
            >
              <UsersIcon className="size-5 text-base-content opacity-70" />
              <span>Users</span>
            </Link>

            {authUser?.role === "super_admin" && (
              <Link
                to="/admin/create-admin"
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/admin/create-admin" ? "btn-active" : ""
                }`}
              >
                <UsersIcon className="size-5 text-base-content opacity-70" />
                <span>Create Admin</span>
              </Link>
            )}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-base-300 mt-auto">
        <Link
          to="/profile"
          className="flex items-center gap-3 hover:bg-base-300 p-2 rounded-lg transition-colors"
        >
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SidebarContent;
