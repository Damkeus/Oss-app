import * as React from "react";
import logoN from "../assets/logo-n.png";

type P = { className?: string };

export const LogoMark: React.FC<{ id: string }> = (_props) => (
  <img src={logoN} alt="Nex&You logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
);

export const ArrowRight: React.FC<P> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const ArrowLeft: React.FC<P> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M11 19l-7-7 7-7" />
  </svg>
);

export const SearchIcon: React.FC<P> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-5-5" />
  </svg>
);

export const MapIcon: React.FC<P> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l-6 2v14l6-2 6 2 6-2V5l-6 2-6-2z" />
    <path d="M9 5v14M15 7v14" />
  </svg>
);

export const GanttIcon: React.FC<P> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M3 9h18M7 4v16" />
    <rect x="9" y="11" width="6" height="2.5" rx="1" fill="currentColor" stroke="none" />
    <rect x="13" y="15" width="5" height="2.5" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const CloseIcon: React.FC<P> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
