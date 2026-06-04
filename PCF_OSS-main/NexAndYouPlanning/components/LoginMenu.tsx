import * as React from "react";
import { ViewName } from "../types";
import { ArrowRight, GanttIcon, LogoMark, MapIcon } from "./icons";

interface Props {
  onNavigate: (v: ViewName) => void;
  stats: { sites: number; countries: number; oss: number };
}

export const LoginMenu: React.FC<Props> = ({ onNavigate, stats }) => (
  <section className="page">
    <div className="login">
      <div className="login-hero">
        <div className="top-block">
          <div className="logo">
            <LogoMark id="nxy-hero-grad" />
          </div>
          <div>
            <div className="wm">Nex&amp;You</div>
            <div className="stamp">Internal · v1.0</div>
          </div>
        </div>
        <div className="pitch">
          <h1>
            Votre planning OSS
            <br />
            <span className="accent">
              en un coup
              <br />
              d'œil.
            </span>
          </h1>
          <p className="lede">
            Visualisez les absences des équipes OSS à travers tous les sites Nex&amp;You en temps réel.
          </p>
          <div className="signature">
            <div className="item">
              <div className="k font-display">{stats.sites}</div>
              <div className="l">Sites supervisés</div>
            </div>
            <div className="item">
              <div className="k font-display">{stats.countries}</div>
              <div className="l">Pays</div>
            </div>
            <div className="item">
              <div className="k font-display">{stats.oss}</div>
              <div className="l">Employés OSS</div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-main">
        <div>
          <div className="eyebrow">Accès manager</div>
          <h2 style={{ marginTop: 14 }}>
            Choisissez votre <span className="accent">module.</span>
          </h2>
          <p className="desc">
            Sélectionnez la vue à ouvrir.
          </p>
        </div>

        <div className="module-grid">
          <div className="module-card" onClick={() => onNavigate("map")}>
            <div className="m-icon">
              <MapIcon />
            </div>
            <div>
              <div className="m-label">Vue Sites</div>
              <div className="m-sub">Carte EMEA — sites Nex&amp;You &amp; indicateurs temps réel.</div>
            </div>
            <div className="m-arrow">
              <ArrowRight />
            </div>
          </div>

          <div className="module-card" onClick={() => onNavigate("gantt")}>
            <div className="m-icon">
              <GanttIcon />
            </div>
            <div>
              <div className="m-label">Vue Planning</div>
              <div className="m-sub">Gantt multi-sites — filtres pays · site · présence.</div>
            </div>
            <div className="m-arrow">
              <ArrowRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
