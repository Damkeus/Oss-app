import * as React from "react";
import { ISiteView, sitePresence } from "../lib/sites";
import { isAbsentOnDay } from "../lib/absence";
import { REGION_FLAGS, REGION_LABELS } from "../data/siteCoords";
import { ArrowRight, CloseIcon } from "./icons";

interface Props {
  site: ISiteView;
  day: number;
  dayLabel: string;
  onClose: () => void;
  onOpenPlanning: (siteKey: string) => void;
}

export const SiteOverlay: React.FC<Props> = ({ site, day, dayLabel, onClose, onOpenPlanning }) => {
  const p = sitePresence(site, day);
  const alert = p.rate < 70;

  const rows = site.schedules
    .map((s) => ({ s, absent: isAbsentOnDay(s.ranges, day) }))
    .sort((a, b) => Number(a.absent) - Number(b.absent));

  return (
    <div className="site-overlay" role="dialog" aria-label={`Détail ${site.name}`}>
      <div className="so-head">
        <div className="left">
          <div className="so-flag">{REGION_FLAGS[site.region]}</div>
          <div className="so-meta">
            <div className="nm">{site.name}</div>
            <div className="sub">
              <span className="tag">{site.country}</span>
              <span>{REGION_LABELS[site.region]}</span>
            </div>
          </div>
        </div>
        <button className="so-close" aria-label="Fermer" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="so-body">
        <div className="so-hero">
          <div>
            <div className="label">Effectif OSS</div>
            <div className="big font-display">{p.total}</div>
          </div>
          <div className="right">
            <span className={"status" + (alert ? " alert" : "")}>
              {alert ? "Sous-effectif" : "Opérationnel"}
            </span>
          </div>
        </div>

        <div className="so-stats" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <div className="item">
            <div className="v font-display">{p.absent}</div>
            <div className="l">Absents auj.</div>
          </div>
          <div className="item warn">
            <div className="v font-display">{p.present}</div>
            <div className="l">Présents</div>
          </div>
        </div>

        <div className="so-presence">
          <div className="ph">
            <span className="lbl">Aujourd'hui · {dayLabel}</span>
            <span className="cnt">
              {p.present}/{p.total} présents
            </span>
          </div>
          <div className="so-emp-list">
            {rows.map(({ s, absent }) => (
              <div key={s.employee.TRIGRAM + s.employee.Lastname} className={"so-emp" + (absent ? " absent" : "")}>
                <div className="av">{s.initials}</div>
                <div className="nm">
                  {s.employee.Firstname} {s.employee.Lastname}
                </div>
                <span className={"st " + (absent ? "absent" : "present")}>
                  {absent ? "Absent" : "Présent"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="so-cta">
          <button className="btn btn-brand" onClick={() => onOpenPlanning(site.key)}>
            Voir le planning
            <span className="ico">
              <ArrowRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
