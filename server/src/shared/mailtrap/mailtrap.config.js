import { MailtrapClient } from "mailtrap";

export const mailtrapClient = new MailtrapClient({
  // endpoint: process.env.MAILTRAP_ENDPOINT,
  token: process.env.MAILTRAP_TOKEN,
});

// export const sender = {
//   email: "hello@pearlingo.com",
//   name: "Pear Lingo",
// };
export const sender = {
  email: "pearlingo@edupeerhub.com",
  name: "Pear Lingo",
};
