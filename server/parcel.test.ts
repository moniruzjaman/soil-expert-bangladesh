import { describe, expect, it } from "vitest";
import { isBangladeshCoordinate, isValidBoundaryGeoJson, isValidCoordinate, mapReverseGeocodeResult, parcelPersistenceFields } from "../shared/parcel";

describe("parcel location helpers", () => {
  it("accepts valid Bangladesh GPS coordinates", () => {
    expect(isValidCoordinate({ lat: 23.685, lng: 90.3563 })).toBe(true);
    expect(isBangladeshCoordinate({ lat: 23.685, lng: 90.3563 })).toBe(true);
  });

  it("rejects malformed or out-of-range coordinates", () => {
    expect(isValidCoordinate({ lat: 95, lng: 90 })).toBe(false);
    expect(isBangladeshCoordinate({ lat: 40.7128, lng: -74.006 })).toBe(false);
  });

  it("accepts a closed polygon boundary and rejects invalid JSON", () => {
    const polygon = JSON.stringify({ type: "Polygon", coordinates: [[[90, 23], [90.01, 23], [90.01, 23.01], [90, 23.01], [90, 23]]] });
    expect(isValidBoundaryGeoJson(polygon)).toBe(true);
    expect(isValidBoundaryGeoJson("not-json")).toBe(false);
  });

  it("maps reverse-geocode results into the field location contract", () => {
    expect(mapReverseGeocodeResult({ lat: 23.7, lng: 90.4 }, { formattedAddress: "Dhaka, Bangladesh", district: "Dhaka", upazila: "Savar", unionName: "Aminbazar" }, 8)).toMatchObject({ latitude: "23.7", longitude: "90.4", accuracyMeters: "8", district: "Dhaka", upazila: "Savar" });
  });

  it("retains parcel metadata for field persistence", () => {
    expect(parcelPersistenceFields({ boundaryGeoJson: "polygon", address: "Rangpur", mouzaName: "Mouza A", plotNumber: "42", cadastralStatus: "Verified in Smart Bhumi Naksha" })).toEqual(expect.objectContaining({ boundaryGeoJson: "polygon", address: "Rangpur", mouzaName: "Mouza A", plotNumber: "42", cadastralStatus: "Verified in Smart Bhumi Naksha" }));
  });
});
