import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * AEZ (Agro-Ecological Zone) soil profile data for Bangladesh
 * Contains default soil parameters for each AEZ
 */
export const aezSoilProfiles = mysqlTable("aez_soil_profiles", {
  id: int("id").autoincrement().primaryKey(),
  aezCode: varchar("aez_code", { length: 10 }).notNull().unique(),
  aezName: varchar("aez_name", { length: 255 }).notNull(),
  district: varchar("district", { length: 100 }),
  upazila: varchar("upazila", { length: 100 }),
  description: text("description"),
  defaultSoilPH: varchar("default_soil_ph", { length: 50 }),
  organicMatterStatus: varchar("organic_matter_status", { length: 50 }),
  fertilityClass: varchar("fertility_class", { length: 50 }),
  dominantSoilTexture: varchar("dominant_soil_texture", { length: 100 }),
  landType: varchar("land_type", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AezSoilProfile = typeof aezSoilProfiles.$inferSelect;
export type InsertAezSoilProfile = typeof aezSoilProfiles.$inferInsert;

/**
 * Farmer fields with location and soil information
 */
export const fields = mysqlTable("fields", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  fieldName: varchar("field_name", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  boundaryGeoJson: text("boundary_geo_json"),
  locationAccuracyMeters: varchar("location_accuracy_meters", { length: 50 }),
  address: text("address"),
  district: varchar("district", { length: 100 }),
  upazila: varchar("upazila", { length: 100 }),
  unionName: varchar("union_name", { length: 100 }),
  mouzaName: varchar("mouza_name", { length: 150 }),
  sheetNumber: varchar("sheet_number", { length: 100 }),
  plotNumber: varchar("plot_number", { length: 100 }),
  cadastralStatus: varchar("cadastral_status", { length: 100 }),
  aezCode: varchar("aez_code", { length: 10 }),
  areaInBigha: varchar("area_in_bigha", { length: 50 }),
  soilTexture: varchar("soil_texture", { length: 100 }),
  landType: varchar("land_type", { length: 50 }),
  soilPH: varchar("soil_ph", { length: 50 }),
  organicMatter: varchar("organic_matter", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Field = typeof fields.$inferSelect;
export type InsertField = typeof fields.$inferInsert;

/**
 * Soil test records for fields
 */
export const soilTests = mysqlTable("soil_tests", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("field_id").notNull(),
  userId: int("user_id").notNull(),
  testDate: timestamp("test_date"),
  soilPH: varchar("soil_ph", { length: 50 }),
  nitrogen: varchar("nitrogen", { length: 50 }),
  phosphorus: varchar("phosphorus", { length: 50 }),
  potassium: varchar("potassium", { length: 50 }),
  organicMatter: varchar("organic_matter", { length: 50 }),
  zinc: varchar("zinc", { length: 50 }),
  boron: varchar("boron", { length: 50 }),
  sulfur: varchar("sulfur", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SoilTest = typeof soilTests.$inferSelect;
export type InsertSoilTest = typeof soilTests.$inferInsert;

/**
 * Fertilizer recommendations based on crop and soil
 */
export const fertilizerRecommendations = mysqlTable("fertilizer_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("field_id").notNull(),
  userId: int("user_id").notNull(),
  cropName: varchar("crop_name", { length: 100 }).notNull(),
  season: varchar("season", { length: 50 }),
  yieldGoal: varchar("yield_goal", { length: 50 }),
  recommendationSource: varchar("recommendation_source", { length: 50 }),
  confidenceLevel: varchar("confidence_level", { length: 50 }),
  npkRecommendation: text("npk_recommendation"),
  micronutrients: text("micronutrients"),
  organicFertilizer: text("organic_fertilizer"),
  chemicalFertilizer: text("chemical_fertilizer"),
  bioFertilizer: text("bio_fertilizer"),
  limingRecommendation: text("liming_recommendation"),
  applicationSchedule: text("application_schedule"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FertilizerRecommendation = typeof fertilizerRecommendations.$inferSelect;
export type InsertFertilizerRecommendation = typeof fertilizerRecommendations.$inferInsert;

/**
 * Farmer activity records (fertilizer application, irrigation, etc.)
 */
export const activityRecords = mysqlTable("activity_records", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("field_id").notNull(),
  userId: int("user_id").notNull(),
  activityType: varchar("activity_type", { length: 50 }).notNull(),
  activityDate: timestamp("activity_date"),
  cropName: varchar("crop_name", { length: 100 }),
  description: text("description"),
  quantity: varchar("quantity", { length: 50 }),
  unit: varchar("unit", { length: 50 }),
  cost: varchar("cost", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ActivityRecord = typeof activityRecords.$inferSelect;
export type InsertActivityRecord = typeof activityRecords.$inferInsert;

/**
 * Chat messages between user and AI assistant
 */
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  fieldId: int("field_id"),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  language: varchar("language", { length: 10 }).default("en"),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * Yield/harvest records for tracking productivity
 */
export const yields = mysqlTable("yields", {
  id: int("id").autoincrement().primaryKey(),
  fieldId: int("field_id").notNull(),
  userId: int("user_id").notNull(),
  cropName: varchar("crop_name", { length: 100 }).notNull(),
  season: varchar("season", { length: 50 }),
  harvestDate: timestamp("harvest_date"),
  quantityProduced: varchar("quantity_produced", { length: 50 }).notNull(),
  unit: varchar("unit", { length: 50 }).notNull(),
  expectedYield: varchar("expected_yield", { length: 50 }),
  yieldPercentage: varchar("yield_percentage", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Yield = typeof yields.$inferSelect;
export type InsertYield = typeof yields.$inferInsert;
