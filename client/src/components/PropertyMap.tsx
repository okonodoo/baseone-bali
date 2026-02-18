/* PropertyMap — Google Maps integration for property listings
 * Uses Manus Maps proxy (no API key needed) */

import { useRef, useCallback } from "react";
import { MapView } from "@/components/Map";

interface PropertyPin {
  id: string;
  title: string;
  lat: number;
  lng: number;
  price: string;
  type: string;
}

interface PropertyMapProps {
  properties: PropertyPin[];
  className?: string;
  onPinClick?: (id: string) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  selectedRegion?: string;
}

// Bali center coordinates
const BALI_CENTER = { lat: -8.4095, lng: 115.1889 };

const REGION_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  canggu: { lat: -8.6478, lng: 115.1385, zoom: 14 },
  seminyak: { lat: -8.6913, lng: 115.1683, zoom: 14 },
  ubud: { lat: -8.5069, lng: 115.2625, zoom: 13 },
  uluwatu: { lat: -8.8291, lng: 115.0849, zoom: 13 },
  "nusa-dua": { lat: -8.8005, lng: 115.2326, zoom: 14 },
  sanur: { lat: -8.6913, lng: 115.2625, zoom: 14 },
  denpasar: { lat: -8.6500, lng: 115.2167, zoom: 13 },
  kuta: { lat: -8.7180, lng: 115.1690, zoom: 14 },
};

export function PropertyMap({
  properties,
  className = "h-[400px]",
  onPinClick,
  center,
  zoom = 10,
  selectedRegion,
}: PropertyMapProps) {
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const handleMapReady = useCallback(
    (map: google.maps.Map) => {
      // Clear existing markers
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];

      // Add markers for each property
      properties.forEach((prop) => {
        // Create custom marker content
        const markerContent = document.createElement("div");
        markerContent.className = "property-marker";
        markerContent.innerHTML = `
          <div style="
            background: #0a0a0b;
            border: 2px solid #c5a059;
            border-radius: 12px;
            padding: 4px 10px;
            color: #c5a059;
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            cursor: pointer;
            transition: all 0.2s;
          ">
            ${prop.price}
          </div>
          <div style="
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid #c5a059;
            margin: 0 auto;
          "></div>
        `;

        markerContent.addEventListener("mouseenter", () => {
          const inner = markerContent.firstElementChild as HTMLElement;
          if (inner) {
            inner.style.background = "#c5a059";
            inner.style.color = "#0a0a0b";
            inner.style.transform = "scale(1.1)";
          }
        });
        markerContent.addEventListener("mouseleave", () => {
          const inner = markerContent.firstElementChild as HTMLElement;
          if (inner) {
            inner.style.background = "#0a0a0b";
            inner.style.color = "#c5a059";
            inner.style.transform = "scale(1)";
          }
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: prop.lat, lng: prop.lng },
          title: prop.title,
          content: markerContent,
        });

        marker.addListener("click", () => {
          onPinClick?.(prop.id);
        });

        markersRef.current.push(marker);
      });

      // Fit bounds or center on region
      if (properties.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        properties.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }));
        map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      } else if (properties.length === 0 && selectedRegion && selectedRegion !== "all" && REGION_CENTERS[selectedRegion]) {
        const rc = REGION_CENTERS[selectedRegion];
        map.setCenter({ lat: rc.lat, lng: rc.lng });
        map.setZoom(rc.zoom);
      } else if (properties.length === 0) {
        map.setCenter(BALI_CENTER);
        map.setZoom(10);
      }
    },
    [properties, onPinClick, selectedRegion]
  );

  return (
    <MapView
      className={className}
      initialCenter={center || BALI_CENTER}
      initialZoom={zoom}
      onMapReady={handleMapReady}
    />
  );
}

export function PropertyDetailMap({
  lat,
  lng,
  title,
  className = "h-[350px]",
}: {
  lat: number;
  lng: number;
  title: string;
  className?: string;
}) {
  const handleMapReady = useCallback(
    (map: google.maps.Map) => {
      const markerContent = document.createElement("div");
      markerContent.innerHTML = `
        <div style="
          background: #c5a059;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          border: 3px solid #0a0a0b;
          box-shadow: 0 2px 8px rgba(197,160,89,0.5);
        "></div>
      `;

      new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat, lng },
        title,
        content: markerContent,
      });
    },
    [lat, lng, title]
  );

  return (
    <MapView
      className={className}
      initialCenter={{ lat, lng }}
      initialZoom={15}
      onMapReady={handleMapReady}
    />
  );
}
