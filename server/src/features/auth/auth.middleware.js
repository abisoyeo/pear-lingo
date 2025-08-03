import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import ApiError from "../../shared/utils/apiError.util.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new ApiError("Unauthorized - No token provided", 401);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new ApiError("Unauthorized - Token expired", 401);
      }
      throw new ApiError("Unauthorized - Invalid token", 401);
    }

    const user = await User.findById(decoded.id).select(
      "_id email isVerified isOnboarded role isSuspended isDeleted"
    );

    if (!user) throw new ApiError("Unauthorized - User not found", 401);
    if (user.isSuspended) throw new ApiError("Your account is suspended", 403);
    if (user.isDeleted) throw new ApiError("Account no longer exists", 403);

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(error.message, 401));
  }
};
export function requireVerifiedAndOnboardedUser(req, res, next) {
  if (!req.user.isVerified) {
    throw new ApiError("Please verify your email to access this resource", 403);
  }

  if (!req.user.isOnboarded) {
    throw new ApiError(
      "Please complete onboarding to access this resource",
      403
    );
  }

  next();
}
export function requireAdminRole(req, res, next) {
  if (req.user.role !== "admin") {
    throw new ApiError("Access denied - Admins only", 403);
  }
  next();
}
