import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const REGION_CENTERS = [
  { name: 'Île-de-France', lat: 48.85, lng: 2.35 },
  { name: 'Hauts-de-France', lat: 49.95, lng: 2.8 },
  { name: 'Grand Est', lat: 48.7, lng: 5.7 },
  { name: 'Normandie', lat: 49.0, lng: 0.2 },
  { name: 'Bretagne', lat: 48.2, lng: -2.8 },
  { name: 'Pays de la Loire', lat: 47.4, lng: -0.8 },
  { name: 'Centre-Val de Loire', lat: 47.5, lng: 1.7 },
  { name: 'Bourgogne-Franche-Comté', lat: 47.0, lng: 5.0 },
  { name: 'Nouvelle-Aquitaine', lat: 45.2, lng: 0.7 },
  { name: 'Auvergne-Rhône-Alpes', lat: 45.4, lng: 4.7 },
  { name: 'Occitanie', lat: 43.6, lng: 2.4 },
  { name: "Provence-Alpes-Côte d'Azur", lat: 43.7, lng: 5.8 },
];

function getColor(count: number, maxCount: number): string {
  if (count === 0) return '#e2e8f0';
  const intensity = count / maxCount;
  if (intensity < 0.25) return '#fed7aa';
  if (intensity < 0.5) return '#fdba74';
  if (intensity < 0.75) return '#fb923c';
  return '#fd7958';
}

function createIcon(count: number, maxCount: number, isSelected: boolean): L.DivIcon {
  const color = getColor(count, maxCount);
  const size = count === 0 ? 26 : 30 + Math.round((count / maxCount) * 14);
  const border = isSelected ? '2.5px solid #344a5e' : '2px solid rgba(255,255,255,0.9)';
  const shadow = isSelected
    ? '0 0 0 3px rgba(52,74,94,0.2), 0 2px 6px rgba(0,0,0,0.15)'
    : '0 2px 6px rgba(0,0,0,0.12)';
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:${size}px;height:${size}px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      color:#344a5e;font-weight:700;font-size:${size > 36 ? 11 : 10}px;
      border:${border};box-shadow:${shadow};
      cursor:pointer;transition:transform 0.15s;
    ">${count > 0 ? count : ''}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface Props {
  regionDistribution: Record<string, number>;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  maxCount: number;
}

export default function FranceLeadMap({
  regionDistribution,
  selectedRegion,
  onSelectRegion,
  maxCount,
}: Props) {
  return (
    <MapContainer
      center={[46.6, 2.8]}
      zoom={5}
      style={{ height: '280px', width: '100%', borderRadius: '8px' }}
      zoomControl={true}
      scrollWheelZoom={true}
      dragging={true}
      doubleClickZoom={true}
      touchZoom={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
      />
      {REGION_CENTERS.map((region) => {
        const count = regionDistribution[region.name] || 0;
        const isSelected = selectedRegion === region.name;
        return (
          <Marker
            key={region.name}
            position={[region.lat, region.lng]}
            icon={createIcon(count, maxCount, isSelected)}
            eventHandlers={{
              click: () =>
                onSelectRegion(
                  selectedRegion === region.name ? 'all' : region.name
                ),
            }}
          >
            <Tooltip direction="top" offset={[0, -16]}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '12px' }}>
                  {region.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {count} lead{count > 1 ? 's' : ''}
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
