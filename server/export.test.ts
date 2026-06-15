import { describe, it, expect } from "vitest";
import { generateActivityCSV, generateYieldCSV } from "./export";

describe("Export Functions", () => {
  describe("generateActivityCSV", () => {
    it("should generate CSV from activity records", () => {
      const records = [
        {
          activityDate: new Date("2025-06-15"),
          activityType: "Fertilizer Application",
          cropName: "Rice",
          description: "Applied urea",
          quantity: "50",
          unit: "kg",
          cost: "1500",
          notes: "Good weather",
        },
      ];

      const csv = generateActivityCSV(records);
      expect(csv).toContain("Fertilizer Application");
      expect(csv).toContain("Rice");
      expect(csv).toContain("1500");
    });

    it("should handle empty records", () => {
      const csv = generateActivityCSV([]);
      expect(csv).toBe("No records found");
    });

    it("should handle null dates gracefully", () => {
      const records = [
        {
          activityDate: null,
          activityType: "Irrigation",
          cropName: "Wheat",
          description: "Flood irrigation",
          quantity: "10",
          unit: "hours",
          cost: "500",
          notes: "",
        },
      ];

      const csv = generateActivityCSV(records);
      expect(csv).toContain("Irrigation");
      expect(csv).toContain("Wheat");
    });
  });

  describe("generateYieldCSV", () => {
    it("should generate CSV from yield records", () => {
      const records = [
        {
          harvestDate: new Date("2025-10-20"),
          cropName: "Rice",
          quantityProduced: 5.5,
          unit: "ton/ha",
          expectedYield: 5.0,
          yieldPercentage: 110,
          season: "Kharif",
          notes: "Excellent harvest",
        },
      ];

      const csv = generateYieldCSV(records);
      expect(csv).toContain("Rice");
      expect(csv).toContain("5.5");
      expect(csv).toContain("Kharif");
    });

    it("should handle empty yield records", () => {
      const csv = generateYieldCSV([]);
      expect(csv).toBe("No yield records found");
    });

    it("should handle multiple records", () => {
      const records = [
        {
          harvestDate: new Date("2025-10-20"),
          cropName: "Rice",
          quantityProduced: 5.5,
          unit: "ton/ha",
          expectedYield: 5.0,
          yieldPercentage: 110,
          season: "Kharif",
          notes: "Good",
        },
        {
          harvestDate: new Date("2026-02-15"),
          cropName: "Wheat",
          quantityProduced: 4.2,
          unit: "ton/ha",
          expectedYield: 4.0,
          yieldPercentage: 105,
          season: "Rabi",
          notes: "Average",
        },
      ];

      const csv = generateYieldCSV(records);
      expect(csv).toContain("Rice");
      expect(csv).toContain("Wheat");
      expect(csv).toContain("Kharif");
      expect(csv).toContain("Rabi");
    });
  });
});
