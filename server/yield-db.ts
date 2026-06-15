import { eq, and, desc } from "drizzle-orm";
import { yields } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Create a new yield record
 */
export async function createYield(data: {
  fieldId: number;
  userId: number;
  cropName: string;
  harvestDate: Date;
  quantityProduced: number;
  unit: string;
  expectedYield?: number;
  season?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Calculate yield percentage if expected yield is provided
  let yieldPercentage: number | undefined;
  if (data.expectedYield && data.expectedYield > 0) {
    yieldPercentage = (data.quantityProduced / data.expectedYield) * 100;
  }

  const result = await db.insert(yields).values({
    fieldId: data.fieldId,
    userId: data.userId,
    cropName: data.cropName,
    harvestDate: data.harvestDate,
    quantityProduced: data.quantityProduced.toString(),
    unit: data.unit,
    expectedYield: data.expectedYield?.toString(),
    yieldPercentage: yieldPercentage?.toFixed(1),
    season: data.season,
    notes: data.notes,
  });

  return result;
}

/**
 * Get all yields for a specific field
 */
export async function getFieldYields(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(yields)
    .where(eq(yields.fieldId, fieldId))
    .orderBy(desc(yields.harvestDate));
}

/**
 * Get yield analytics for a field
 */
export async function getYieldAnalytics(fieldId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const records = await db
    .select()
    .from(yields)
    .where(eq(yields.fieldId, fieldId));

  if (records.length === 0) {
    return {
      averageYield: "0",
      bestYield: "0",
      totalHarvests: 0,
      yieldTrend: "stable",
    };
  }

  const quantities = records.map((r) => parseFloat(r.quantityProduced));
  const averageYield = (quantities.reduce((a, b) => a + b, 0) / quantities.length).toFixed(2);
  const bestYield = Math.max(...quantities).toFixed(2);

  // Determine trend (simple: compare first half vs second half)
  let yieldTrend = "stable";
  if (records.length >= 2) {
    const mid = Math.floor(records.length / 2);
    const firstHalf = quantities.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
    const secondHalf = quantities.slice(mid).reduce((a, b) => a + b, 0) / (records.length - mid);
    if (secondHalf > firstHalf * 1.1) yieldTrend = "increasing";
    else if (secondHalf < firstHalf * 0.9) yieldTrend = "decreasing";
  }

  return {
    averageYield,
    bestYield,
    totalHarvests: records.length,
    yieldTrend,
  };
}

/**
 * Get user's yield records across all fields
 */
export async function getUserYields(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(yields)
    .where(eq(yields.userId, userId))
    .orderBy(desc(yields.harvestDate));
}

/**
 * Get seasonal summary for a field
 */
export async function getSeasonalYieldSummary(fieldId: number, season: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(yields)
    .where(and(eq(yields.fieldId, fieldId), eq(yields.season, season)));
}
