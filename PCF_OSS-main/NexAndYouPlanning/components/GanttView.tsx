import * as React from "react";
import { IEmployeeSchedule, RegionCode } from "../types";
import { IMonthWindow, dowInitial, isWeekend, nextMonthLabel, prevMonthLabel } from "../lib/dates";
import { countryToRegion, REGION_FLAGS, REGION_LABELS } from "../data/siteCoords";
import { normalize } from "../lib/normalize";
import { ArrowLeft, SearchIcon } from "./icons";

interface Props {
  schedules: IEmployeeSchedule[];
  win: IMonthWindow;
  activeSiteName: string | null;
  onClearSite: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onBackToMap: () => void;
}

interface Group {
  region: RegionCode;
  items: IEmployeeSchedule[];
}

export const GanttView: React.FC<Props> = ({
  schedules, win, activeSiteName, onClearSite, onPrevMonth, onNextMonth, onBackToMap,
}) => {
  const [query, setQuery] = React.useState("");
  const days = win.daysInMonth;
  const colTemplate = `repeat(${days}, minmax(30px, 1fr))`;

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return schedules;
    return schedules.filter((s) => {
      const name = normalize(`${s.employee.Firstname} ${s.employee.Lastname}`);
      const trigram = normalize(s.employee.TRIGRAM ?? "");
      return name.includes(q) || trigram.includes(q) || normalize(s.primarySite).includes(q);
    });
  }, [schedules, query]);

  const groups = React.useMemo<Group[]>(() => {
    const byRegion = new Map<RegionCode, IEmployeeSchedule[]>();
    for (const s of filtered) {
      const r = countryToRegion(s.employee.Country);
      if (!byRegion.has(r)) byRegion.set(r, []);
      byRegion.get(r)!.push(s);
    }
    return Array.from(byRegion.entries()).map(([region, items]) => ({ region, items }));
  }, [filtered]);

  return (
    <section className="page">
      <div className="context-strip">
        <div className="left">
          <div className="breadcrumb">
            Manager · <span>EMEA</span> · Planning mensuel
          </div>
          <div className="title-row">
            <h1>Planning</h1>
            <span className="eyebrow">{win.label} · vue mensuelle</span>
          </div>
        </div>
        <div className="right">
          <button className="btn btn-ghost" onClick={onBackToMap}>
            <span className="ico">
              <ArrowLeft />
            </span>
            Vue Sites
          </button>
        </div>
      </div>

      <div className="card">
        <div className="gantt-toolbar">
          <div className="field">
            <span className="ico">
              <SearchIcon />
            </span>
            <input
              placeholder="Rechercher un OSS ou un site…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span className="pill" onClick={onPrevMonth}>
            ‹ {prevMonthLabel(win)}
          </span>
          <span className="pill on">{win.label}</span>
          <span className="pill" onClick={onNextMonth}>
            {nextMonthLabel(win)} ›
          </span>
        </div>

        <div className="active-filters">
          <span className="label">Filtres actifs</span>
          {activeSiteName ? (
            <span className="chip dot">
              Site · {activeSiteName} <span className="x" onClick={onClearSite}>✕</span>
            </span>
          ) : (
            <span className="chip dot">Tous les sites</span>
          )}
          {activeSiteName && (
            <span className="chip reset" onClick={onClearSite}>
              ↻ Réinitialiser
            </span>
          )}
        </div>

        <div className="gantt-scroll">
          <div className="gantt">
            <div className="g-head">
              <div className="name">Employé · Site</div>
              <div className="g-days" style={{ gridTemplateColumns: colTemplate }}>
                {Array.from({ length: days }, (_, i) => i + 1).map((d) => {
                  const we = isWeekend(win, d);
                  const today = d === win.todayDay;
                  return (
                    <div key={d} className={"d" + (we ? " we" : "") + (today ? " today" : "")}>
                      {d}
                      <small>{dowInitial(win, d)}</small>
                    </div>
                  );
                })}
              </div>
            </div>

            {groups.length === 0 && (
              <div className="g-empty">Aucun employé pour ce filtre.</div>
            )}

            {groups.map((g) => (
              <React.Fragment key={g.region}>
                <div className="g-group">
                  <span className="label-l">
                    <span className="flag">{REGION_FLAGS[g.region]}</span>
                    {REGION_LABELS[g.region]}
                  </span>
                  <span className="count">
                    {g.items.length} OSS · {g.region}
                  </span>
                </div>
                {g.items.map((s) => (
                  <div className="g-row" key={s.employee.TRIGRAM + s.employee.Firstname + s.employee.Lastname}>
                    <div className="name">
                      <span className="avatar-sm">{s.initials}</span>
                      <span className="info">
                        <span className="nn">
                          {s.employee.Firstname} {s.employee.Lastname}
                        </span>
                        <span className="meta">{s.primarySite}</span>
                      </span>
                    </div>
                    <div className="track" style={{ gridTemplateColumns: colTemplate }}>
                      {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
                        <div
                          key={d}
                          className={"cell" + (isWeekend(win, d) ? " we" : "") + (d === win.todayDay ? " today" : "")}
                        />
                      ))}
                      {s.ranges.map((r, idx) => (
                        <div
                          key={idx}
                          className={"bar " + (r.label === "OOF" ? "oof" : "absent")}
                          title={r.subject}
                          style={{
                            left: `${((r.startDay - 1) / days) * 100}%`,
                            width: `${((r.endDay - r.startDay + 1) / days) * 100}%`,
                          }}
                        >
                          {r.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="legend">
          <span>
            <span className="sw" style={{ background: "var(--absent)", borderColor: "rgba(138,74,26,.2)" }} />
            Absent
          </span>
          <span>
            <span className="sw" style={{ background: "var(--oof)", borderColor: "rgba(27,74,107,.2)" }} />
            OOF (Out of office)
          </span>
          <span>
            <span className="sw" style={{ background: "var(--surface-2)" }} />
            Week-end
          </span>
          <span>
            <span className="sw" style={{ background: "var(--nx-red)", borderColor: "var(--nx-red)" }} />
            Aujourd'hui
          </span>
        </div>
      </div>
    </section>
  );
};
