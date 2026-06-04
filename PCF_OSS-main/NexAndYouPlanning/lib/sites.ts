import { IEmployeeSchedule, ISiteParsed, RegionCode } from "../types";
import { countryToRegion, resolveCoords } from "../data/siteCoords";
import { nameKey, normalize } from "./normalize";
import { isAbsentOnDay } from "./absence";

/** Un site géolocalisé regroupant des collaborateurs OSS. */
export interface ISiteView {
  key: string; // ville normalisée
  name: string; // ville d'affichage
  country: string;
  region: RegionCode;
  lat: number;
  lng: number;
  schedules: IEmployeeSchedule[];
}

/** Employés non géolocalisables. */
export interface IBuildSitesResult {
  sites: ISiteView[];
  ungeolocated: IEmployeeSchedule[];
}

/**
 * Construit les sites géolocalisés.
 *
 * Stratégie :
 *   1. DB Site fournie (siteDb non vide) → autorité : chaque site liste explicitement
 *      ses OSS par nom complet. Les schedules sont rattachés par jointure sur nom normalisé.
 *   2. Pas de DB Site → fallback sur la table siteCoords (résolution via Location).
 */
export function buildSites(
  schedules: IEmployeeSchedule[],
  siteDb: ISiteParsed[] = []
): IBuildSitesResult {
  return siteDb.length > 0
    ? buildFromSiteDb(schedules, siteDb)
    : buildFromCoords(schedules);
}

function buildFromSiteDb(
  schedules: IEmployeeSchedule[],
  siteDb: ISiteParsed[]
): IBuildSitesResult {
  // index schedules par nom normalisé pour jointure O(1)
  const scheduleByName = new Map<string, IEmployeeSchedule>();
  for (const sch of schedules) {
    const k = nameKey(`${sch.employee.Firstname} ${sch.employee.Lastname}`);
    scheduleByName.set(k, sch);
  }

  const claimed = new Set<string>();
  const byKey = new Map<string, ISiteView>();

  for (const site of siteDb) {
    const key = normalize(site.city);
    let view = byKey.get(key);
    if (!view) {
      view = {
        key,
        name: capitalize(site.city),
        country: site.country,
        region: countryToRegion(site.country),
        lat: site.lat,
        lng: site.lng,
        schedules: [],
      };
      byKey.set(key, view);
    }
    for (const ossName of site.ossNames) {
      const sch = scheduleByName.get(ossName);
      if (sch) {
        view.schedules.push(sch);
        claimed.add(ossName);
      }
    }
  }

  // schedules non rattachés à un site de la DB
  const ungeolocated: IEmployeeSchedule[] = [];
  for (const sch of schedules) {
    const k = nameKey(`${sch.employee.Firstname} ${sch.employee.Lastname}`);
    if (!claimed.has(k)) ungeolocated.push(sch);
  }

  const sites = Array.from(byKey.values())
    .filter((s) => s.schedules.length > 0)
    .sort((a, b) => b.schedules.length - a.schedules.length);

  return { sites, ungeolocated };
}

function buildFromCoords(schedules: IEmployeeSchedule[]): IBuildSitesResult {
  const byKey = new Map<string, ISiteView>();
  const ungeolocated: IEmployeeSchedule[] = [];

  for (const sch of schedules) {
    const coords = resolveCoords(sch.employee.Location);
    if (!coords) {
      ungeolocated.push(sch);
      continue;
    }
    const key = coords.display.toLowerCase();
    let site = byKey.get(key);
    if (!site) {
      site = {
        key,
        name: coords.display,
        country: sch.employee.Country,
        region: countryToRegion(sch.employee.Country),
        lat: coords.lat,
        lng: coords.lng,
        schedules: [],
      };
      byKey.set(key, site);
    }
    site.schedules.push(sch);
  }

  const sites = Array.from(byKey.values()).sort((a, b) => b.schedules.length - a.schedules.length);
  return { sites, ungeolocated };
}

function capitalize(s: string): string {
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Compteurs de présence d'un site pour un jour donné. */
export interface ISitePresence {
  total: number;
  absent: number;
  present: number;
  rate: number; // 0-100
}

export function sitePresence(site: ISiteView, day: number): ISitePresence {
  const total = site.schedules.length;
  const absent = site.schedules.filter((s) => isAbsentOnDay(s.ranges, day)).length;
  const present = total - absent;
  const rate = total > 0 ? Math.round((present / total) * 100) : 100;
  return { total, absent, present, rate };
}
