import { ICalendarData, IEmployee, IEmployeeSchedule, IJoinResult } from "../types";
import { IMonthWindow } from "./dates";
import { eventsToRanges } from "./absence";
import { initials, nameKey, primarySite } from "./normalize";

/**
 * Jointure calendriers <-> employés OSS.
 * - Clé = nom complet normalisé `${Firstname} ${Lastname}` (le TRIGRAM n'est pas fiable/unique).
 * - Tous les employés sont retournés (matched ou non) pour que le Gantt liste l'effectif complet.
 * - Les propriétaires de calendrier sans employé correspondant sont signalés.
 */
export function joinCalendarsToEmployees(
  employees: IEmployee[],
  calendars: ICalendarData[],
  win: IMonthWindow
): IJoinResult {
  // index calendrier par clé de nom
  const calByName = new Map<string, ICalendarData>();
  for (const cal of calendars) {
    calByName.set(nameKey(cal.Proprietaire), cal);
  }

  const usedKeys = new Set<string>();
  const schedules: IEmployeeSchedule[] = employees.map((emp) => {
    const key = nameKey(`${emp.Firstname} ${emp.Lastname}`);
    const cal = calByName.get(key);
    if (cal) usedKeys.add(key);

    return {
      employee: emp,
      initials: initials(emp.Firstname, emp.Lastname),
      primarySite: primarySite(emp.Location),
      matched: Boolean(cal),
      ranges: cal ? eventsToRanges(cal.Evenements, win) : [],
    };
  });

  const unmatchedOwners: string[] = [];
  for (const cal of calendars) {
    if (!usedKeys.has(nameKey(cal.Proprietaire))) {
      unmatchedOwners.push(cal.Proprietaire);
    }
  }

  return { schedules, unmatchedOwners };
}
