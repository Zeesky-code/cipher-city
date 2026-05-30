import type { Stop } from '../types';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import L, { type DivIcon } from 'leaflet';
import { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

interface Props {
  stops: Stop[];
  solved: number;
  viewing: number;
  mapTitle: string;
  mapSub: string;
  onSelect: (index: number) => void;
}

function FitToBounds({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, { padding: [24, 24] });
  }, [map, bounds]);

  return null;
}

function sealIcon(label: string, state: 'solved' | 'current' | 'locked', active: boolean): DivIcon {
  const cls = ['seal-marker', state, active ? 'active' : ''].filter(Boolean).join(' ');
  const safeLabel = label.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return L.divIcon({
    className: cls,
    html: `
      <div class="seal-ui" role="img" aria-label="${safeLabel}">
        <div class="ring"></div>
        <div class="disc"></div>
        <div class="num">${safeLabel}</div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

export default function HuntMap({ stops, solved, viewing, mapTitle, mapSub, onSelect }: Props) {
  const bounds = useMemo(() => {
    const b = new L.LatLngBounds(stops.map(s => [s.lat, s.lng] as [number, number]));
    return b.pad(0.35);
  }, [stops]);

  const route = useMemo(
    () => stops.map(s => [s.lat, s.lng] as [number, number]),
    [stops],
  );

  return (
    <>
      <div className="map-title">{mapTitle}</div>
      <div className="map-sub">{mapSub}</div>
      <div className="map-shell" aria-label="Hunt map">
        <MapContainer
          className="map-leaflet"
          bounds={bounds}
          maxBounds={bounds}
          maxBoundsViscosity={0.9}
          zoomControl={false}
          attributionControl={true}
          scrollWheelZoom={false}
          dragging={true}
        >
          <FitToBounds bounds={bounds} />
          <TileLayer
            // CARTO Positron is readable + minimal; attribution is required.
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          <Polyline
            positions={route}
            pathOptions={{
              className: 'route-line',
              weight: 3,
              opacity: 0.75,
              dashArray: '2 8',
              lineCap: 'round',
            }}
          />

          {stops.map((stop, i) => {
            const state = i < solved ? 'solved' : i === solved ? 'current' : 'locked';
            const clickable = i <= solved;
            const active = i === viewing;
            const label = i < solved ? '✦' : String(i + 1);
            return (
              <Marker
                key={stop.name}
                position={[stop.lat, stop.lng]}
                icon={sealIcon(label, state, active)}
                interactive={clickable}
                eventHandlers={
                  clickable
                    ? {
                      click: () => onSelect(i),
                    }
                    : undefined
                }
              />
            );
          })}
        </MapContainer>
      </div>

      <div className="legend">
        <span><i style={{ background: '#8d2418' }} />solved</span>
        <span><i style={{ background: '#c9a24a' }} />current trail</span>
        <span><i style={{ background: 'rgba(201,162,74,.3)' }} />sealed</span>
      </div>
    </>
  );
}
