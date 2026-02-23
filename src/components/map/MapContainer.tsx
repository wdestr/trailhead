import { useEffect, useRef, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import { COLUMBIA_STORES } from '@/data/columbia-stores';
import { COMPETITORS } from '@/data/competitors';
import { DISTRIBUTION_CENTERS } from '@/data/distribution-centers';
import { MARKETS } from '@/data/markets';
import { useAppStore } from '@/stores/app-store';
import { useMapStore } from '@/stores/map-store';
import { MapLegend } from './MapLegend';
import { RETAIL_PARTNERS, RETAILER_COLORS } from '@/data/retail-partners';

function storesToGeoJSON(stores: typeof COLUMBIA_STORES) {
  return {
    type: 'FeatureCollection' as const,
    features: stores.map(s => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [s.address.lng, s.address.lat] },
      properties: {
        id: s.id,
        name: s.name,
        brand: s.brand,
        format: s.format,
        sqft: s.sqft,
        revenue: s.performance.annualRevenue,
        revenueFormatted: `$${(s.performance.annualRevenue / 1e6).toFixed(1)}M`,
      },
    })),
  };
}

function competitorsToGeoJSON() {
  const features = COMPETITORS.flatMap(comp =>
    comp.locations.map(loc => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [loc.address.lng, loc.address.lat] },
      properties: {
        id: loc.id,
        name: loc.name,
        brand: comp.name,
        color: comp.color,
        city: loc.address.city,
        state: loc.address.state,
      },
    }))
  );
  return { type: 'FeatureCollection' as const, features };
}

function dcsToGeoJSON() {
  return {
    type: 'FeatureCollection' as const,
    features: DISTRIBUTION_CENTERS.map(dc => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [dc.lng, dc.lat] },
      properties: {
        id: dc.id,
        name: dc.name,
        city: dc.city,
        state: dc.state,
        utilization: dc.capacity.utilizationPct,
        coverage: dc.coverage,
        type: dc.type,
      },
    })),
  };
}

function marketsToGeoJSON(selectedMarket: string | null) {
  return {
    type: 'FeatureCollection' as const,
    features: MARKETS.map(m => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [m.lng, m.lat] },
      properties: {
        id: m.name,
        name: m.name,
        state: m.state,
        score: m.trailheadScore,
        scoreLabel: String(m.trailheadScore),
        pop: m.pop,
        ddg: m.retail.ddg,
        selected: m.name === selectedMarket ? 1 : 0,
      },
    })),
  };
}

function retailPartnersToGeoJSON() {
  return {
    type: 'FeatureCollection' as const,
    features: RETAIL_PARTNERS.map(rp => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [rp.address.lng, rp.address.lat] },
      properties: {
        id: rp.id,
        name: rp.name,
        retailer: rp.retailer,
        type: rp.type,
        city: rp.address.city,
        state: rp.address.state,
        color: RETAILER_COLORS[rp.retailer] || '#888888',
      },
    })),
  };
}

// Overlay data layer configs: map each toggle to market scoring fields + colors
const OVERLAY_CONFIGS: Record<string, { field: (m: typeof MARKETS[0]) => number; color: string; label: string }> = {
  demo:      { field: m => m.retail.demo,    color: '#3B82F6', label: 'Demographics' },
  income:    { field: m => Number(m.hhi.replace(/[^0-9.]/g, '')), color: '#22C55E', label: 'HH Income ($K)' },
  lifestyle: { field: m => m.retail.lifestyle, color: '#A855F7', label: 'Outdoor Lifestyle' },
  ddg:       { field: m => m.retail.ddg,     color: '#06B6D4', label: 'Digital Demand Gap' },
  traffic:   { field: m => m.retail.traffic,  color: '#FF6F00', label: 'Foot Traffic' },
  realestate:{ field: m => Number(m.rent.replace(/[^0-9.]/g, '')), color: '#EAB308', label: 'Rent ($/SF)' },
  tcts:      { field: m => m.currentTCTS,     color: '#F472B6', label: 'Cost-to-Serve' },
  climate:   { field: m => m.strat.climate,   color: '#94A3B8', label: 'Climate Score' },
};

