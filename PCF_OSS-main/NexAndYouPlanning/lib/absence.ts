import { IAbsenceRange, IEvent } from "../types";
import { IMonthWindow } from "./dates";

/** Un évènement compte comme absence si EstAbsent OU Statut "oof". */
export function isAbsenceEvent(ev: IEvent): boolean {
  return ev.EstAbsent === true || ev.Statut.toLowerCase() === "oof";
}

function labelFor(ev: IEvent): string {
  return ev.Statut.toLowerCase() === "oof" ? "OOF" : "Absent";
}

/**
 * Convertit les évènements d'absence en plages de jours (1-based) DANS le mois affiché.
 * - Les types CP/RTT/etc. sont ignorés (modèle simplifié) : seul "Absent/OOF" compte.
 * - Les dates ISO sont interprétées en heure locale ; une fin à minuit (00:00) est
 *   traitée comme exclusive (convention all-day).
 */
export function eventsToRanges(events: IEvent[], win: IMonthWindow): IAbsenceRange[] {
  const ranges: IAbsenceRange[] = [];

  for (const ev of events) {
    if (!isAbsenceEvent(ev)) continue;

    const start = new Date(ev.Debut);
    const end = new Date(ev.Fin);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) continue;

    // jour de début/fin (au niveau date locale)
    const startDayDate = atMidnight(start);
    let endDayDate = atMidnight(end);
    // fin exactement à minuit et postérieure au début -> fin exclusive (all-day)
    if (end.getTime() === endDayDate.getTime() && endDayDate > startDayDate) {
      endDayDate = addDays(endDayDate, -1);
    }

    const clamped = clampToWindow(startDayDate, endDayDate, win);
    if (!clamped) continue;

    ranges.push({
      startDay: clamped.startDay,
      endDay: clamped.endDay,
      label: labelFor(ev),
      subject: ev.Sujet || labelFor(ev),
    });
  }

  return mergeRanges(ranges);
}

/** Un employé est-il absent un jour donné (1-based) du mois affiché ? */
export function isAbsentOnDay(ranges: IAbsenceRange[], day: number): boolean {
  return ranges.some((r) => day >= r.startDay && day <= r.endDay);
}

function atMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function clampToWindow(
  start: Date,
  end: Date,
  win: IMonthWindow
): { startDay: number; endDay: number } | null {
  const winStart = new Date(win.year, win.month, 1);
  const winEnd = new Date(win.year, win.month, win.daysInMonth);

  const s = start < winStart ? winStart : start;
  const e = end > winEnd ? winEnd : end;
  if (s > e) return null; // hors du mois affiché

  return { startDay: s.getDate(), endDay: e.getDate() };
}

/** Fusionne les plages qui se chevauchent / sont contiguës. */
function mergeRanges(ranges: IAbsenceRange[]): IAbsenceRange[] {
  if (ranges.length <= 1) return ranges;
  const sorted = [...ranges].sort((a, b) => a.startDay - b.startDay);
  const out: IAbsenceRange[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = out[out.length - 1];
    const cur = sorted[i];
    if (cur.startDay <= prev.endDay + 1) {
      prev.endDay = Math.max(prev.endDay, cur.endDay);
      // on garde le label "OOF" si l'une des plages est OOF, sinon "Absent"
      if (cur.label === "OOF") prev.label = "OOF";
    } else {
      out.push(cur);
    }
  }
  return out;
}
