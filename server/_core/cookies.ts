import type { CookieOptions, Request } from "express";
import { ENV } from "./env";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const PRODUCTION_DOMAIN = "baseoneglobal.com";

function isIpAddress(host: string) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

/** Must be true for SameSite=none cookies. Requires app.set("trust proxy", 1) behind HTTPS proxy. */
function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");
  return protoList.some(proto => proto.trim().toLowerCase() === "https");
}

/**
 * Session cookie options for baseoneglobal.com (and localhost).
 * - Use COOKIE_DOMAIN env if set (e.g. .baseoneglobal.com).
 * - Otherwise in production on baseoneglobal.com / www.baseoneglobal.com set domain so cookie is shared.
 * - secure + sameSite: "none" required for cross-origin; trust proxy must be enabled.
 */
export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  let domain: string | undefined = undefined;

  if (ENV.cookieDomain) {
    domain = ENV.cookieDomain;
  } else {
    const hostname = (req.hostname || "").toLowerCase();
    const isLocal =
      !hostname || LOCAL_HOSTS.has(hostname) || isIpAddress(hostname);
    if (!isLocal && (hostname === PRODUCTION_DOMAIN || hostname === `www.${PRODUCTION_DOMAIN}`)) {
      domain = `.${PRODUCTION_DOMAIN}`;
    }
  }

  const secure = isSecureRequest(req);
  if (!secure && ENV.isProduction) {
    console.warn(
      "[Cookies] Production request not seen as HTTPS; set trust proxy and X-Forwarded-Proto so session cookie is secure."
    );
  }

  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure,
    ...(domain ? { domain } : {}),
  };
}
