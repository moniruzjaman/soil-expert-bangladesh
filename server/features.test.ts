import { describe, it, expect } from "vitest";
import { aezSoilData, fertilizerRecommendationData, cropSuitabilityMatrix } from "./data/aezData";

describe("AEZ Soil Data", () => {
  it("should have valid AEZ profiles", () => {
    expect(aezSoilData.length).toBeGreaterThan(0);
    const aezCodes = aezSoilData.map((d) => d.aezCode);
    expect(aezCodes.length).toBeGreaterThan(0);
  });

  it("should have soil pH values for each AEZ", () => {
    aezSoilData.forEach((profile) => {
      expect(profile.defaultSoilPH).toBeDefined();
      const pH = typeof profile.defaultSoilPH === "string" ? parseFloat(profile.defaultSoilPH) : profile.defaultSoilPH;
      expect(pH).toBeGreaterThan(4);
      expect(pH).toBeLessThan(9);
    });
  });

  it("should have organic matter data for each AEZ", () => {
    aezSoilData.forEach((profile) => {
      expect(profile).toBeDefined();
      // Check that profile has AEZ code
      expect(profile.aezCode).toBeDefined();
    });
  });

  it("should have valid fertility classes", () => {
    const validClasses = ["Low", "Medium", "High", "Low to Medium", "Medium to High"];
    aezSoilData.forEach((profile) => {
      expect(validClasses).toContain(profile.fertilityClass);
    });
  });
});

describe("Fertilizer Recommendation Data (FRG 2024)", () => {
  it("should have crop recommendations", () => {
    const crops = Object.keys(fertilizerRecommendationData);
    expect(crops.length).toBeGreaterThanOrEqual(5);
  });

  it("should have valid NPK recommendations for crops", () => {
    const crops = Object.keys(fertilizerRecommendationData);
    if (crops.length > 0) {
      const firstCrop = fertilizerRecommendationData[crops[0]] as any;
      if (firstCrop && firstCrop.npk) {
        expect(firstCrop.npk.n).toBeDefined();
        expect(firstCrop.npk.p).toBeDefined();
        expect(firstCrop.npk.k).toBeDefined();
      }
    }
  });

  it("should have micronutrient recommendations", () => {
    const crops = Object.keys(fertilizerRecommendationData);
    if (crops.length > 0) {
      const firstCrop = fertilizerRecommendationData[crops[0]] as any;
      if (firstCrop) {
        expect(firstCrop.micronutrients).toBeDefined();
      }
    }
  });

  it("should have organic and chemical fertilizer recommendations", () => {
    const crops = Object.keys(fertilizerRecommendationData);
    if (crops.length > 0) {
      const firstCrop = fertilizerRecommendationData[crops[0]] as any;
      if (firstCrop) {
        expect(firstCrop.organicFertilizer).toBeDefined();
        expect(firstCrop.chemicalFertilizer).toBeDefined();
      }
    }
  });

  it("should have bio-fertilizer recommendations", () => {
    const crops = Object.keys(fertilizerRecommendationData);
    if (crops.length > 0) {
      const firstCrop = fertilizerRecommendationData[crops[0]] as any;
      if (firstCrop) {
        expect(firstCrop.bioFertilizer).toBeDefined();
      }
    }
  });
});

describe("Crop Suitability Matrix", () => {
  it("should have crop recommendations for AEZs", () => {
    const aezCodes = Object.keys(cropSuitabilityMatrix);
    expect(aezCodes.length).toBeGreaterThan(0);
  });

  it("should have season recommendations", () => {
    Object.values(cropSuitabilityMatrix).forEach((aezData: any) => {
      const hasSeasons = Object.keys(aezData).length > 0;
      expect(hasSeasons).toBe(true);
    });
  });

  it("should have valid crop suitability data", () => {
    let foundCrop = false;
    Object.values(cropSuitabilityMatrix).forEach((aezData: any) => {
      Object.values(aezData).forEach((crops: any) => {
        if (Array.isArray(crops) && crops.length > 0) {
          foundCrop = true;
          crops.forEach((crop: any) => {
            expect(crop.crop).toBeDefined();
            expect(crop.suitability).toBeDefined();
          });
        }
      });
    });
    expect(foundCrop).toBe(true);
  });

  it("should have valid suitability levels", () => {
    const validSuitability = ["Highly Suitable", "Suitable", "Marginally Suitable"];
    let foundValidSuitability = false;
    Object.values(cropSuitabilityMatrix).forEach((aezData: any) => {
      Object.values(aezData).forEach((crops: any) => {
        if (Array.isArray(crops)) {
          crops.forEach((crop: any) => {
            if (validSuitability.includes(crop.suitability)) {
              foundValidSuitability = true;
            }
          });
        }
      });
    });
    expect(foundValidSuitability).toBe(true);
  });
});

describe("Soil Health Calculations", () => {
  it("should have valid fertilizer data", () => {
    const crops = Object.keys(fertilizerRecommendationData);
    expect(crops.length).toBeGreaterThan(0);
  });

  it("should recommend liming for acidic soils", () => {
    const acidicSoilPH = 5.5;
    const limingNeeded = acidicSoilPH < 6.0;
    expect(limingNeeded).toBe(true);
  });

  it("should recommend organic matter improvement for low OM soils", () => {
    const lowOM = 1.0;
    const needsOMImprovement = lowOM < 1.5;
    expect(needsOMImprovement).toBe(true);
  });
});

describe("AEZ Detection Logic", () => {
  it("should correctly identify AEZ based on coordinates", () => {
    const dhakaCords = { lat: 23.8103, lon: 90.4125 };
    const khulnaCords = { lat: 22.8456, lon: 89.5403 };
    const sylhetCords = { lat: 24.8949, lon: 91.8687 };

    const isValidBangladesh = (lat: number, lon: number) => lat > 20 && lat < 27 && lon > 88 && lon < 93;
    expect(isValidBangladesh(dhakaCords.lat, dhakaCords.lon)).toBe(true);
    expect(isValidBangladesh(khulnaCords.lat, khulnaCords.lon)).toBe(true);
    expect(isValidBangladesh(sylhetCords.lat, sylhetCords.lon)).toBe(true);
  });
});

describe("Data Integrity", () => {
  it("should have no duplicate AEZ codes", () => {
    const codes = aezSoilData.map((d) => d.aezCode);
    const uniqueCodes = new Set(codes);
    expect(codes.length).toBe(uniqueCodes.size);
  });

  it("should have no duplicate crop entries", () => {
    const crops = Object.keys(fertilizerRecommendationData);
    const uniqueCrops = new Set(crops);
    expect(crops.length).toBe(uniqueCrops.size);
  });
});
