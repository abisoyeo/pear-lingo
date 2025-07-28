import sendResponse from "../../shared/utils/sendResponse.util.js";
import {
  addStreamUser,
  createUser,
  loginUser,
  onBoardUser,
} from "./auth.service.js";

export async function signup(req, res, next) {
  try {
    const { email, password, fullName } = req.body;

    const userData = {
      email,
      password,
      fullName,
    };

    const newUser = await createUser(userData);

    await addStreamUser(newUser);

    const token = newUser.generateAuthToken();

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    sendResponse(res, 201, "User registered successfully", {
      id: newUser.id,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const userData = {
      ...req.body,
    };

    const user = await loginUser(userData);

    const token = user.generateAuthToken();

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    sendResponse(res, 200, "User signed in successfully", {
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  sendResponse(res, 200, "Logout Successful");
}

export async function onboard(req, res, next) {
  try {
    const userData = { userId: req.user.id, ...req.body };

    const updatedUser = await onBoardUser(userData);

    await addStreamUser(updatedUser);

    sendResponse(res, 200, "Onboard successful", updatedUser);
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res, next) {
  sendResponse(res, 200, "Profile fetch successful", req.user);
}
