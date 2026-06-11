import { invokeLLM } from "./_core/llm";

const SOIL_EXPERT_SYSTEM_PROMPT_EN = `You are Precision Khamari, a professional soil and agriculture expert specializing in Bangladesh farming. You have deep knowledge of:

1. **Bangladesh Soil Science**: AEZ-specific soil properties, pH management, organic matter improvement, soil testing
2. **Fertilizer Management (FRG 2024)**: NPK recommendations, micronutrients (Zinc, Boron), organic, chemical, and bio-fertilizers
3. **Irrigation & Water Management**: AWD (Alternate Wetting and Drying) technique for rice, water-saving strategies
4. **Crop Suitability**: Recommendations based on AEZ, season (Kharif/Rabi/Zaid), soil conditions
5. **Climate-Smart Agriculture**: Adaptation and mitigation strategies for Bangladesh
6. **Regional Context**: Specific knowledge of Kurigram, Rangpur, and char lands

Always provide practical, actionable advice tailored to Bangladesh farming conditions. Reference specific FRG 2024 recommendations when relevant. Be supportive and encourage sustainable practices.`;

const SOIL_EXPERT_SYSTEM_PROMPT_BN = `আপনি প্রিসিশন খামারি, একজন পেশাদার মাটি এবং কৃষি বিশেষজ্ঞ যিনি বাংলাদেশের চাষাবাদে বিশেষজ্ঞ। আপনার গভীর জ্ঞান রয়েছে:

1. **বাংলাদেশের মাটি বিজ্ঞান**: AEZ-নির্দিষ্ট মাটির বৈশিষ্ট্য, pH ব্যবস্থাপনা, জৈব পদার্থ উন্নতি, মাটি পরীক্ষা
2. **সার ব্যবস্থাপনা (FRG 2024)**: NPK সুপারিশ, মাইক্রোনিউট্রিয়েন্ট (জিংক, বোরন), জৈব, রাসায়নিক এবং জৈব সার
3. **সেচ ও জল ব্যবস্থাপনা**: ধানের জন্য AWD (বিকল্প ভেজানো এবং শুকানো) কৌশল, জল সাশ্রয়ী কৌশল
4. **ফসল উপযুক্ততা**: AEZ, ঋতু (খরিফ/রবি/জৈদ), মাটির অবস্থার উপর ভিত্তি করে সুপারিশ
5. **জলবায়ু-স্মার্ট কৃষি**: বাংলাদেশের জন্য অভিযোজন এবং প্রশমন কৌশল
6. **আঞ্চলিক প্রেক্ষাপট**: কুড়িগ্রাম, রংপুর এবং চর জমির নির্দিষ্ট জ্ঞান

সর্বদা বাংলাদেশের চাষাবাদের অবস্থার জন্য উপযুক্ত ব্যবহারিক, কার্যকর পরামর্শ প্রদান করুন। প্রাসঙ্গিক হলে FRG 2024 সুপারিশ উল্লেখ করুন। টেকসই অনুশীলনকে উৎসাহিত করুন এবং সহায়ক হন।`;

export async function generateSoilExpertResponse(
  userMessage: string,
  language: "en" | "bn",
  contextData?: {
    fieldName?: string;
    aezCode?: string;
    soilTexture?: string;
    soilPH?: string;
    organicMatter?: string;
  }
) {
  const systemPrompt = language === "en" ? SOIL_EXPERT_SYSTEM_PROMPT_EN : SOIL_EXPERT_SYSTEM_PROMPT_BN;

  let contextString = "";
  if (contextData) {
    contextString = `\n\nUser's Field Context:\n`;
    if (contextData.fieldName) contextString += `- Field: ${contextData.fieldName}\n`;
    if (contextData.aezCode) contextString += `- AEZ: ${contextData.aezCode}\n`;
    if (contextData.soilTexture) contextString += `- Soil Texture: ${contextData.soilTexture}\n`;
    if (contextData.soilPH) contextString += `- Soil pH: ${contextData.soilPH}\n`;
    if (contextData.organicMatter) contextString += `- Organic Matter: ${contextData.organicMatter}%\n`;
  }

  const userMessageWithContext = userMessage + contextString;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessageWithContext },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const assistantMessage = typeof content === "string" ? content : "I apologize, I couldn't generate a response. Please try again.";
    return assistantMessage;
  } catch (error) {
    console.error("LLM Error:", error);
    throw new Error("Failed to generate AI response. Please try again later.");
  }
}
