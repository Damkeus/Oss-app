import * as React from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ISiteView, sitePresence } from "../lib/sites";
import { RegionCode } from "../types";
import { REGION_FLAGS, REGION_LABELS } from "../data/siteCoords";
import { normalize } from "../lib/normalize";
import { SiteOverlay } from "./SiteOverlay";
import { ArrowRight, SearchIcon } from "./icons";

interface Props {
  sites: ISiteView[];
  countriesCount: number;
  today: number;
  todayLabel: string;
  selectedKey: string | null;
  onSelect: (key: string | null) => void;
  onOpenPlanning: (siteKey: string) => void;
}

const EMEA_CENTER: L.LatLngExpression = [46, 12];
const EMEA_BOUNDS: L.LatLngBoundsExpression = [[-5, -30], [72, 65]];

const TILE_LIGHT = {
  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
};

export const MapView: React.FC<Props> = ({
  sites, countriesCount, today, todayLabel, selectedKey, onSelect, onOpenPlanning,
}) => {
  const mapEl = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<L.Map | null>(null);
  const tileRef = React.useRef<L.TileLayer | null>(null);
  const markersRef = React.useRef<Map<string, L.Marker>>(new Map());
  const [region, setRegion] = React.useState<RegionCode | "all">("all");
  const [query, setQuery] = React.useState("");
  const [userDismissed, setUserDismissed] = React.useState(false);

  const regionsPresent = React.useMemo(() => {
    const set = new Set<RegionCode>();
    sites.forEach((s) => set.add(s.region));
    return Array.from(set);
  }, [sites]);

  const visible = React.useMemo(() => {
    const q = normalize(query);
    return sites.filter((s) => {
      const regionOk = region === "all" || s.region === region;
      const searchOk = !q
        || normalize(s.name).includes(q)
        || normalize(s.country).includes(q)
        || s.schedules.some((e) => {
          const name = normalize(`${e.employee.Firstname} ${e.employee.Lastname}`);
          const trigram = normalize(e.employee.TRIGRAM ?? "");
          return name.includes(q) || trigram.includes(q);
        });
      return regionOk && searchOk;
    });
  }, [sites, region, query]);

  const regionStats = React.useMemo(() => {
    if (region === "all") return null;
    let total = 0, present = 0;
    visible.forEach((s) => {
      const p = sitePresence(s, today);
      total += p.total;
      present += p.present;
    });
    const rate = total > 0 ? Math.round((present / total) * 100) : 100;
    return { total, present, absent: total - present, rate, sites: visible.length };
  }, [visible, region, today]);

  // init map once
  React.useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, {
      center: EMEA_CENTER,
      zoom: 4,
      minZoom: 2,
      maxBounds: EMEA_BOUNDS,
      maxBoundsViscosity: 0.7,
      scrollWheelZoom: true,
      attributionControl: true,
    });
    const tile = L.tileLayer(TILE_LIGHT.url, { maxZoom: 18, attribution: TILE_LIGHT.attribution });
    tile.addTo(map);
    tileRef.current = tile;
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      tileRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // rebuild markers when visible set or selection changes
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    visible.forEach((s) => {
      const active = s.key === selectedKey;
      const icon = L.divIcon({
        className: "nxy-pin" + (active ? " active" : ""),
        html: '<div class="dot"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const marker = L.marker([s.lat, s.lng], {
        icon,
        title: `${s.name} · ${s.schedules.length} OSS`,
      });
      marker.on("click", () => onSelect(s.key));
      marker.addTo(map);
      markersRef.current.set(s.key, marker);
    });
  }, [visible, selectedKey, onSelect]);

  // reset dismissed flag when the user types a new query
  React.useEffect(() => {
    setUserDismissed(false);
  }, [query]);

  // auto-open overlay when search narrows to a single site
  React.useEffect(() => {
    if (!userDismissed && query.trim() && visible.length === 1 && selectedKey !== visible[0].key) {
      onSelect(visible[0].key);
    }
  }, [query, visible, selectedKey, onSelect, userDismissed]);

  const handleClose = React.useCallback(() => {
    setUserDismissed(true);
    onSelect(null);
  }, [onSelect]);

  const selectedSite = selectedKey ? sites.find((s) => s.key === selectedKey) ?? null : null;

  return (
    <section className="page">
      <div className="context-strip">
        <div className="left">
          <div className="breadcrumb">Manager · <span>EMEA</span> · Sites</div>
          <div className="title-row">
            <h1>Sites Nex&amp;You</h1>
            <span className="eyebrow">{sites.length} sites · {countriesCount} pays</span>
          </div>
        </div>
        <div className="right">
          <button className="btn btn-primary" onClick={() => onOpenPlanning("")}>
            Voir le planning
            <span className="ico"><ArrowRight /></span>
          </button>
        </div>
      </div>

      <div className="card map-card">
        <div className="card-head">
          <div>
            <h3 className="h-section" style={{ marginTop: 8 }}>Présence EMEA</h3>
            <div className="eyebrow">Carte interactive  </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="pill">{sites.length} sites · {countriesCount} pays</span>
          </div>
        </div>

        <div className="map-toolbar">
          <div className="field">
            <span className="ico"><SearchIcon /></span>
            <input
              placeholder="Rechercher un site, un pays ou un OSS…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="map-filter-group">
            <button
              className={"mfg-btn" + (region === "all" ? " active" : "")}
              onClick={() => setRegion("all")}
            >
              Tous
            </button>
            {regionsPresent.map((r) => (
              <button
                key={r}
                className={"mfg-btn" + (region === r ? " active" : "")}
                onClick={() => setRegion(r)}
              >
                {REGION_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {region !== "all" && regionStats && (
          <div className="region-rate-band">
            <div className="rrb-left">
              <span className="rrb-region">
                {REGION_FLAGS[region]}&nbsp;{REGION_LABELS[region]}
              </span>
              <span className="rrb-sites">
                {regionStats.sites} site{regionStats.sites > 1 ? "s" : ""}
              </span>
            </div>
            <div className="rrb-bar-wrap">
              <div className="rrb-bar">
                <div className="rrb-fill" style={{ width: `${regionStats.rate}%` }} />
              </div>
            </div>
            <div className="rrb-right">
              <span className={"rrb-rate" + (regionStats.rate < 70 ? " alert" : "")}>
                {regionStats.rate}%
              </span>
              <span className="rrb-detail">
                {regionStats.present} / {regionStats.total} présents
              </span>
            </div>
          </div>
        )}

        <div className="map-wrap">
          <div ref={mapEl} className="leaflet-host" style={{ position: "absolute", inset: 0 }} />
          {!selectedSite && (
            <div className="map-hint">
              <span className="dot" />
              Cliquez sur un site pour voir le détail
            </div>
          )}
          {selectedSite && (
            <SiteOverlay
              site={selectedSite}
              day={today}
              dayLabel={todayLabel}
              onClose={handleClose}
              onOpenPlanning={onOpenPlanning}
            />
          )}
        </div>
      </div>
    </section>
  );
};
