import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import ApiError from "../../shared/utils/apiError.util.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new ApiError("Unauthorized - No token provided", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError("Unauthorized - User not found", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(`Unauthorized - ${error.message}`, 401));
    }
  }
};
