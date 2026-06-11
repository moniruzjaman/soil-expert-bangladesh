import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { aezSoilData, fertilizerRecommendationData, cropSuitabilityMatrix, croppingPatterns, irrigationAdvisory, soilRechargingStrategies } from "./data/aezData";
import { generateSoilExpertResponse } from "./llm-chat";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * AEZ and Soil Profile procedures
   */
  aez: router({
    getAllProfiles: publicProcedure.query(async () => {
      const profiles = await db.getAllAezSoilProfiles();
      if (profiles.length === 0) {
        // Seed default AEZ data if empty
        for (const aezData of aezSoilData) {
          try {
            await db.getDb().then(dbInstance => {
              if (dbInstance) {
                return dbInstance.insert(require("../drizzle/schema").aezSoilProfiles).values(aezData);
              }
            });
          } catch (error) {
            console.error("Error seeding AEZ data:", error);
          }
        }
        return aezSoilData;
      }
      return profiles;
    }),

    getByCode: publicProcedure
      .input(z.object({ aezCode: z.string() }))
      .query(async ({ input }) => {
        const profile = await db.getAezSoilProfileByCode(input.aezCode);
        if (!profile) {
          const defaultData = aezSoilData.find(d => d.aezCode === input.aezCode);
          return defaultData || null;
        }
        return profile;
      }),

    getCropSuitability: publicProcedure
      .input(z.object({ aezCode: z.string() }))
      .query(({ input }) => {
        return cropSuitabilityMatrix[input.aezCode as keyof typeof cropSuitabilityMatrix] || null;
      }),

    getCroppingPatterns: publicProcedure
      .input(z.object({ aezCode: z.string() }))
      .query(({ input }) => {
        return croppingPatterns[input.aezCode as keyof typeof croppingPatterns] || [];
      }),
  }),

  /**
   * Field management procedures
   */
  fields: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserFields(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        fieldName: z.string(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        aezCode: z.string().optional(),
        areaInBigha: z.string().optional(),
        soilTexture: z.string().optional(),
        landType: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createField({
          userId: ctx.user.id,
          fieldName: input.fieldName,
          latitude: input.latitude,
          longitude: input.longitude,
          aezCode: input.aezCode,
          areaInBigha: input.areaInBigha,
          soilTexture: input.soilTexture,
          landType: input.landType,
          notes: input.notes,
        });
      }),

    getById: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return await db.getFieldById(input.fieldId);
      }),
  }),

  /**
   * Soil test procedures
   */
  soilTest: router({
    getFieldTests: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return await db.getFieldSoilTests(input.fieldId);
      }),

    create: protectedProcedure
      .input(z.object({
        fieldId: z.number(),
        testDate: z.date().optional(),
        soilPH: z.string().optional(),
        nitrogen: z.string().optional(),
        phosphorus: z.string().optional(),
        potassium: z.string().optional(),
        organicMatter: z.string().optional(),
        zinc: z.string().optional(),
        boron: z.string().optional(),
        sulfur: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createSoilTest({
          userId: ctx.user.id,
          fieldId: input.fieldId,
          testDate: input.testDate,
          soilPH: input.soilPH,
          nitrogen: input.nitrogen,
          phosphorus: input.phosphorus,
          potassium: input.potassium,
          organicMatter: input.organicMatter,
          zinc: input.zinc,
          boron: input.boron,
          sulfur: input.sulfur,
          notes: input.notes,
        });
      }),
  }),

  /**
   * Fertilizer recommendation procedures
   */
  fertilizer: router({
    getRecommendationData: publicProcedure
      .input(z.object({ cropName: z.string() }))
      .query(({ input }) => {
        return fertilizerRecommendationData[input.cropName as keyof typeof fertilizerRecommendationData] || null;
      }),

    getFieldRecommendations: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return await db.getFieldFertilizerRecommendations(input.fieldId);
      }),

    create: protectedProcedure
      .input(z.object({
        fieldId: z.number(),
        cropName: z.string(),
        season: z.string().optional(),
        yieldGoal: z.string().optional(),
        recommendationSource: z.string().optional(),
        confidenceLevel: z.string().optional(),
        npkRecommendation: z.string().optional(),
        micronutrients: z.string().optional(),
        organicFertilizer: z.string().optional(),
        chemicalFertilizer: z.string().optional(),
        bioFertilizer: z.string().optional(),
        limingRecommendation: z.string().optional(),
        applicationSchedule: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createFertilizerRecommendation({
          userId: ctx.user.id,
          fieldId: input.fieldId,
          cropName: input.cropName,
          season: input.season,
          yieldGoal: input.yieldGoal,
          recommendationSource: input.recommendationSource,
          confidenceLevel: input.confidenceLevel,
          npkRecommendation: input.npkRecommendation,
          micronutrients: input.micronutrients,
          organicFertilizer: input.organicFertilizer,
          chemicalFertilizer: input.chemicalFertilizer,
          bioFertilizer: input.bioFertilizer,
          limingRecommendation: input.limingRecommendation,
          applicationSchedule: input.applicationSchedule,
          notes: input.notes,
        });
      }),
  }),

  /**
   * Irrigation advisory procedures
   */
  irrigation: router({
    getAdvisory: publicProcedure
      .input(z.object({ cropName: z.string() }))
      .query(({ input }) => {
        return irrigationAdvisory[input.cropName as keyof typeof irrigationAdvisory] || null;
      }),
  }),

  /**
   * Soil recharging and organic matter procedures
   */
  soilRecharging: router({
    getStrategies: publicProcedure.query(() => {
      return soilRechargingStrategies;
    }),
  }),

  /**
   * Activity record procedures
   */
  activity: router({
    getFieldRecords: protectedProcedure
      .input(z.object({ fieldId: z.number() }))
      .query(async ({ input }) => {
        return await db.getFieldActivityRecords(input.fieldId);
      }),

    create: protectedProcedure
      .input(z.object({
        fieldId: z.number(),
        activityType: z.string(),
        activityDate: z.date().optional(),
        cropName: z.string().optional(),
        description: z.string().optional(),
        quantity: z.string().optional(),
        unit: z.string().optional(),
        cost: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createActivityRecord({
          userId: ctx.user.id,
          fieldId: input.fieldId,
          activityType: input.activityType,
          activityDate: input.activityDate,
          cropName: input.cropName,
          description: input.description,
          quantity: input.quantity,
          unit: input.unit,
          cost: input.cost,
          notes: input.notes,
        });
      }),
  }),

  /**
   * Chat procedures
   */
  chat: router({
    getMessages: protectedProcedure
      .input(z.object({ fieldId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserChatMessages(ctx.user.id, input.fieldId);
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        fieldId: z.number().optional(),
        language: z.enum(["en", "bn"]).default("en"),
        message: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.createChatMessage({
          userId: ctx.user.id,
          fieldId: input.fieldId,
          role: "user",
          language: input.language,
          message: input.message,
        });

        // Get field context if provided
        let fieldContext: { fieldName?: string; aezCode?: string; soilTexture?: string } | undefined = undefined;
        if (input.fieldId) {
          const field = await db.getFieldById(input.fieldId);
          if (field) {
            fieldContext = {
              fieldName: field.fieldName || undefined,
              aezCode: field.aezCode || undefined,
              soilTexture: field.soilTexture || undefined,
            };
          }
        }

        // Generate AI response using LLM
        const assistantMessage = await generateSoilExpertResponse(
          input.message,
          input.language,
          fieldContext
        );

        await db.createChatMessage({
          userId: ctx.user.id,
          fieldId: input.fieldId,
          role: "assistant",
          language: input.language,
          message: assistantMessage,
        });

        return {
          userMessage: input.message,
          assistantMessage: assistantMessage,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
