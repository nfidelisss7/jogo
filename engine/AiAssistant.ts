
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "missing_key" });

export interface AiResponse {
  text: string;
  groundingMetadata?: any;
  image?: string;
}

export class AiAssistant {
  
  static async queryTheVoid(prompt: string, options: { useSearch?: boolean, useThinking?: boolean } = {}): Promise<AiResponse> {
    try {
      let model = "gemini-3-pro-preview";
      let tools: any[] | undefined = undefined;
      let thinkingConfig: any | undefined = undefined;

      // Feature: Search Grounding
      if (options.useSearch) {
        model = "gemini-3-flash-preview"; // Per instructions for Search
        tools = [{ googleSearch: {} }];
      } 
      // Feature: Thinking Mode
      else if (options.useThinking) {
        model = "gemini-3-pro-preview";
        thinkingConfig = { thinkingBudget: 32768 }; // Max budget for deep thought
      }

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: `You are the "Void Grimoire", a dark, sentient book of eldritch knowledge in the game "Eldritch Survivor: Void Rebirth". 
          Your tone is gothic, mysterious, and helpful. You provide players with deep strategic advice, lore about enemy archetypes (Blood Hounds, Shadow Wraiths, Void Imps), 
          and weapon synergies. Keep responses atmospheric but concise. If asked about game mechanics, explain them through the lens of dark magic.`,
          tools: tools,
          thinkingConfig: thinkingConfig
        },
      });

      return {
        text: response.text || "The Void remains silent...",
        groundingMetadata: response.candidates?.[0]?.groundingMetadata
      };

    } catch (error) {
      console.error("The Void is silent...", error);
      return { text: "The whispers of the Void are garbled. Try again, mortal." };
    }
  }

  // Feature: Nano Banana Image Editing
  static async distortReality(base64Image: string, prompt: string): Promise<string | null> {
    try {
      // Clean base64 string if needed
      const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: 'image/png',
              },
            },
            {
              text: prompt,
            },
          ],
        },
        // Note: responseMimeType is not supported for nano banana
      });

      // Find image part in response
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Reality distortion failed:", error);
      return null;
    }
  }
}
