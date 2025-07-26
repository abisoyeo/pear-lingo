import * as Sentry from "@sentry/node";

export const initSentry = (app) => {
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // Adjust based on your needs
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        ...(app ? [new Sentry.Integrations.Express({ app })] : []),
      ],
    });
  }
};
