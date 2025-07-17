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
      httpOnly: true, // prevent XSS attacks,
      sameSite: "strict", // prevent CSRF attacks
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
    const { email, password } = req.body;

    const userData = {
      email,
      password,
    };

    const user = await loginUser(userData);

    const token = user.generateAuthToken();

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
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
  res.clearCookie("jwt");
  sendResponse(res, 200, "Logout Successful");
}

export async function onboard(req, res, next) {
  try {
    const userId = req.user.id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    const userData = {
      userId,
      fullName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
    };

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
