/** Utilitaires de dates — fenêtre mensuelle dynamique du Gantt. */

export interface IMonthWindow {
  year: number;
  month: number; // 0-11
  daysInMonth: number;
  label: string; // "Mai 2026"
  /** Jour du mois "aujourd'hui" si on est dans ce mois, sinon -1. */
  todayDay: number;
}

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const DOW_FR = ["L", "M", "M", "J", "V", "S", "D"];

/** Fenêtre du mois courant (basée sur la date réelle). */
export function currentMonthWindow(now: Date = new Date()): IMonthWindow {
  return monthWindow(now.getFullYear(), now.getMonth(), now);
}

/** Construit une fenêtre mensuelle, décalée de `offset` mois si fourni. */
export function shiftMonth(win: IMonthWindow, offset: number, now: Date = new Date()): IMonthWindow {
  const d = new Date(win.year, win.month + offset, 1);
  return monthWindow(d.getFullYear(), d.getMonth(), now);
}

export function monthWindow(year: number, month: number, now: Date = new Date()): IMonthWindow {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrent = now.getFullYear() === year && now.getMonth() === month;
  return {
    year,
    month,
    daysInMonth,
    label: `${MONTHS_FR[month]} ${year}`,
    todayDay: isCurrent ? now.getDate() : -1,
  };
}

/** true si le jour (1-based) du mois est un week-end. */
export function isWeekend(win: IMonthWindow, day: number): boolean {
  const dow = (new Date(win.year, win.month, day).getDay() + 6) % 7; // 0 = lundi
  return dow >= 5;
}

/** Initiale jour de semaine (L/M/M/J/V/S/D). */
export function dowInitial(win: IMonthWindow, day: number): string {
  const dow = (new Date(win.year, win.month, day).getDay() + 6) % 7;
  return DOW_FR[dow];
}

export function monthLabelShort(win: IMonthWindow): string {
  return MONTHS_FR[win.month];
}

export function prevMonthLabel(win: IMonthWindow): string {
  const m = (win.month + 11) % 12;
  return MONTHS_FR[m];
}

export function nextMonthLabel(win: IMonthWindow): string {
  const m = (win.month + 1) % 12;
  return MONTHS_FR[m];
}
