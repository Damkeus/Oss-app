/** Normalisation de chaînes pour des comparaisons robustes (noms, sites). */

/** minuscule, sans accents, espaces compactés. */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire les diacritiques
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Clé de jointure d'un nom complet "Prénom NOM" -> normalisé. */
export function nameKey(full: string): string {
  return normalize(full);
}

/** Initiales à partir d'un prénom + nom (ex: "MD"). */
export function initials(firstname: string, lastname: string): string {
  const a = firstname.trim().charAt(0);
  const b = lastname.trim().charAt(0);
  return (a + b).toUpperCase() || "?";
}

/**
 * `Location` peut contenir plusieurs sites séparés par "/".
 * Retourne le site principal (premier segment non vide, nettoyé).
 */
export function primarySite(location: string): string {
  const first = location.split("/")[0]?.trim() ?? "";
  return first || location.trim();
}
