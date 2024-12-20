"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationMapProps {
  location: string;
  className?: string;
}

interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export function LocationMap({ location, className }: LocationMapProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const geocodeLocation = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}`
        );
        const data: GeocodingResult[] = await response.json();

        if (data && data.length > 0) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setAddress(data[0].display_name);
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    };

    if (location) {
      geocodeLocation();
    }
  }, [location]);

  if (!coordinates) {
    return null;
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden border border-border shadow-md`}>
      <MapContainer
        center={coordinates}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="bottomright" />
        <Marker position={coordinates} icon={customIcon}>
          <Popup className="rounded-md shadow-lg">
            <div className="p-2">
              <h3 className="font-medium mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
