import type { Express } from "express";
import { z } from "zod";
import * as db from "./db";
import { createContext } from "./_core/context";
import { streamSoilExpertResponse } from "./llm-chat";

const streamInput = z.object({
  fieldId: z.number().int().positive().optional(),
  language: z.enum(["en", "bn"]).default("en"),
  message: z.string().trim().min(1).max(4000),
});

export function registerChatStreamRoute(app: Express) {
  app.post("/api/chat/stream", async (req, res) => {
    const context = await createContext({ req, res } as never);
    if (!context.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const parsed = streamInput.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid chat request" });
      return;
    }

    const { fieldId, language, message } = parsed.data;
    const field = fieldId ? await db.getUserFieldById(context.user.id, fieldId) : undefined;
    if (fieldId && !field) {
      res.status(404).json({ error: "Field not found" });
      return;
    }

    await db.createChatMessage({ userId: context.user.id, fieldId, role: "user", language, message });
    res.status(200).set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" });
    res.flushHeaders();

    let clientClosed = false;
    req.on("close", () => { clientClosed = true; });
    const send = (payload: unknown) => {
      if (!clientClosed) res.write(`data: ${JSON.stringify(payload)}\n\n`);
    };

    try {
      const assistantMessage = await streamSoilExpertResponse(message, language, field ? {
        fieldName: field.fieldName || undefined,
        aezCode: field.aezCode || undefined,
        soilTexture: field.soilTexture || undefined,
        soilPH: field.soilPH || undefined,
        organicMatter: field.organicMatter || undefined,
      } : undefined, token => send({ type: "token", token }));
      await db.createChatMessage({ userId: context.user.id, fieldId, role: "assistant", language, message: assistantMessage });
      send({ type: "done" });
    } catch (error) {
      console.error("Streaming chat error:", error);
      send({ type: "error", message: "Failed to generate AI response. Please try again later." });
    } finally {
      if (!res.writableEnded) res.end();
    }
  });
}
