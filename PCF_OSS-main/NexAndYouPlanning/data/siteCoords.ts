import { RegionCode } from "../types";
import { normalize } from "../lib/normalize";

/**
 * Coordonnées des villes (lat/lng) pour la projection des pins sur la carte OSM.
 * Clés = nom de ville normalisé (sans accents, minuscule).
 * TEMPORAIRE : à remplacer par la future DB Site (qui fournira lat/long + nb OSS).
 */
interface ICityCoord {
  lat: number;
  lng: number;
  /** nom d'affichage propre */
  display: string;
}

const CITY_COORDS: Record<string, ICityCoord> = {
  // France
  puteaux: { lat: 48.8846, lng: 2.2386, display: "Puteaux" },
  courbevoie: { lat: 48.8973, lng: 2.2566, display: "Courbevoie" },
  nanterre: { lat: 48.8924, lng: 2.2069, display: "Nanterre" },
  lens: { lat: 50.4319, lng: 2.8322, display: "Lens" },
  donchery: { lat: 49.6968, lng: 4.8617, display: "Donchery" },
  lyon: { lat: 45.764, lng: 4.8357, display: "Lyon" },
  "la verp": { lat: 45.6336, lng: 5.1376, display: "La Verpillière" },
  autun: { lat: 46.9512, lng: 4.299, display: "Autun" },
  bourg: { lat: 46.2057, lng: 5.2257, display: "Bourg-en-Bresse" },
  calais: { lat: 50.9481, lng: 1.8564, display: "Calais" },
  // Belgique / NL
  charleroi: { lat: 50.4114, lng: 4.4446, display: "Charleroi" },
  erembodegem: { lat: 50.9242, lng: 4.0489, display: "Erembodegem" },
  buizingen: { lat: 50.744, lng: 4.255, display: "Buizingen" },
  ukkle: { lat: 50.8016, lng: 4.3376, display: "Uccle" },
  schiedam: { lat: 51.9191, lng: 4.3886, display: "Schiedam" },
  // Allemagne
  hannover: { lat: 52.3759, lng: 9.732, display: "Hannover" },
  hof: { lat: 50.3133, lng: 11.9126, display: "Hof" },
  essen: { lat: 51.4556, lng: 7.0116, display: "Essen" },
  // CZ / PL
  cheb: { lat: 50.0796, lng: 12.3691, display: "Cheb" },
  raciborz: { lat: 50.0915, lng: 18.2194, display: "Racibórz" },
  // Nordics
  hyvinkaa: { lat: 60.6306, lng: 24.8615, display: "Hyvinkää" },
  keuruu: { lat: 62.2556, lng: 24.7029, display: "Keuruu" },
  riihimaki: { lat: 60.7372, lng: 24.7729, display: "Riihimäki" },
  halden: { lat: 59.129, lng: 11.3875, display: "Halden" },
  fredrikstad: { lat: 59.2181, lng: 10.9298, display: "Fredrikstad" },
  langhus: { lat: 59.7782, lng: 10.8382, display: "Langhus" },
  oslo: { lat: 59.9139, lng: 10.7522, display: "Oslo" },
  kjeller: { lat: 59.9733, lng: 11.0406, display: "Kjeller" },
  sandjeford: { lat: 59.1313, lng: 10.2166, display: "Sandefjord" },
  rognan: { lat: 67.1028, lng: 15.3914, display: "Rognan" },
  grimsas: { lat: 57.3009, lng: 13.5415, display: "Grimsås" },
  gislaved: { lat: 57.3001, lng: 13.5414, display: "Gislaved" },
  // Sud
  milano: { lat: 45.4642, lng: 9.19, display: "Milano" },
  battipaglia: { lat: 40.609, lng: 14.985, display: "Battipaglia" },
  offida: { lat: 42.9352, lng: 13.6936, display: "Offida" },
  latina: { lat: 41.4676, lng: 12.9036, display: "Latina" },
  brendola: { lat: 45.479, lng: 11.4352, display: "Brendola" },
  montecchio: { lat: 45.5024, lng: 11.4002, display: "Montecchio" },
  tolentino: { lat: 43.2091, lng: 13.2852, display: "Tolentino" },
  ltc: { lat: 45.479, lng: 11.4352, display: "LTC (Brendola)" },
  madrid: { lat: 40.4168, lng: -3.7038, display: "Madrid" },
  lamia: { lat: 38.9, lng: 22.4339, display: "Lamia" },
  rentis: { lat: 37.962, lng: 23.692, display: "Rentis" },
  cortaillod: { lat: 46.943, lng: 6.846, display: "Cortaillod" },
  // UK
  "milton keynes": { lat: 52.0406, lng: -0.7594, display: "Milton Keynes" },
  edinburg: { lat: 55.9533, lng: -3.1883, display: "Edinburgh" },
  castleford: { lat: 53.7256, lng: -1.3556, display: "Castleford" },
  // MERA (Afrique / Moyen-Orient)
  tema: { lat: 5.6698, lng: -0.0166, display: "Tema" },
  abidjan: { lat: 5.3453, lng: -4.0244, display: "Abidjan" },
  beyrouth: { lat: 33.8886, lng: 35.4955, display: "Beyrouth" },
  casablanca: { lat: 33.5731, lng: -7.5898, display: "Casablanca" },
  mohamedia: { lat: 33.6861, lng: -7.3828, display: "Mohammedia" },
  maseed: { lat: 24.9921, lng: 51.5499, display: "Mesaieed" },
  dubai: { lat: 25.2048, lng: 55.2708, display: "Dubai" },
  denizli: { lat: 37.7833, lng: 29.0947, display: "Denizli" },
};

