import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, aezSoilProfiles, fields, soilTests, fertilizerRecommendations, activityRecords, chatMessages } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * AEZ Soil Profile queries
 */
export async function getAezSoilProfileByCode(aezCode: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(aezSoilProfiles).where(eq(aezSoilProfiles.aezCode, aezCode)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllAezSoilProfiles() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(aezSoilProfiles);
}

/**
 * Field queries
 */
export async function getUserFields(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(fields).where(eq(fields.userId, userId));
}

export async function getFieldById(fieldId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(fields).where(eq(fields.id, fieldId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserFieldById(userId: number, fieldId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(fields).where(and(eq(fields.id, fieldId), eq(fields.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createField(fieldData: typeof fields.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(fields).values(fieldData);
  return result;
}

/**
 * Soil Test queries
 */
export async function getFieldSoilTests(fieldId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(soilTests).where(eq(soilTests.fieldId, fieldId));
}

export async function getLatestSoilTest(fieldId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(soilTests).where(eq(soilTests.fieldId, fieldId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSoilTest(testData: typeof soilTests.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(soilTests).values(testData);
}

/**
 * Fertilizer Recommendation queries
 */
export async function getFieldFertilizerRecommendations(fieldId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(fertilizerRecommendations).where(eq(fertilizerRecommendations.fieldId, fieldId));
}

export async function createFertilizerRecommendation(recData: typeof fertilizerRecommendations.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(fertilizerRecommendations).values(recData);
}

/**
 * Activity Record queries
 */
export async function getFieldActivityRecords(fieldId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(activityRecords).where(eq(activityRecords.fieldId, fieldId));
}

export async function createActivityRecord(recordData: typeof activityRecords.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(activityRecords).values(recordData);
}

/**
 * Chat Message queries
 */
export async function getUserChatMessages(userId: number, fieldId?: number) {
  const db = await getDb();
  if (!db) return [];

  if (fieldId) {
    return await db.select().from(chatMessages).where(and(eq(chatMessages.userId, userId), eq(chatMessages.fieldId, fieldId)));
  }

  return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
}

export async function createChatMessage(messageData: typeof chatMessages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(chatMessages).values(messageData);
}
