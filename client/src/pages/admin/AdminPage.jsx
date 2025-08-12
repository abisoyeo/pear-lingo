import { Link } from "react-router";

const AdminPage = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">
          Admin Dashboard
        </h1>
        <p className="text-base-content/70 mt-2">
          Manage your application and user accounts
        </p>
      </div>

      <div className="space-y-6">
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Welcome, Admin!</h2>
          <p className="text-base-content/70">
            Use the sidebar to manage users, create new admins, and view
            admin-specific features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/users"
            className="card bg-base-200 hover:bg-base-300 transition-all duration-200 p-6 cursor-pointer border border-base-300 hover:border-base-400"
          >
            <h3 className="font-semibold text-lg mb-2">Manage Users</h3>
            <p className="text-sm text-base-content/70">
              View, suspend, restore, or delete user accounts.
            </p>
          </Link>
          <Link
            to="/admin/create-admin"
            className="card bg-base-200 hover:bg-base-300 transition-all duration-200 p-6 cursor-pointer border border-base-300 hover:border-base-400"
          >
            <h3 className="font-semibold text-lg mb-2">Create Admin</h3>
            <p className="text-sm text-base-content/70">
              Grant admin privileges to a new or existing user.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
