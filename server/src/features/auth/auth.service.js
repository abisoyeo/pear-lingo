import { upsertStreamUser } from "../../shared/config/stream.config.js";
import ApiError from "../../shared/utils/apiError.util.js";
import { ErrorFormatter } from "../../shared/utils/errorFormatter.js";
import User from "../users/user.model.js";

export async function createUser(userData) {
  const { fullName, email, password } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const detail = ErrorFormatter.createFieldError(
      "email",
      "Duplicate email",
      email
    );

    throw new ApiError("Email already exists, please use a diffrent one", 409, [
      detail,
    ]);
  }

  const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
  const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

  const newUser = await User.create({
    email,
    fullName,
    password,
    profilePic: randomAvatar,
  });

  return newUser;
}

export async function loginUser(userData) {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError("Invalid email or password", 401);
  }

  const isValidPassword = await user.isValidPassword(password);

  if (!isValidPassword) {
    throw new ApiError("Invalid email or password", 401);
  }

  return user;
}

export async function onBoardUser(userData) {
  const { userId, nativeLanguage, learningLanguage } = userData;

  // Validate learning language isn't same as native language
  if (nativeLanguage === learningLanguage) {
    const detail = ErrorFormatter.createFieldError(
      "learningLanguage",
      "Learning language cannot be the same as native language",
      learningLanguage
    );
    throw new ApiError("Validation failed", 400, [detail]);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...userData,
      isOnboarded: true,
    },
    { new: true }
  );

  if (!updatedUser) throw new ApiError("User not found", 404);

  return updatedUser;
}

export async function addStreamUser(userData) {
  await upsertStreamUser({
    id: userData.id.toString(),
    name: userData.fullName,
    image: userData.profilePic || "",
  });
}
