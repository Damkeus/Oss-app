/**
 * Modèle de données du PCF Nex&You.
 * Les interfaces calendrier reflètent EXACTEMENT le JSON fourni par Power Apps.
 */

/** Un évènement d'un calendrier (schéma exact du JSON entrant). */
export interface IEvent {
  Debut: string; // ISO 8601, ex: "2026-05-27T12:00:00.000Z"
  Fin: string; // ISO 8601
  EstAbsent: boolean;
  Lieu: string;
  Statut: string; // "tentative" | "oof" | "busy" | ...
  Sujet: string;
}

/** Un calendrier appartenant à un propriétaire (schéma exact du JSON entrant). */
export interface ICalendarData {
  CalendrierRecupere: number;
  NomCalendrier: string;
  Proprietaire: string; // "Prénom NOM"
  Evenements: IEvent[];
}

/** Un collaborateur OSS (issu de la liste Excel — voir data/mockEmployees.ts). */
export interface IEmployee {
  Zone: string; // "Zone Corp" | "Zone Euro" | "Zone MERA"
  Country: string;
  Location: string; // peut contenir plusieurs sites séparés par "/"
  Firstname: string;
  Lastname: string;
  TRIGRAM: string; // non garanti unique
}

/** Un site géolocalisé (dérivé des employés + coordonnées). */
export interface ISite {
  name: string; // ville principale
  country: string;
  region: RegionCode;
  lat: number;
  lng: number;
  employees: IEmployee[];
}

export type RegionCode = "EU_APAC" | "MERA_MEA" | "NAM" | "SAM" | "OTHER";

/** Vue active de l'application. */
export type ViewName = "login" | "map" | "gantt";

/** Statut de présence d'un employé sur un jour donné (modèle simplifié). */
export type DayStatus = "present" | "absent";

/** Une plage d'absence d'un employé (jours du mois affiché). */
export interface IAbsenceRange {
  startDay: number; // 1-31 (jour du mois affiché)
  endDay: number; // 1-31 inclusif
  label: string; // "Absent" | "OOF"
  subject: string; // sujet d'origine (info-bulle)
}

/** Un employé enrichi pour le Gantt : ses absences sur le mois affiché. */
export interface IEmployeeSchedule {
  employee: IEmployee;
  initials: string;
  primarySite: string;
  matched: boolean; // un calendrier a-t-il été relié à cet employé ?
  ranges: IAbsenceRange[];
}

/** Résultat de la jointure calendriers <-> employés. */
export interface IJoinResult {
  schedules: IEmployeeSchedule[];
  /** Propriétaires de calendrier non reliés à un employé connu. */
  unmatchedOwners: string[];
}

/**
 * Un site de la DB Site (schéma exact du JSON entrant depuis Power Apps).
 * lat/long sont des chaînes (à parser en float).
 */
export interface ISiteDb {
  Zone: string;
  Country: string;
  city: string;
  lat: string;
  long: string; // longitude
  OSS: string[]; // noms complets des collaborateurs rattachés ("Prénom NOM")
}

/** Version parsée de ISiteDb (coordonnées en nombre). */
export interface ISiteParsed {
  zone: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  ossNames: string[]; // noms normalisés pour jointure
  ossNamesRaw: string[]; // noms d'origine pour affichage
}
