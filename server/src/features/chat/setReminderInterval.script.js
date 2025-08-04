import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const client = StreamChat.getInstance(apiKey, apiSecret);

async function enableReminders() {
  await client.updateChannelType("messaging", {
    reminders_interval: 3600, // 1 hour
  });
  console.log("Reminders enabled and interval set to 1 hour");
}

enableReminders().catch(console.error);
