import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getFieldYields } from "./yield-db";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { fields, soilTests, activityRecords, fertilizerRecommendations } from "../drizzle/schema";

/**
 * Generate a comprehensive field report as JSON
 */
export async function generateFieldReport(userId: number, fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get field data
  const fieldData = await db.select().from(fields).where(eq(fields.id, fieldId)).limit(1);
  if (!fieldData.length) throw new Error("Field not found");

  const field = fieldData[0];

  // Get latest soil test
  const soilTestData = await db
    .select()
    .from(soilTests)
    .where(eq(soilTests.fieldId, fieldId))
    .orderBy((t) => t.testDate)
    .limit(1);

  // Get fertilizer recommendations
  const fertilizerData = await db
    .select()
    .from(fertilizerRecommendations)
    .where(eq(fertilizerRecommendations.fieldId, fieldId));

  // Get activity records
  const activityData = await db
    .select()
    .from(activityRecords)
    .where(eq(activityRecords.fieldId, fieldId));

  // Get yield records
  const yieldData = await getFieldYields(fieldId);

  return {
    fieldInfo: {
      name: field.fieldName,
      location: {
        latitude: field.latitude,
        longitude: field.longitude,
        aezCode: field.aezCode,
      },
      area: field.areaInBigha,
      soilTexture: field.soilTexture,
      landType: field.landType,
    },
    latestSoilTest: soilTestData.length > 0 ? soilTestData[0] : null,
    fertilizerRecommendations: fertilizerData,
    activityRecords: activityData,
    yieldRecords: yieldData,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate CSV export for activity records
 */
export function generateActivityCSV(records: any[]): string {
  if (records.length === 0) return "No records found";

  const headers = ["Date", "Activity Type", "Crop", "Description", "Quantity", "Unit", "Cost (BDT)", "Notes"];
  const rows = records.map((r) => [
    r.activityDate ? new Date(r.activityDate).toLocaleDateString("en-BD") : "",
    r.activityType,
    r.cropName || "",
    r.description || "",
    r.quantity || "",
    r.unit || "",
    r.cost || "",
    r.notes || "",
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  return csv;
}

/**
 * Generate CSV export for yield records
 */
export function generateYieldCSV(records: any[]): string {
  if (records.length === 0) return "No yield records found";

  const headers = ["Harvest Date", "Crop", "Quantity Produced", "Unit", "Expected Yield", "Achievement %", "Season", "Notes"];
  const rows = records.map((r) => [
    r.harvestDate ? new Date(r.harvestDate).toLocaleDateString("en-BD") : "",
    r.cropName,
    r.quantityProduced,
    r.unit,
    r.expectedYield || "",
    r.yieldPercentage || "",
    r.season || "",
    r.notes || "",
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  return csv;
}

/**
 * Generate seasonal summary report
 */
export async function generateSeasonalSummary(fieldId: number, season: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get activities for season
  const activities = await db
    .select()
    .from(activityRecords)
    .where(eq(activityRecords.fieldId, fieldId));

  // Filter by season (approximate based on month)
  const seasonMonths: Record<string, number[]> = {
    "Kharif": [5, 6, 7, 8, 9], // May-September
    "Rabi": [10, 11, 12, 1, 2], // October-February
    "Zaid": [3, 4], // March-April
  };

  const months = seasonMonths[season] || [];
  const seasonActivities = activities.filter((a) => {
    if (!a.activityDate) return false;
    const month = new Date(a.activityDate).getMonth() + 1;
    return months.includes(month);
  });

  // Calculate costs
  const totalCost = seasonActivities.reduce((sum, a) => sum + (parseFloat(a.cost || "0") || 0), 0);

  // Get yields for season
  const yields = await getFieldYields(fieldId);
  const seasonYields = yields.filter((y) => y.season === season);

  return {
    season,
    period: `${season} Season`,
    totalActivities: seasonActivities.length,
    totalCost,
    totalYields: seasonYields.length,
    averageYield: seasonYields.length > 0
      ? (seasonYields.reduce((sum, y) => sum + parseFloat(y.quantityProduced), 0) / seasonYields.length).toFixed(2)
      : "0",
    activities: seasonActivities,
    yields: seasonYields,
  };
}

export const exportRouter = router({
  /**
   * Get comprehensive field report
   */
  getFieldReport: protectedProcedure
    .input(z.object({ fieldId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        return await generateFieldReport(ctx.user.id, input.fieldId);
      } catch (error) {
        console.error("Error generating field report:", error);
        throw new Error("Failed to generate report");
      }
    }),

  /**
   * Export activity records as CSV
   */
  exportActivityCSV: protectedProcedure
    .input(z.object({ fieldId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const records = await db
          .select()
          .from(activityRecords)
          .where(eq(activityRecords.fieldId, input.fieldId));

        const csv = generateActivityCSV(records);
        return {
          filename: `activities_${input.fieldId}_${new Date().toISOString().split("T")[0]}.csv`,
          content: csv,
        };
      } catch (error) {
        console.error("Error exporting activities:", error);
        throw new Error("Failed to export activities");
      }
    }),

  /**
   * Export yield records as CSV
   */
  exportYieldCSV: protectedProcedure
    .input(z.object({ fieldId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const records = await getFieldYields(input.fieldId);
        const csv = generateYieldCSV(records);
        return {
          filename: `yields_${input.fieldId}_${new Date().toISOString().split("T")[0]}.csv`,
          content: csv,
        };
      } catch (error) {
        console.error("Error exporting yields:", error);
        throw new Error("Failed to export yields");
      }
    }),

  /**
   * Get seasonal summary
   */
  getSeasonalSummary: protectedProcedure
    .input(z.object({ fieldId: z.number(), season: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await generateSeasonalSummary(input.fieldId, input.season);
      } catch (error) {
        console.error("Error generating seasonal summary:", error);
        throw new Error("Failed to generate seasonal summary");
      }
    }),
});
