import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import api from '../lib/api.js';
import { mediaUrl, formatPrice } from '../lib/format.jsx';
import Spinner from '../components/Spinner.jsx';
import { useLanguage } from '../lib/i18n.jsx';
import 'leaflet/dist/leaflet.css';

const DEFAULT_POS = [33.7, 3.0];

const markerIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};box-shadow:0 2px 8px rgba(0,0,0,.4)"><div style="position:absolute;inset:6px;border-radius:50%;background:#fff"></div></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -20],
  });

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    const valid = points.filter(([lat, lng]) => !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng)));
    if (valid.length) map.fitBounds(valid, { padding: [48, 48] });
  }, [map, points]);
  return null;
}

export default function MapPage() {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState([]);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const allPoints = [
    ...destinations.map((d) => [Number(d.latitude), Number(d.longitude)]),
    ...packs.map((p) => [Number(p.latitude), Number(p.longitude)]),
  ];

  useEffect(() => {
    Promise.all([api.destinations(), api.packs()])
      .then(([ds, ps]) => {
        setDestinations(ds);
        setPacks(ps);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>
    );
  }

  return (
    <section className="py-10">
      <div className="container-site mb-8 text-center">
        <h2 className="font-display text-3xl font-semibold text-forest-dark dark:text-sand-light">{t('map.title')}</h2>
        <p className="mt-2 text-sm text-forest-dark/60 dark:text-sand-dark">
          {destinations.length} {t('map.destinationsCount')} · {packs.length} {t('map.circuitsCount')} — {t('map.clickMarker')}
        </p>
        <div className="mt-3 flex justify-center gap-6 text-xs">
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-copper"></span> {t('map.legendDestination')}</span>
          <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-forest-darker dark:bg-sand-light"></span> {t('map.legendCircuit')}</span>
        </div>
      </div>

      <div className="container-site">
        <div className="h-[70vh] overflow-hidden rounded-3xl shadow-soft ring-1 ring-forest-dark/5 dark:ring-white/10">
          {error ? (
            <div className="flex h-full items-center justify-center text-sm text-red-500">{error}</div>
          ) : (
            <MapContainer center={DEFAULT_POS} zoom={6} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitBounds points={allPoints} />
              {destinations.map((d) => {
                const lat = Number(d.latitude);
                const lng = Number(d.longitude);
                if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
                return (
                  <Marker key={`d${d.id}`} position={[lat, lng]} icon={markerIcon('#c97b3a')}>
                    <Popup>
                      <div className="w-52">
                        {d.image && <img src={mediaUrl(d.image)} alt={d.name} className="mb-2 h-24 w-full rounded-lg object-cover" />}
                        <p className="font-semibold text-forest-dark">{d.name}</p>
                        <p className="text-xs text-forest-dark/60">{d.city_name} · {formatPrice(d.price)}</p>
                        <Link to={`/reselieuChoisi/${d.id}/`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-copper">
                          {t('map.viewDestination')} <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              {packs.map((p) => {
                const lat = Number(p.latitude);
                const lng = Number(p.longitude);
                if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
                return (
                  <CircleMarker
                    key={`p${p.id}`}
                    center={[lat, lng]}
                    radius={8}
                    pathOptions={{ color: '#234d42', fillColor: '#234d42', fillOpacity: 0.8 }}
                  >
                    <Popup>
                      <div className="w-52">
                        {p.image && <img src={mediaUrl(p.image)} alt={p.pack_name} className="mb-2 h-24 w-full rounded-lg object-cover" />}
                        <p className="font-semibold text-forest-dark">{p.pack_name}</p>
                        <p className="text-xs text-forest-dark/60">{formatPrice(p.price)}</p>
                        <Link to={`/circuitChoisi/${p.id}/`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-copper">
                          {t('map.viewCircuit')} <i className="bi bi-arrow-right"></i>
                        </Link>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}
        </div>
      </div>
    </section>
  );
}
