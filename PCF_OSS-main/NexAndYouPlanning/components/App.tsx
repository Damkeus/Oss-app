import * as React from "react";
import { ViewName } from "../types";
import { parseCalendars } from "../lib/parseCalendar";
import { parseSiteDb } from "../lib/parseSites";
import { joinCalendarsToEmployees } from "../lib/join";
import { buildSites } from "../lib/sites";
import { currentMonthWindow, monthLabelShort, shiftMonth, IMonthWindow } from "../lib/dates";
import { mockEmployees } from "../data/mockEmployees";
import { MOCK_CALENDAR_JSON } from "../data/mockCalendars";
import { TopNav } from "./TopNav";
import { LoginMenu } from "./LoginMenu";
import { MapView } from "./MapView";
import { GanttView } from "./GanttView";

import "../styles/tokens.css";
import "../styles/app.css";
import "../styles/views.css";

interface Props {
  calendarJson: string | null;
  siteJson: string | null;
  defaultView?: string | null;
}

function normalizeView(v: string | null | undefined): ViewName {
  return v === "map" || v === "gantt" || v === "login" ? v : "login";
}

export const App: React.FC<Props> = ({ calendarJson, siteJson, defaultView }) => {
  const [view, setView] = React.useState<ViewName>(normalizeView(defaultView));
  const [monthWin, setMonthWin] = React.useState<IMonthWindow>(() => currentMonthWindow());
  const [selectedSiteKey, setSelectedSiteKey] = React.useState<string | null>(null);
  const [ganttSiteKey, setGanttSiteKey] = React.useState<string | null>(null);

  const parsed = React.useMemo(
    () => parseCalendars(calendarJson ?? MOCK_CALENDAR_JSON),
    [calendarJson]
  );
  const parsedSites = React.useMemo(() => parseSiteDb(siteJson), [siteJson]);

  const join = React.useMemo(
    () => joinCalendarsToEmployees(mockEmployees, parsed.data, monthWin),
    [parsed.data, monthWin]
  );

  const { sites, ungeolocated } = React.useMemo(
    () => buildSites(join.schedules, parsedSites.data),
    [join.schedules, parsedSites.data]
  );

  const countriesCount = React.useMemo(
    () => new Set(mockEmployees.map((e) => e.Country)).size,
    []
  );

  const today = monthWin.todayDay >= 1 ? monthWin.todayDay : 1;
  const todayLabel = `${today} ${monthLabelShort(monthWin).toLowerCase()}`;

  const ganttSite = ganttSiteKey ? sites.find((s) => s.key === ganttSiteKey) ?? null : null;
  const ganttSchedules = ganttSite ? ganttSite.schedules : join.schedules;

  const openPlanning = React.useCallback((siteKey: string) => {
    setGanttSiteKey(siteKey || null);
    setView("gantt");
  }, []);

  return (
    <div className="nxy-root">
      <div className="app-shell">
        <TopNav view={view} onNavigate={setView} siteCount={sites.length} />
        <main>
          {parsed.error && (
            <div className="nxy-error" role="alert">
              ⚠ {parsed.error} — affichage de l'effectif OSS sans données d'absence.
            </div>
          )}
          {parsedSites.error && (
            <div className="nxy-error" role="alert">
              ⚠ {parsedSites.error} — carte en mode fallback (coordonnées internes).
            </div>
          )}

          {view === "login" && (
            <LoginMenu
              onNavigate={setView}
              stats={{ sites: sites.length, countries: countriesCount, oss: mockEmployees.length }}
            />
          )}

          {view === "map" && (
            <MapView
              sites={sites}
              countriesCount={countriesCount}
              today={today}
              todayLabel={todayLabel}
              selectedKey={selectedSiteKey}
              onSelect={setSelectedSiteKey}
              onOpenPlanning={openPlanning}
            />
          )}

          {view === "gantt" && (
            <GanttView
              schedules={ganttSchedules}
              win={monthWin}
              activeSiteName={ganttSite ? ganttSite.name : null}
              onClearSite={() => setGanttSiteKey(null)}
              onPrevMonth={() => setMonthWin((w) => shiftMonth(w, -1))}
              onNextMonth={() => setMonthWin((w) => shiftMonth(w, 1))}
              onBackToMap={() => setView("map")}
            />
          )}

          {view !== "login" && ungeolocated.length > 0 && (
            <div className="nxy-error" role="note" style={{ borderColor: "var(--line)", background: "var(--surface)", color: "var(--muted)" }}>
              ℹ {ungeolocated.length} collaborateur(s) non géolocalisé(s) (site absent de la table de
              coordonnées) — non affichés sur la carte.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
