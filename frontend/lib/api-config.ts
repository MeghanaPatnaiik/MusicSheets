/**
 * api-config.ts — Shared configuration and cookie utilities for the Next.js BFF proxy.
 */

export const BACKEND_URL = (
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://musicsheets-backend.onrender.com"
).replace(/\/$/, "");

export interface ParsedAccessToken {
  token: string;
  maxAge?: number;
}

/**
 * Extracts the access_token and optional Max-Age from backend Set-Cookie headers.
 */
export function extractAccessToken(headers: Headers): ParsedAccessToken | null {
  // getSetCookie() is standard in modern Fetch / Node 18+ environments
  const getSetCookieFn = (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie;
  const rawHeaders: string[] = typeof getSetCookieFn === "function"
    ? getSetCookieFn.call(headers)
    : [headers.get("set-cookie")].filter((h): h is string => Boolean(h));

  for (const header of rawHeaders) {
    const parts = header.split(";").map((p) => p.trim());
    if (parts.length === 0) continue;
    const [firstPart, ...attrs] = parts;
    const eqIdx = firstPart.indexOf("=");
    if (eqIdx === -1) continue;

    const name = firstPart.slice(0, eqIdx).trim();
    const val = firstPart.slice(eqIdx + 1).trim();

    if (name === "access_token" && val) {
      let maxAge: number | undefined;
      for (const attr of attrs) {
        const [attrName, attrVal] = attr.split("=").map((a) => a.trim());
        if (attrName?.toLowerCase() === "max-age" && attrVal) {
          const parsed = parseInt(attrVal, 10);
          if (!isNaN(parsed)) {
            maxAge = parsed;
          }
        }
      }
      return { token: val, maxAge };
    }
  }
  return null;
}
