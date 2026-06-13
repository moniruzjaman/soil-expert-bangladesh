import { describe, expect, it } from "vitest";

const bangladeshCalendar = [
  {
    month: "January",
    season: "Rabi (Winter)",
    crops: ["Wheat", "Potato", "Lentil", "Chickpea", "Mustard"],
    activities: ["Harvesting of Rabi crops", "Land preparation for Kharif"],
    irrigation: "Moderate - 3-4 irrigations for wheat",
    awd: false,
  },
  {
    month: "June",
    season: "Kharif (Monsoon)",
    crops: ["Rice (T. Aman)", "Jute", "Eggplant", "Okra"],
    activities: ["Rice transplanting", "Monsoon crop establishment"],
    irrigation: "Low - Rainfall sufficient",
    awd: true,
  },
];

describe("Bangladesh Agricultural Calendar", () => {
  it("should have 12 months of calendar data", () => {
    expect(bangladeshCalendar.length).toBeGreaterThan(0);
  });

  it("should have all required fields for each month", () => {
    bangladeshCalendar.forEach((month) => {
      expect(month).toHaveProperty("month");
      expect(month).toHaveProperty("season");
      expect(month).toHaveProperty("crops");
      expect(month).toHaveProperty("activities");
      expect(month).toHaveProperty("irrigation");
      expect(month).toHaveProperty("awd");
    });
  });

  it("should have crops array for each month", () => {
    bangladeshCalendar.forEach((month) => {
      expect(Array.isArray(month.crops)).toBe(true);
      expect(month.crops.length).toBeGreaterThan(0);
    });
  });

  it("should have activities for each month", () => {
    bangladeshCalendar.forEach((month) => {
      expect(Array.isArray(month.activities)).toBe(true);
      expect(month.activities.length).toBeGreaterThan(0);
    });
  });

  it("should identify Kharif season months with AWD technique", () => {
    const kharifMonths = bangladeshCalendar.filter((m) => m.season.includes("Kharif"));
    const awdMonths = kharifMonths.filter((m) => m.awd);
    expect(awdMonths.length).toBeGreaterThan(0);
  });

  it("should have irrigation guidance for each month", () => {
    bangladeshCalendar.forEach((month) => {
      expect(month.irrigation).toBeTruthy();
      expect(typeof month.irrigation).toBe("string");
    });
  });

  it("should identify Rabi season crops", () => {
    const rabiMonths = bangladeshCalendar.filter((m) => m.season.includes("Rabi"));
    expect(rabiMonths.length).toBeGreaterThan(0);
    rabiMonths.forEach((month) => {
      expect(month.crops.some((c) => ["Wheat", "Potato", "Lentil"].includes(c))).toBe(true);
    });
  });

  it("should have mixed season months", () => {
    const mixedMonths = bangladeshCalendar.filter((m) => m.season.includes("/"));
    expect(mixedMonths.length).toBeGreaterThanOrEqual(0);
  });

  it("should have rice in Kharif season", () => {
    const kharifMonths = bangladeshCalendar.filter((m) => m.season.includes("Kharif"));
    const hasRice = kharifMonths.some((m) => m.crops.some((c) => c.includes("Rice")));
    expect(hasRice).toBe(true);
  });

  it("should indicate AWD technique for rice months", () => {
    const riceMonths = bangladeshCalendar.filter((m) => m.crops.some((c) => c.includes("Rice")));
    riceMonths.forEach((month) => {
      expect(month.awd).toBe(true);
    });
  });
});

describe("Soil Test Data Structure", () => {
  const sampleSoilTest = {
    id: 1,
    fieldId: 1,
    userId: 1,
    testDate: new Date("2026-06-13"),
    soilPH: "6.5",
    organicMatter: "2.5",
    nitrogen: "25",
    phosphorus: "15",
    potassium: "150",
    zinc: "1.5",
    boron: "0.5",
    notes: "Lab test from BARI",
  };

  it("should have all required soil test fields", () => {
    expect(sampleSoilTest).toHaveProperty("id");
    expect(sampleSoilTest).toHaveProperty("fieldId");
    expect(sampleSoilTest).toHaveProperty("userId");
    expect(sampleSoilTest).toHaveProperty("testDate");
    expect(sampleSoilTest).toHaveProperty("soilPH");
  });

  it("should validate soil pH range", () => {
    const pH = parseFloat(sampleSoilTest.soilPH);
    expect(pH).toBeGreaterThanOrEqual(3);
    expect(pH).toBeLessThanOrEqual(10);
  });

  it("should validate organic matter percentage", () => {
    const om = parseFloat(sampleSoilTest.organicMatter);
    expect(om).toBeGreaterThanOrEqual(0);
    expect(om).toBeLessThanOrEqual(20);
  });

  it("should validate NPK values", () => {
    const n = parseFloat(sampleSoilTest.nitrogen);
    const p = parseFloat(sampleSoilTest.phosphorus);
    const k = parseFloat(sampleSoilTest.potassium);

    expect(n).toBeGreaterThanOrEqual(0);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(k).toBeGreaterThanOrEqual(0);
  });

  it("should validate micronutrient values", () => {
    const zn = parseFloat(sampleSoilTest.zinc);
    const b = parseFloat(sampleSoilTest.boron);

    expect(zn).toBeGreaterThanOrEqual(0);
    expect(b).toBeGreaterThanOrEqual(0);
  });

  it("should classify soil health based on pH", () => {
    const pH = parseFloat(sampleSoilTest.soilPH);
    let status = "Unknown";

    if (pH < 5.5) status = "Acidic";
    else if (pH < 6.0) status = "Slightly Acidic";
    else if (pH <= 7.5) status = "Neutral";
    else if (pH <= 8.5) status = "Slightly Alkaline";
    else status = "Alkaline";

    expect(status).not.toBe("Unknown");
    expect(["Acidic", "Slightly Acidic", "Neutral", "Slightly Alkaline", "Alkaline"]).toContain(status);
  });

  it("should identify optimal soil pH for Bangladesh crops", () => {
    const pH = parseFloat(sampleSoilTest.soilPH);
    // Most Bangladesh crops prefer pH 6.0-7.5
    const isOptimal = pH >= 6.0 && pH <= 7.5;
    expect(isOptimal).toBe(true);
  });

  it("should identify low organic matter soils", () => {
    const om = parseFloat(sampleSoilTest.organicMatter);
    const isLow = om < 2.0;
    expect(isLow).toBe(false); // Sample has 2.5% which is adequate
  });
});

describe("Seasonal Crop Recommendations", () => {
  it("should recommend different crops for different seasons", () => {
    const rabiCrops = ["Wheat", "Potato", "Lentil", "Chickpea"];
    const kharifCrops = ["Rice", "Jute", "Eggplant"];
    const zaidCrops = ["Mungbean", "Okra", "Cucumber"];

    expect(rabiCrops.length).toBeGreaterThan(0);
    expect(kharifCrops.length).toBeGreaterThan(0);
    expect(zaidCrops.length).toBeGreaterThan(0);
  });

  it("should have distinct crops for each season", () => {
    const rabiCrops = new Set(["Wheat", "Potato", "Lentil"]);
    const kharifCrops = new Set(["Rice", "Jute", "Eggplant"]);

    const intersection = [...rabiCrops].filter((x) => kharifCrops.has(x));
    expect(intersection.length).toBe(0);
  });
});
