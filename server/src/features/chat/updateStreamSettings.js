import dotenv from "dotenv";
dotenv.config();
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or secret is missing");
}
const client = StreamChat.getInstance(apiKey, apiSecret);

// Function to update the channel type settings for reminders
async function enableReminders() {
  await client.updateChannelType("messaging", {
    reminders: true,
    read_events: true,
  });
}
enableReminders()
  .then(() => {
    console.log("Reminders enabled successfully");
  })
  .catch((error) => {
    console.error("Error enabling reminders: ", error);
  });

// Function to update the app settings for reminders interval
async function updateAppSettings() {
  await client.updateChannelType("messaging", {
    reminders_interval: 60, // 60 secs
  });
}
updateAppSettings()
  .then(() => {
    console.log("App settings updated successfully");
  })
  .catch((error) => {
    console.error("Error updating app settings: ", error);
  });
