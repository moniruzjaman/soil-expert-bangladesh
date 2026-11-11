export type ParcelCoordinate = { lat: number; lng: number };

export type ReverseGeocodeComponents = {
  formattedAddress?: string;
  district?: string;
  upazila?: string;
  unionName?: string;
};

export function mapReverseGeocodeResult(position: ParcelCoordinate, result: ReverseGeocodeComponents, accuracyMeters?: number) {
  return {
    latitude: position.lat.toString(),
    longitude: position.lng.toString(),
    accuracyMeters: accuracyMeters?.toString(),
    address: result.formattedAddress,
    district: result.district,
    upazila: result.upazila,
    unionName: result.unionName,
  };
}

export function parcelPersistenceFields(input: Record<string, string | undefined>) {
  return {
    boundaryGeoJson: input.boundaryGeoJson,
    locationAccuracyMeters: input.locationAccuracyMeters,
    address: input.address,
    district: input.district,
    upazila: input.upazila,
    unionName: input.unionName,
    mouzaName: input.mouzaName,
    sheetNumber: input.sheetNumber,
    plotNumber: input.plotNumber,
    cadastralStatus: input.cadastralStatus,
  };
}

export function isValidCoordinate(value: ParcelCoordinate) {
  return Number.isFinite(value.lat) && Number.isFinite(value.lng) && value.lat >= -90 && value.lat <= 90 && value.lng >= -180 && value.lng <= 180;
}

export function isBangladeshCoordinate(value: ParcelCoordinate) {
  return isValidCoordinate(value) && value.lat >= 20.5 && value.lat <= 26.7 && value.lng >= 88 && value.lng <= 92.8;
}

export function isValidBoundaryGeoJson(value: string) {
  try {
    const parsed = JSON.parse(value) as { type?: string; coordinates?: unknown };
    return parsed.type === "Polygon" && Array.isArray(parsed.coordinates) && Array.isArray(parsed.coordinates[0]) && parsed.coordinates[0].length >= 4;
  } catch {
    return false;
  }
}
