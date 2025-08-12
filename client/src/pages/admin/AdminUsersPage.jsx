import useAdminUsers from "../../hooks/useAdminUsers";
import {
  suspendUser,
  unsuspendUser,
  changeUserRole,
  deleteUser,
  restoreUser,
} from "../../lib/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  handleToastSuccess,
  handleToastError,
} from "../../utils/toastDisplayHandler";
import { useAuth } from "../../context/AuthContext";

const AdminUsersPage = () => {
  const { data: users, isLoading } = useAdminUsers();
  const queryClient = useQueryClient();
  const { authUser } = useAuth();

  const createMutation = (apiFn, successMsg) =>
    useMutation({
      mutationFn: apiFn,
      onSuccess: () => {
        queryClient.invalidateQueries(["adminUsers"]);
        handleToastSuccess(successMsg);
      },
      onError: handleToastError,
    });

  const suspendUserMutation = createMutation(suspendUser, "User suspended");
  const unsuspendUserMutation = createMutation(
    unsuspendUser,
    "User unsuspended"
  );
  const changeUserRoleMutation = createMutation(changeUserRole, "Role updated");
  const deleteUserMutation = createMutation(deleteUser, "User deleted");
  const restoreUserMutation = createMutation(restoreUser, "User restored");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">Manage Users</h1>
        <p className="text-base-content/70 mt-2">
          Manage user accounts, roles, and status
        </p>
      </div>

      <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="font-semibold">Email</th>
                <th className="font-semibold">Full Name</th>
                <th className="font-semibold">Role</th>
                <th className="font-semibold">Status</th>
                <th className="font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-base-200/50">
                  <td className="font-medium">{user.email}</td>
                  <td>{user.fullName || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "super_admin"
                          ? "badge-error"
                          : user.role === "admin"
                          ? "badge-primary"
                          : "badge-secondary"
                      }`}
                    >
                      {user.role === "super_admin" ? "Super Admin" : user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.isDeleted
                          ? "badge-error"
                          : user.isSuspended
                          ? "badge-warning"
                          : "badge-success"
                      }`}
                    >
                      {user.isDeleted
                        ? "Deleted"
                        : user.isSuspended
                        ? "Suspended"
                        : "Active"}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {/* Suspend/Unsuspend - Only super admins can suspend admins */}
                      {user.isSuspended ? (
                        <button
                          onClick={() => unsuspendUserMutation.mutate(user.id)}
                          disabled={unsuspendUserMutation.isPending}
                          className="btn btn-sm btn-success"
                        >
                          {unsuspendUserMutation.isPending
                            ? "Unsuspending..."
                            : "Unsuspend"}
                        </button>
                      ) : (
                        <button
                          onClick={() => suspendUserMutation.mutate(user.id)}
                          disabled={suspendUserMutation.isPending}
                          className={`btn btn-sm ${
                            (user.role === "admin" ||
                              user.role === "super_admin") &&
                            authUser?.role !== "super_admin"
                              ? "btn-disabled"
                              : "btn-warning"
                          }`}
                          title={
                            (user.role === "admin" ||
                              user.role === "super_admin") &&
                            authUser?.role !== "super_admin"
                              ? "Only super admins can suspend admins"
                              : ""
                          }
                        >
                          {suspendUserMutation.isPending
                            ? "Suspending..."
                            : "Suspend"}
                        </button>
                      )}

                      {/* Role Toggle - Only super admins can change to admin roles */}
                      <button
                        onClick={() => {
                          let newRole = "user";
                          if (user.role === "user") {
                            newRole =
                              authUser?.role === "super_admin"
                                ? "admin"
                                : "user";
                          } else if (user.role === "admin") {
                            newRole = "user";
                          } else if (user.role === "super_admin") {
                            newRole = "admin";
                          }
                          changeUserRoleMutation.mutate({
                            id: user.id,
                            role: newRole,
                          });
                        }}
                        disabled={
                          changeUserRoleMutation.isPending ||
                          (user.role === "admin" &&
                            authUser?.role !== "super_admin") ||
                          (user.role === "super_admin" &&
                            authUser?.role !== "super_admin")
                        }
                        className={`btn btn-sm ${
                          (user.role === "admin" &&
                            authUser?.role !== "super_admin") ||
                          (user.role === "super_admin" &&
                            authUser?.role !== "super_admin")
                            ? "btn-disabled"
                            : "btn-info"
                        }`}
                        title={
                          user.role === "admin" &&
                          authUser?.role !== "super_admin"
                            ? "Only super admins can change admin roles"
                            : user.role === "super_admin" &&
                              authUser?.role !== "super_admin"
                            ? "Only super admins can change super admin roles"
                            : ""
                        }
                      >
                        {changeUserRoleMutation.isPending
                          ? "Updating..."
                          : "Toggle Role"}
                      </button>

                      {/* Delete/Restore */}
                      {user.isDeleted ? (
                        <button
                          onClick={() => restoreUserMutation.mutate(user.id)}
                          disabled={restoreUserMutation.isPending}
                          className="btn btn-sm btn-success"
                        >
                          {restoreUserMutation.isPending
                            ? "Restoring..."
                            : "Restore"}
                        </button>
                      ) : (
                        <button
                          onClick={() => deleteUserMutation.mutate(user.id)}
                          disabled={
                            deleteUserMutation.isPending ||
                            ((user.role === "admin" ||
                              user.role === "super_admin") &&
                              authUser?.role !== "super_admin")
                          }
                          className={`btn btn-sm ${
                            (user.role === "admin" ||
                              user.role === "super_admin") &&
                            authUser?.role !== "super_admin"
                              ? "btn-disabled"
                              : "btn-error"
                          }`}
                          title={
                            (user.role === "admin" ||
                              user.role === "super_admin") &&
                            authUser?.role !== "super_admin"
                              ? "Only super admins can delete admins"
                              : ""
                          }
                        >
                          {deleteUserMutation.isPending
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!users || users.length === 0) && (
          <div className="text-center py-8">
            <p className="text-base-content/70">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