/** Tente de résoudre les coordonnées d'une `Location` (multi-sites tolérés). */
export function resolveCoords(location: string): ICityCoord | null {
  const norm = normalize(location);
  // 1) correspondance directe sur la ville principale ou un segment
  for (const seg of norm.split("/")) {
    const key = seg.trim();
    if (CITY_COORDS[key]) return CITY_COORDS[key];
  }
  // 2) recherche par mot-clé contenu (ex: "lyon solaris" -> "lyon")
  for (const key of Object.keys(CITY_COORDS)) {
    if (norm.includes(key)) return CITY_COORDS[key];
  }
  return null;
}

/** Mapping pays -> région (tolérant aux coquilles de l'Excel). */
export function countryToRegion(country: string): RegionCode {
  const c = normalize(country);
  if (c.includes("france")) return "FR";
  if (c.includes("germany") || c.includes("allemagne")) return "DE";
  if (c.includes("belg") || c.includes("netherl") || c === "nl" || c.includes("uk") || c.includes("united kingdom"))
    return "BNL";
  if (c.includes("norway") || c.includes("normay") || c.includes("sweden") || c.includes("finland") || c.includes("denmark"))
    return "SC";
  if (c.includes("italy") || c.includes("spain") || c.includes("greece") || c.includes("suisse") || c.includes("switz") || c.includes("portugal"))
    return "SE";
  if (c === "cz" || c.includes("czech") || c.includes("poland") || c.includes("gs_eu")) return "EE";
  if (
    c.includes("ghana") || c.includes("coast") || c.includes("leb") || c.includes("morocco") ||
    c.includes("qatar") || c.includes("uea") || c.includes("uae") || c.includes("turkey")
  )
    return "MERA";
  return "OTHER";
}

export const REGION_LABELS: Record<RegionCode, string> = {
  FR: "France",
  DE: "Allemagne",
  BNL: "Benelux / UK",
  SC: "Nordics",
  SE: "Europe Sud",
  EE: "Europe Est",
  MERA: "MERA",
  OTHER: "Autre",
};

/** Drapeau emoji indicatif par région (purement décoratif). */
export const REGION_FLAGS: Record<RegionCode, string> = {
  FR: "🇫🇷", DE: "🇩🇪", BNL: "🇧🇪", SC: "🇸🇪", SE: "🇮🇹", EE: "🇵🇱", MERA: "🌍", OTHER: "🏳️",
};
