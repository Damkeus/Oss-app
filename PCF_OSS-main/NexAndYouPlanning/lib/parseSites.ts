import { ISiteDb, ISiteParsed } from "../types";
import { nameKey } from "./normalize";

export interface ISitesParseResult {
  data: ISiteParsed[];
  error: string | null;
}

/**
 * Parse et valide la chaîne JSON de la DB Site fournie par Power Apps.
 * Schéma attendu : tableau d'objets { Zone, Country, city, lat, long, OSS: string[] }.
 * lat/long sont des strings → converties en float.
 */
export function parseSiteDb(raw: string | null | undefined): ISitesParseResult {
  if (raw == null || raw.trim() === "") {
    return { data: [], error: null };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { data: [], error: "siteJson — JSON invalide : impossible de parser la chaîne reçue." };
  }

  if (!Array.isArray(parsed)) {
    return { data: [], error: "siteJson — doit être un tableau de sites." };
  }

  const data: ISiteParsed[] = [];
  for (const item of parsed) {
    const site = sanitizeSite(item);
    if (site) data.push(site);
  }

  return { data, error: null };
}

function sanitizeSite(item: unknown): ISiteParsed | null {
  if (item == null || typeof item !== "object") return null;
  const obj = item as Record<string, unknown>;

  const city = typeof obj.city === "string" ? obj.city.trim() : "";
  if (!city) return null;

  const lat = parseCoord(obj.lat);
  const lng = parseCoord(obj.long);
  if (lat === null || lng === null) return null;

  const ossRaw: string[] = Array.isArray(obj.OSS)
    ? (obj.OSS as unknown[]).filter((x): x is string => typeof x === "string")
    : [];

  return {
    zone: typeof obj.Zone === "string" ? obj.Zone.trim() : "",
    country: typeof obj.Country === "string" ? obj.Country.trim() : "",
    city,
    lat,
    lng,
    ossNames: ossRaw.map(nameKey),
    ossNamesRaw: ossRaw,
  };
}

function parseCoord(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
