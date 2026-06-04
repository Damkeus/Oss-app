import { ICalendarData, IEvent } from "../types";

export interface IParseResult {
  data: ICalendarData[];
  error: string | null;
}

/**
 * Parse et valide la chaîne JSON des calendriers fournie par Power Apps.
 * Ne fait jamais confiance à l'entrée : tout est validé / nettoyé.
 */
export function parseCalendars(raw: string | null | undefined): IParseResult {
  if (raw == null || raw.trim() === "") {
    return { data: [], error: null }; // entrée vide -> état neutre (pas une erreur bloquante)
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { data: [], error: "JSON invalide : impossible de parser la chaîne reçue." };
  }

  if (!Array.isArray(parsed)) {
    return { data: [], error: "Le JSON doit être un tableau de calendriers." };
  }

  const data: ICalendarData[] = [];
  for (const item of parsed) {
    const cal = sanitizeCalendar(item);
    if (cal) data.push(cal);
  }

  return { data, error: null };
}

function sanitizeCalendar(item: unknown): ICalendarData | null {
  if (item == null || typeof item !== "object") return null;
  const obj = item as Record<string, unknown>;

  const proprietaire = typeof obj.Proprietaire === "string" ? obj.Proprietaire.trim() : "";
  if (proprietaire === "") return null; // sans propriétaire, on ne peut pas faire la jointure

  const rawEvents = Array.isArray(obj.Evenements) ? obj.Evenements : [];
  const events: IEvent[] = [];
  for (const ev of rawEvents) {
    const safe = sanitizeEvent(ev);
    if (safe) events.push(safe);
  }

  return {
    CalendrierRecupere: typeof obj.CalendrierRecupere === "number" ? obj.CalendrierRecupere : 0,
    NomCalendrier: typeof obj.NomCalendrier === "string" ? obj.NomCalendrier : "",
    Proprietaire: proprietaire,
    Evenements: events,
  };
}

function sanitizeEvent(ev: unknown): IEvent | null {
  if (ev == null || typeof ev !== "object") return null;
  const obj = ev as Record<string, unknown>;

  const debut = typeof obj.Debut === "string" ? obj.Debut : "";
  const fin = typeof obj.Fin === "string" ? obj.Fin : "";
  if (!isValidDate(debut) || !isValidDate(fin)) return null;

  return {
    Debut: debut,
    Fin: fin,
    EstAbsent: obj.EstAbsent === true,
    Lieu: typeof obj.Lieu === "string" ? obj.Lieu : "",
    Statut: typeof obj.Statut === "string" ? obj.Statut : "",
    Sujet: typeof obj.Sujet === "string" ? obj.Sujet : "",
  };
}

function isValidDate(s: string): boolean {
  if (!s) return false;
  const t = Date.parse(s);
  return !Number.isNaN(t);
}