function overlayToGeoJSON(layerId: string) {
  const cfg = OVERLAY_CONFIGS[layerId];
  if (!cfg) return { type: 'FeatureCollection' as const, features: [] as GeoJSON.Feature[] };
  return {
    type: 'FeatureCollection' as const,
    features: MARKETS.map(m => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [m.lng, m.lat] },
      properties: {
        name: m.name,
        value: cfg.field(m),
        label: `${cfg.field(m)}`,
      },
    })),
  };
}

export function MapContainer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const mapLoaded = useRef(false);
  const { selectedMarket, setSelectedMarket } = useAppStore();
  const { activeLayers, selectedCompetitors } = useMapStore();

  // Memoize static GeoJSON data that doesn't change
  const storesGeoJSON = useMemo(() => storesToGeoJSON(COLUMBIA_STORES), []);
  const competitorsGeoJSON = useMemo(() => competitorsToGeoJSON(), []);
  const dcsGeoJSON = useMemo(() => dcsToGeoJSON(), []);
  const retailPartnersGeoJSON = useMemo(() => retailPartnersToGeoJSON(), []);
  const overlayGeoJSONs = useMemo(() => {
    const result: Record<string, ReturnType<typeof overlayToGeoJSON>> = {};
    for (const layerId of Object.keys(OVERLAY_CONFIGS)) {
      result[layerId] = overlayToGeoJSON(layerId);
    }
    return result;
  }, []);

  // Cleanup popup helper
  const removePopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          },
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm-tiles', minzoom: 0, maxzoom: 19 }],
      },
      center: [-98.5, 39.5],
      zoom: 3.8,
      maxBounds: [[-130, 22], [-65, 52]],
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      mapLoaded.current = true;

      // ---- SOURCES (using memoized GeoJSON) ----
      map.addSource('columbia-stores', { type: 'geojson', data: storesGeoJSON });
      map.addSource('competitors', { type: 'geojson', data: competitorsGeoJSON });
      map.addSource('dcs', { type: 'geojson', data: dcsGeoJSON });
      map.addSource('markets', { type: 'geojson', data: marketsToGeoJSON(null) });
      map.addSource('retail-partners', { type: 'geojson', data: retailPartnersGeoJSON });

      // ---- DATA OVERLAY SOURCES & LAYERS (behind everything) ----
      for (const [layerId, cfg] of Object.entries(OVERLAY_CONFIGS)) {
        const srcId = `overlay-${layerId}`;
        map.addSource(srcId, { type: 'geojson', data: overlayGeoJSONs[layerId] });
        // Heatmap-like glow
        map.addLayer({
          id: `overlay-${layerId}-glow`,
          type: 'circle',
          source: srcId,
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, ['*', ['get', 'value'], 0.35], 6, ['*', ['get', 'value'], 0.6], 10, ['*', ['get', 'value'], 0.9]],
            'circle-color': cfg.color,
            'circle-opacity': 0.12,
            'circle-blur': 0.8,
          },
          layout: { visibility: activeLayers[layerId] ? 'visible' : 'none' },
        });
        // Score bubble
        map.addLayer({
          id: `overlay-${layerId}-circle`,
          type: 'circle',
          source: srcId,
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, ['*', ['get', 'value'], 0.14], 6, ['*', ['get', 'value'], 0.25], 10, ['*', ['get', 'value'], 0.4]],
            'circle-color': cfg.color,
            'circle-opacity': 0.5,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': cfg.color,
            'circle-stroke-opacity': 0.8,
          },
          layout: { visibility: activeLayers[layerId] ? 'visible' : 'none' },
        });
        // Score label
        map.addLayer({
          id: `overlay-${layerId}-label`,
          type: 'symbol',
          source: srcId,
          layout: {
            'text-field': ['get', 'label'],
            'text-size': ['interpolate', ['linear'], ['zoom'], 3, 8, 6, 10, 10, 13],
            'text-font': ['Open Sans Bold'],
            'text-allow-overlap': true,
            visibility: activeLayers[layerId] ? 'visible' : 'none',
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': 'rgba(0,0,0,0.5)',
            'text-halo-width': 1,
          },
        });
      }

      // ---- RETAIL PARTNER LAYER (behind other layers) ----
      map.addLayer({
        id: 'retail-partners-layer',
        type: 'circle',
        source: 'retail-partners',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 2, 6, 4, 10, 6],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.6,
          'circle-stroke-width': 0.5,
          'circle-stroke-color': 'rgba(255,255,255,0.3)',
        },
        layout: { visibility: activeLayers.retailers ? 'visible' : 'none' },
      });

      // ---- COMPETITOR LAYER ----
      map.addLayer({
        id: 'competitors-layer',
        type: 'circle',
        source: 'competitors',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 2.5, 6, 5, 10, 8],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.7,
          'circle-stroke-width': 1,
          'circle-stroke-color': 'rgba(255,255,255,0.5)',
        },
        layout: { visibility: activeLayers.competitors ? 'visible' : 'none' },
      });

      // ---- DC LAYER ----
      // Use a square icon rotated 45deg to mimic diamond shape
      map.addLayer({
        id: 'dc-layer',
        type: 'circle',
        source: 'dcs',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 5, 6, 8, 10, 12],
          'circle-color': '#10B981',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#6EE7B7',
          'circle-opacity': 0.9,
        },
        layout: { visibility: activeLayers.supply ? 'visible' : 'none' },
      });
      // DC label
      map.addLayer({
        id: 'dc-label',
        type: 'symbol',
        source: 'dcs',
        layout: {
          'text-field': 'DC',
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 7, 8, 10],
          'text-font': ['Open Sans Bold'],
          'text-allow-overlap': true,
          visibility: activeLayers.supply ? 'visible' : 'none',
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // ---- COLUMBIA STORES LAYER ----
      map.addLayer({
        id: 'columbia-stores-layer',
        type: 'circle',
        source: 'columbia-stores',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 3, 6, 6, 10, 10],
          'circle-color': [
            'match', ['get', 'brand'],
            'Columbia', '#3B82F6',
            'SOREL', '#EC4899',
            'Mountain Hardwear', '#F59E0B',
            'prAna', '#8B5CF6',
            '#3B82F6',
          ],
          'circle-stroke-width': ['interpolate', ['linear'], ['zoom'], 3, 1, 6, 2],
          'circle-stroke-color': 'white',
          'circle-opacity': 0.9,
        },
      });

      // ---- EXPANSION MARKETS LAYER (on top) ----
      // Outer glow
      map.addLayer({
        id: 'markets-glow',
        type: 'circle',
        source: 'markets',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 14, 6, 22, 10, 30],
          'circle-color': '#FF6F00',
          'circle-opacity': [
            'case',
            ['==', ['get', 'selected'], 1], 0.25,
            0.12,
          ],
          'circle-blur': 0.8,
        },
      });
      // Main circle
      map.addLayer({
        id: 'markets-layer',
        type: 'circle',
        source: 'markets',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 8, 6, 14, 10, 20],
          'circle-color': [
            'case',
            ['==', ['get', 'selected'], 1], '#FF6F00',
            'rgba(255,111,0,0.85)',
          ],
          'circle-stroke-width': [
            'case',
            ['==', ['get', 'selected'], 1], 3,
            2,
          ],
          'circle-stroke-color': [
            'case',
            ['==', ['get', 'selected'], 1], 'white',
            '#FFA040',
          ],
        },
      });
      // Market score labels
      map.addLayer({
        id: 'markets-label',
        type: 'symbol',
        source: 'markets',
        layout: {
          'text-field': ['get', 'scoreLabel'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 8, 6, 11, 10, 14],
          'text-font': ['Open Sans Bold'],
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': 'rgba(0,0,0,0.3)',
          'text-halo-width': 0.5,
        },
      });

      // ---- INTERACTIVITY ----
      // Market click
      map.on('click', 'markets-layer', (e) => {
        const feature = e.features?.[0];
        if (feature?.properties?.name) {
          setSelectedMarket(feature.properties.name);
        }
      });

      // Cursor changes
      const interactiveLayers = ['markets-layer', 'columbia-stores-layer', 'dc-layer', 'competitors-layer', 'retail-partners-layer'];
      interactiveLayers.forEach(layerId => {
        map.on('mouseenter', layerId, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', layerId, () => { map.getCanvas().style.cursor = ''; removePopup(); });
      });

      // Hover popups — Columbia Stores
      map.on('mouseenter', 'columbia-stores-layer', (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties;
        removePopup();
        const coords = (f.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        popupRef.current = new maplibregl.Popup({ offset: 12, closeButton: false, closeOnClick: false })
          .setLngLat(coords)
          .setHTML(`<div style="color:#1a1a2e;font-size:12px;font-weight:600;padding:2px 4px">${p.name}<br/><span style="font-size:10px;color:#666">${p.brand} ${p.format} &bull; ${Number(p.sqft).toLocaleString()} SF &bull; ${p.revenueFormatted} rev</span></div>`)
          .addTo(map);
      });

      // Hover popups — Competitors
      map.on('mouseenter', 'competitors-layer', (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties;
        removePopup();
        const coords = (f.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        popupRef.current = new maplibregl.Popup({ offset: 10, closeButton: false, closeOnClick: false })
          .setLngLat(coords)
          .setHTML(`<div style="color:#1a1a2e;font-size:11px;font-weight:600;padding:2px 4px">${p.name}<br/><span style="font-size:10px;color:#666">${p.brand} &bull; ${p.city}, ${p.state}</span></div>`)
          .addTo(map);
      });

      // Hover popups — DCs
      map.on('mouseenter', 'dc-layer', (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties;
        removePopup();
        const coords = (f.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        popupRef.current = new maplibregl.Popup({ offset: 12, closeButton: false, closeOnClick: false })
          .setLngLat(coords)
          .setHTML(`<div style="color:#1a1a2e;font-size:12px;font-weight:600;padding:2px 4px">${p.name}<br/><span style="font-size:10px;color:#666">${p.city}, ${p.state} &bull; ${p.utilization}% util &bull; ${p.coverage}</span></div>`)
          .addTo(map);
      });

      // Hover popups — Markets
      map.on('mouseenter', 'markets-layer', (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties;
        removePopup();
        const coords = (f.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        popupRef.current = new maplibregl.Popup({ offset: 18, closeButton: false, closeOnClick: false })
          .setLngLat(coords)
          .setHTML(`<div style="color:#1a1a2e;font-size:12px;font-weight:700;padding:2px 4px">${p.name}, ${p.state}<br/><span style="font-size:10px;color:#666">Score: ${p.score} &bull; Pop: ${p.pop} &bull; DDG: ${p.ddg}</span></div>`)
          .addTo(map);
      });

      // Hover popups — Retail Partners
      map.on('mouseenter', 'retail-partners-layer', (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const p = f.properties;
        removePopup();
        const coords = (f.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
        popupRef.current = new maplibregl.Popup({ offset: 10, closeButton: false, closeOnClick: false })
          .setLngLat(coords)
          .setHTML(`<div style="color:#1a1a2e;font-size:11px;font-weight:600;padding:2px 4px">${p.retailer}<br/><span style="font-size:10px;color:#666">${p.city}, ${p.state} &bull; ${p.type}</span></div>`)
          .addTo(map);
      });
    });

    mapRef.current = map;

    return () => {
      removePopup();
      map.remove();
      mapRef.current = null;
      mapLoaded.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update layer visibility when toggles change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded.current) return;

    const setVis = (layerId: string, visible: boolean) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
      }
    };

    setVis('competitors-layer', activeLayers.competitors);
    setVis('dc-layer', activeLayers.supply);
    setVis('dc-label', activeLayers.supply);
    setVis('retail-partners-layer', activeLayers.retailers ?? false);

    // Toggle overlay data layers
    for (const layerId of Object.keys(OVERLAY_CONFIGS)) {
      const on = activeLayers[layerId] ?? false;
      setVis(`overlay-${layerId}-glow`, on);
      setVis(`overlay-${layerId}-circle`, on);
      setVis(`overlay-${layerId}-label`, on);
    }
  }, [activeLayers]);

  // Update competitor filter when individual competitors are toggled
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded.current) return;

    // Build filter: show only competitors where selectedCompetitors[brand] !== false
    const hiddenBrands = Object.entries(selectedCompetitors)
      .filter(([, visible]) => visible === false)
      .map(([name]) => name);

    if (hiddenBrands.length > 0) {
      map.setFilter('competitors-layer', ['!', ['in', ['get', 'brand'], ['literal', hiddenBrands]]]);
    } else {
      map.setFilter('competitors-layer', null);
    }
  }, [selectedCompetitors]);

  // Update market selection styling
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded.current) return;

    const src = map.getSource('markets') as maplibregl.GeoJSONSource | undefined;
    if (src) {
      src.setData(marketsToGeoJSON(selectedMarket) as GeoJSON.FeatureCollection);
    }
  }, [selectedMarket]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border-default">
      <div ref={mapContainer} className="w-full h-full" />
      <MapLegend />
    </div>
  );
}
