import helmet from "helmet";

export const productionHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "wss://chat.stream-io-api.com",
        "wss://video.stream-io-api.com",
        "wss://*.stream-io-video.com", // ✅ Added wildcard for SFU
        "https://chat.stream-io-api.com",
        "https://video.stream-io-api.com",
        "https://hint.stream-io-video.com",
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https://avatar.iran.liara.run",
        "https://flagcdn.com",
        "https://getstream.imgix.net",
        "https://dublin.stream-io-cdn.com",
      ],
    },
  },
});
