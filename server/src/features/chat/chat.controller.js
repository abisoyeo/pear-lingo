import { generateStreamToken } from "../../shared/config/stream.config.js";
import ApiError from "../../shared/utils/apiError.util.js";
import sendResponse from "../../shared/utils/sendResponse.util.js";
import { sendUnreadMessageEmail } from "../../shared/mailtrap/emails.js";
import logger from "../../shared/utils/logger.js";

export async function handleStreamWebhook(req, res, next) {
  try {
    const event = req.body;
    if (event.type !== "user.unread_message_reminder") {
      return sendResponse(res, 200, "Event ignored");
    }

    const { email, name: userName } = event.user;

    const channel = Object.values(event.channels)[0];

    const unreadCount = channel?.messages?.length || 0;

    const senderName =
      channel?.messages
        .map((msg) => msg.user?.name)
        .find((name) => name !== userName) || "";

    if (!email) {
      logger.info("User email not found in Stream webhook payload");
    }

    await sendUnreadMessageEmail(email, userName, unreadCount, senderName);

    sendResponse(res, 200, "Unread message email sent");
  } catch (error) {
    next(error);
  }
}

export async function getStreamToken(req, res, next) {
  try {
    const token = generateStreamToken(req.user.id);

    sendResponse(res, 200, "", { token: token });
  } catch (error) {
    next(error);
  }
}

// const event = req.body;
// const { message, user: sender, type, members } = req.body;

// if (event.type === "message.new") {
//   members
//     .filter((member) => member.user_id !== sender.id)
//     .forEach(({ user }) => {
//       if (!user.online) {
//         const { email, name: userName } = user;
//         const unreadCount = user.unread_count;
//         const senderName = message.user.name;
//         const message = `You have a new message from ${message.user.name} - ${message.text}`;
//         await sendUnreadMessageEmail(email, userName, unreadCount, senderName);
//         console.log(email, userName, unreadCount, senderName);
//       }
//     });
// }
