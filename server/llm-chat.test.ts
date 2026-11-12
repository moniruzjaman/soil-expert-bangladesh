import { describe, expect, it } from "vitest";
import { buildSoilExpertMessages } from "./llm-chat";

describe("soil expert chat contract", () => {
  it("builds English prompts with complete field context", () => {
    const result = buildSoilExpertMessages("How should I improve this field?", "en", { fieldName: "North Field", aezCode: "AEZ-3", soilTexture: "Loam", soilPH: "5.8", organicMatter: "1.2" });
    expect(result.systemPrompt).toContain("Bangladesh farming");
    expect(result.userMessageWithContext).toContain("North Field");
    expect(result.userMessageWithContext).toContain("Soil pH: 5.8");
  });

  it("selects the Bangla system prompt", () => {
    const result = buildSoilExpertMessages("ধানের জন্য কী করব?", "bn");
    expect(result.systemPrompt).toContain("বাংলাদেশের চাষাবাদ");
    expect(result.userMessageWithContext).toContain("ধানের জন্য");
  });
});
