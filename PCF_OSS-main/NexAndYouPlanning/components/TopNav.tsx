import * as React from "react";
import { ViewName } from "../types";
import { LogoMark } from "./icons";

interface Props {
  view: ViewName;
  onNavigate: (v: ViewName) => void;
  siteCount: number;
}

const TABS: { key: ViewName; num: string; label: string }[] = [
  { key: "login", num: "01", label: "Accueil" },
  { key: "map", num: "02", label: "Sites EMEA" },
  { key: "gantt", num: "03", label: "Planning" },
];

export const TopNav: React.FC<Props> = ({ view, onNavigate, siteCount }) => (
  <nav className="top-nav">
    <div className="brand">
      <div className="logo">
        <LogoMark id="nxy-nav-grad" />
      </div>
      <div className="brand-text">
        <div className="name">Nex&amp;You</div>
        <div className="sub">Planning · EMEA</div>
      </div>
    </div>
    <div className="tabs">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={"tab" + (view === t.key ? " active" : "")}
          onClick={() => onNavigate(t.key)}
        >
          <span className="num">{t.num}</span>
          {t.label}
        </button>
      ))}
    </div>
    <div className="spacer" />
    <div className="right">
      <div className="live">
        <span className="pulse" />
        Live · {siteCount} sites
      </div>
      <div className="avatar">OSS</div>
    </div>
  </nav>
);
