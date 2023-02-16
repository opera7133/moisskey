import { nextCsrf } from "@opera7133/next-csrf";

const { csrf, setup } = nextCsrf({
  // eslint-disable-next-line no-undef
  secret: process.env.MIAUTH_KEY,
});

export { csrf, setup };