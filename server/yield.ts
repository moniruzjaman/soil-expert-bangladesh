import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { createYield, getFieldYields, getYieldAnalytics, getUserYields, getSeasonalYieldSummary } from "./yield-db";

export const yieldRouter = router({
  /**
   * Get all yield records for a specific field
   */
  getFieldYields: protectedProcedure
    .input(z.object({ fieldId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const records = await getFieldYields(input.fieldId);
        return records.map((r) => ({
          id: r.id,
          fieldId: r.fieldId,
          cropName: r.cropName,
          harvestDate: r.harvestDate,
          quantityProduced: parseFloat(r.quantityProduced),
          unit: r.unit,
          expectedYield: r.expectedYield ? parseFloat(r.expectedYield) : undefined,
          yieldPercentage: r.yieldPercentage ? parseFloat(r.yieldPercentage) : undefined,
          notes: r.notes,
          season: r.season,
        }));
      } catch (error) {
        console.error("Error fetching field yields:", error);
        return [];
      }
    }),

  /**
   * Record a new harvest/yield
   */
  recordYield: protectedProcedure
    .input(
      z.object({
        fieldId: z.number(),
        cropName: z.string(),
        harvestDate: z.date(),
        quantityProduced: z.number(),
        unit: z.string(),
        expectedYield: z.number().optional(),
        season: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await createYield({
          fieldId: input.fieldId,
          userId: ctx.user.id,
          cropName: input.cropName,
          harvestDate: input.harvestDate,
          quantityProduced: input.quantityProduced,
          unit: input.unit,
          expectedYield: input.expectedYield,
          season: input.season,
          notes: input.notes,
        });

        return { success: true, message: "Yield recorded successfully" };
      } catch (error) {
        console.error("Error recording yield:", error);
        throw new Error("Failed to record yield");
      }
    }),

  /**
   * Get yield analytics for a field
   */
  getYieldAnalytics: protectedProcedure
    .input(z.object({ fieldId: z.number() }))
    .query(async ({ input }) => {
      try {
        return await getYieldAnalytics(input.fieldId);
      } catch (error) {
        console.error("Error fetching yield analytics:", error);
        return {
          averageYield: "0",
          bestYield: "0",
          totalHarvests: 0,
          yieldTrend: "stable",
        };
      }
    }),

  /**
   * Get all yields for the current user
   */
  getUserYields: protectedProcedure.query(async ({ ctx }) => {
    try {
      const records = await getUserYields(ctx.user.id);
      return records.map((r) => ({
        id: r.id,
        fieldId: r.fieldId,
        cropName: r.cropName,
        harvestDate: r.harvestDate,
        quantityProduced: parseFloat(r.quantityProduced),
        unit: r.unit,
        expectedYield: r.expectedYield ? parseFloat(r.expectedYield) : undefined,
        yieldPercentage: r.yieldPercentage ? parseFloat(r.yieldPercentage) : undefined,
        season: r.season,
        notes: r.notes,
      }));
    } catch (error) {
      console.error("Error fetching user yields:", error);
      return [];
    }
  }),

  /**
   * Get seasonal yield summary for a field
   */
  getSeasonalSummary: protectedProcedure
    .input(z.object({ fieldId: z.number(), season: z.string() }))
    .query(async ({ input }) => {
      try {
        const records = await getSeasonalYieldSummary(input.fieldId, input.season);
        if (records.length === 0) {
          return {
            season: input.season,
            totalRecords: 0,
            averageYield: "0",
            crops: [],
          };
        }

        const quantities = records.map((r) => parseFloat(r.quantityProduced));
        const averageYield = (quantities.reduce((a, b) => a + b, 0) / quantities.length).toFixed(2);
        const crops = Array.from(new Set(records.map((r) => r.cropName)));

        return {
          season: input.season,
          totalRecords: records.length,
          averageYield,
          crops,
        };
      } catch (error) {
        console.error("Error fetching seasonal summary:", error);
        return {
          season: input.season,
          totalRecords: 0,
          averageYield: "0",
          crops: [],
        };
      }
    }),
});
