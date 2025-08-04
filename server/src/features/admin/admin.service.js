import ApiError from "../../shared/utils/apiError.util.js";
import User from "../users/user.model.js";

export async function createAdmin(
  { email, fullName, password },
  currentUserRole
) {
  // Only super admins can create admins
  if (currentUserRole !== "super_admin") {
    throw new ApiError("Only super administrators can create new admins", 403);
  }

  return User.create({
    email,
    fullName,
    password,
    role: "admin",
    isVerified: true,
    isOnboarded: true,
  });
}

export const getAllUsers = async (currentUserRole) => {
  return User.find({ role: { $ne: "super_admin" } }).sort({ createdAt: -1 });
};

export const updateUserRole = async (id, role, currentUserRole) => {
  if (!["user", "admin", "super_admin"].includes(role)) {
    throw new ApiError("Invalid role", 400);
  }

  // Only super admins can change roles to admin or super_admin
  if (role === "admin" || role === "super_admin") {
    if (currentUserRole !== "super_admin") {
      throw new ApiError(
        "Only super administrators can assign admin roles",
        403
      );
    }
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) throw new ApiError("User not found", 404);
  return user;
};

export const suspendUser = async (id, reason, currentUserRole) => {
  // Check if user being suspended is an admin or super_admin
  const userToSuspend = await User.findById(id);
  if (!userToSuspend) throw new ApiError("User not found", 404);

  // Only super admins can suspend admins
  if (userToSuspend.role === "admin" || userToSuspend.role === "super_admin") {
    if (currentUserRole !== "super_admin") {
      throw new ApiError("Only super administrators can suspend admins", 403);
    }
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isSuspended: true, suspendedAt: new Date(), suspensionReason: reason },
    { new: true }
  );
  return user;
};

export const unsuspendUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isSuspended: false, suspendedAt: null, suspensionReason: null },
    { new: true }
  );
  if (!user) throw new ApiError("User not found", 404);
  return user;
};

export const softDeleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
  if (!user) throw new ApiError("User not found", 404);
  return user;
};

export const restoreUser = async (id) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: false, deletedAt: null },
    { new: true }
  );
  if (!user) throw new ApiError("User not found", 404);
  return user;
};
