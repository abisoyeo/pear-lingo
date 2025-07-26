import { generateStreamToken } from "../../shared/config/stream.config.js";
import sendResponse from "../../shared/utils/sendResponse.util.js";

export async function getStreamToken(req, res, next) {
  try {
    const token = generateStreamToken(req.user.id);

    sendResponse(res, 200, "", { token: token });
  } catch (error) {
    next(error);
  }
}
