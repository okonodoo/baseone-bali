export const ENV = {
  appId: process.env.VITE_APP_ID ?? process.env.APP_ID ?? "baseone-bali",
  cookieSecret: process.env.JWT_SECRET ?? process.env.SESSION_SECRET ?? "",
  /** Cookie domain for session (e.g. .baseoneglobal.com). Leave empty for same-origin. */
  cookieDomain: process.env.COOKIE_DOMAIN ?? "",
  /** Canonical site URL for redirects (e.g. https://baseoneglobal.com). */
  siteUrl: process.env.SITE_URL ?? process.env.BASE_URL ?? process.env.APP_URL ?? "",
  databaseUrl: process.env.DATABASE_URL ?? process.env.MYSQL_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY ?? process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? "",
};
