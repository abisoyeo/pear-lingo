import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

friendRequestSchema.methods.toJSON = function () {
  const obj = this.toObject({ virtuals: true });

  obj.id = obj._id;
  delete obj._id;
  delete obj.__v;

  return obj;
};

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;
