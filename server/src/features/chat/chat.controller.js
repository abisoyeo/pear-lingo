import { generateStreamToken } from "../../shared/config/stream.config.js";
import ApiError from "../../shared/utils/apiError.util.js";
import sendResponse from "../../shared/utils/sendResponse.util.js";
import { sendUnreadMessageEmail } from "../../shared/mailtrap/emails.js";

/**
 * Handle Stream Chat webhook events
 * 
 * This happens because Stream requires a publicly accessible HTTPS URL for webhooks.
They cannot send events to localhost or private IPs (like 192.168.x.x).
Fix:
If you’re testing locally, use a tunneling service to expose your local server to the internet:

npx ngrok http 3000
This will give you something like:
https://abc123.ngrok-free.app
Then in the Stream dashboard, set the webhook URL to:

https://abc123.ngrok-free.app/api/chat/webhook
Leave ngrok running so the webhook can reach your local dev environment.
 */
export async function handleStreamWebhook(req, res, next) {
  try {
    const event = req.body;

    // Only act on unread message reminder events
    if (event.type !== "user.unread_message_reminder") {
      return sendResponse(res, 200, "Event ignored");
    }

    const { email, name: userName } = event.user;
    const unreadCount = event.user.unread_count;
    const senderNames = event.channels
      ? Object.values(event.channels)
          .flatMap((channel) => channel.messages.map((msg) => msg.user?.name))
          .filter(Boolean)
          .join(", ")
      : "";

    if (!email) {
      throw new ApiError("User email not found in Stream webhook payload", 400);
    }

    // await sendUnreadMessageEmail(email, userName, unreadCount, senderNames);

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
