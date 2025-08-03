import ApiError from "../../shared/utils/apiError.util.js";
import User from "../users/user.model.js";

export async function createAdmin({ email, fullName, password }) {
  return User.create({
    email,
    fullName,
    password,
    role: "admin",
    isVerified: true,
    isOnboarded: true,
  });
}

export const getAllUsers = async () => {
  return User.find({}).sort({ createdAt: -1 });
};

export const updateUserRole = async (id, role) => {
  if (!["user", "admin"].includes(role)) {
    throw new ApiError("Invalid role", 400);
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) throw new ApiError("User not found", 404);
  return user;
};

export const suspendUser = async (id, reason) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isSuspended: true, suspendedAt: new Date(), suspensionReason: reason },
    { new: true }
  );
  if (!user) throw new ApiError("User not found", 404);
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
