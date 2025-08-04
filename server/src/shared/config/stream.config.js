import { StreamChat } from "stream-chat";
import ApiError from "../utils/apiError.util.js";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (user) => {
  try {
    await streamClient.upsertUsers([
      {
        id: user.id.toString(),
        name: user.fullName,
        image: user.profilePic,
        email: user.email,
      },
    ]);
    return user;
  } catch (error) {
    throw new ApiError("Failed to sync user with Stream", 502, {
      field: "stream",
      issue: error.message,
    });
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    throw new ApiError("Error generating Stream token", 502, {
      field: "stream",
      issue: error.message,
    });
  }
};
