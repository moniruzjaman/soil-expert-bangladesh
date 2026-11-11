import { useEffect, useRef } from "react";
import { MapView } from "@/components/Map";
import { mapReverseGeocodeResult } from "@shared/parcel";

type ParcelLocation = {
  latitude: string;
  longitude: string;
  accuracyMeters?: string;
  address?: string;
  district?: string;
  upazila?: string;
  unionName?: string;
};

type ParcelMapProps = {
  center?: google.maps.LatLngLiteral;
  onLocationChange: (location: ParcelLocation) => void;
  onBoundaryChange: (boundaryGeoJson: string) => void;
};

const BANGLADESH_CENTER = { lat: 23.685, lng: 90.3563 };

export function ParcelMap({ center, onLocationChange, onBoundaryChange }: ParcelMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const reverseGeocode = (position: google.maps.LatLngLiteral, accuracyMeters?: number) => {
    const geocoder = geocoderRef.current;
    if (!geocoder) return;
    geocoder.geocode({ location: position }, (results, status) => {
      const first = results?.[0];
      if (status !== "OK" || !first) {
        onLocationChange({ latitude: position.lat.toString(), longitude: position.lng.toString(), accuracyMeters: accuracyMeters?.toString() });
        return;
      }
      const component = (type: string) => first.address_components.find(item => item.types.includes(type))?.long_name;
      onLocationChange(mapReverseGeocodeResult(position, {
        formattedAddress: first.formatted_address,
        district: component("administrative_area_level_2"),
        upazila: component("administrative_area_level_3"),
        unionName: component("administrative_area_level_4") || component("locality"),
      }, accuracyMeters));
    });
  };

  const setPin = (position: google.maps.LatLngLiteral, accuracyMeters?: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({ map, draggable: true, title: "Field location" });
      markerRef.current.addListener("dragend", () => {
        const markerPosition = markerRef.current?.getPosition();
        if (markerPosition) reverseGeocode({ lat: markerPosition.lat(), lng: markerPosition.lng() });
      });
    }
    markerRef.current.setPosition(position);
    map.panTo(position);
    reverseGeocode(position, accuracyMeters);
  };

  const serializePolygon = (polygon: google.maps.Polygon) => {
    const coordinates: number[][] = [];
    polygon.getPath().forEach(point => coordinates.push([point.lng(), point.lat()]));
    if (coordinates.length > 0) coordinates.push(coordinates[0]);
    onBoundaryChange(JSON.stringify({ type: "Polygon", coordinates: [coordinates] }));
  };

  const handleReady = (map: google.maps.Map) => {
    mapRef.current = map;
    geocoderRef.current = new google.maps.Geocoder();
    map.addListener("click", (event: google.maps.MapMouseEvent) => {
      if (event.latLng) setPin({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: "#15803d",
        fillOpacity: 0.22,
        strokeColor: "#15803d",
        strokeWeight: 3,
        editable: true,
        draggable: false,
      },
    });
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, "polygoncomplete", (polygon: google.maps.Polygon) => {
      polygonRef.current?.setMap(null);
      polygonRef.current = polygon;
      serializePolygon(polygon);
      polygon.getPath().addListener("set_at", () => serializePolygon(polygon));
      polygon.getPath().addListener("insert_at", () => serializePolygon(polygon));
      drawingManager.setDrawingMode(null);
    });

    if (center) setPin(center);
  };

  useEffect(() => {
    if (mapRef.current && center) setPin(center);
  }, [center?.lat, center?.lng]);

  return (
    <div className="overflow-hidden rounded-xl border border-green-200 bg-green-50">
      <MapView initialCenter={center || BANGLADESH_CENTER} initialZoom={center ? 16 : 7} onMapReady={handleReady} className="h-[300px]" />
      <p className="px-3 py-2 text-xs text-green-900">
        Tap the map to set the field point. Use the polygon tool to trace the field boundary. Drag the pin to correct the position.
      </p>
    </div>
  );
}
