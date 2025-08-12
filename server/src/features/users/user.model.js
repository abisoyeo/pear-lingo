import mongoose from "mongoose";
import userAuthPlugin from "./userAuth.plugin.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    providerId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // Only require password for local auth users
        return this.provider === "local";
      },
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user",
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    profilePic: {
      type: String,
      default: "https://avatar.iran.liara.run/public/1.png",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    // Suspension fields
    isSuspended: { type: Boolean, default: false },
    suspendedAt: { type: Date },
    suspensionReason: { type: String },

    // Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  { timestamps: true }
);

userSchema.plugin(userAuthPlugin);

const User = mongoose.model("User", userSchema);
export default User;
