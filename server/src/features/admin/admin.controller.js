import * as adminService from "./admin.service.js";
import ApiError from "../../shared/utils/apiError.util.js";
import sendResponse from "../../shared/utils/sendResponse.util.js";

export const createAdmin = async (req, res, next) => {
  try {
    const { email, fullName, password } = req.body;

    const admin = await adminService.createAdmin({
      email,
      fullName,
      password,
    });

    sendResponse(res, 201, "Admin created successfully", admin);
  } catch (error) {
    next(error);
  }
};

export async function getUsers(req, res, next) {
  try {
    const users = await adminService.getAllUsers();
    sendResponse(res, 200, "Users retrieved successfully", users);
  } catch (error) {
    next(error);
  }
}

export async function changeRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      throw new ApiError("Invalid role", 400);
    }
    const updatedUser = await adminService.updateUserRole(req.params.id, role);
    sendResponse(res, 200, "User role updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
}

export const suspend = async (req, res, next) => {
  try {
    const user = await adminService.suspendUser(req.params.id, req.body.reason);
    sendResponse(res, 200, "User suspended successfully", user);
  } catch (error) {
    next(error);
  }
};

export const unsuspend = async (req, res, next) => {
  try {
    const user = await adminService.unsuspendUser(req.params.id);
    sendResponse(res, 200, "User unsuspended successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await adminService.softDeleteUser(req.params.id);
    sendResponse(res, 200, "User deleted successfully", user);
  } catch (error) {
    next(error);
  }
};

export const restore = async (req, res, next) => {
  try {
    const user = await adminService.restoreUser(req.params.id);
    sendResponse(res, 200, "User restored successfully", user);
  } catch (error) {
    next(error);
  }
};
