import { nextCsrf } from "@opera7133/next-csrf";

const { csrf, setup } = nextCsrf({
  secret: process.env.MIAUTH_KEY,
});

export { csrf, setup };