import { GoogleGenAI, Type } from "@google/genai";
import { BloomBrainActivity } from "../types/index.ts";

// Helper to check if API key exists without throwing
export const hasApiKey = () => !!process.env.API_KEY;

// Create fresh GoogleGenAI instance per request to maintain correct API key context
const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Utility to clean JSON strings from Gemini (strips markdown backticks if present)
const cleanJsonString = (jsonStr: string): string => {
  return jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const childPrompt = `
You are BloomBrain AI.
Speak gently.
Never rush.
Encourage curiosity.
If the child struggles, slow down.
Never judge.
Never compare.
Maintain a soft, calm, and nurturing tone at all times.
`;

const KID_FRIENDLY_SYSTEM = `You are BloomBuddy, a gentle, encouraging, and highly intelligent companion for children aged 4-12. 
${childPrompt}
Always use simple but accurate language. Be curious, positive, and safe. 
You must strictly adhere to a 'gentle' AI tone, avoiding any harsh or overly assertive language.
If asked about complex topics, explain them using analogies children understand. 
Do not generate any inappropriate, scary, or adult content. 
Encourage the child to ask more questions and explore their curiosity in a warm, patient manner.`;

export const getFastResponse = async (prompt: string): Promise<string> => {
  try {
    if (!hasApiKey()) return "I'm still waking up! Please ask a grown-up to help me with my magic key in the Guardian portal.";
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: KID_FRIENDLY_SYSTEM + " Provide a short, fun fact or quick answer. Use an explicitly gentle tone. If appropriate, ask the child a tiny follow-up question to keep them thinking."
      }
    });
    return response.text || 'Oops! I am thinking hard, try again!';
  } catch (e: any) {
    console.warn("Gemini Error:", e.message);
    if (e.message?.includes("finish_reason: SAFETY")) return "I'm not sure how to answer that safely, let's talk about something else like dinosaurs or space!";
    if (e.message === "MISSING_API_KEY") return "I need my magic key to think! Please check the Guardian portal.";
    return 'I had a tiny hiccup! Try asking me again?';
  }
};

/**
 * Generates a cognitive exercise tailored to the child's age and current performance level.
 */
export const generateCognitiveExercise = async (
  ageGroup: string, 
  focusSkill: string, 
  performanceLevel: number = 1,
  theme: string = "Nature Discovery"
): Promise<BloomBrainActivity | null> => {
  try {
    if (!hasApiKey()) return getFallbackActivity(ageGroup, focusSkill, theme);
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a fun cognitive exercise for a ${ageGroup} year old child.
      Theme: ${theme}. 
      Focus Skill: ${focusSkill}.
      Difficulty Level: ${performanceLevel} (1-10).

      Game Mechanics:
      1. 'sequence': Memory based. Provide 4-6 emojis in 'items'. 'solution' indices match memory order.
      2. 'matching': Attention based. 6 items, exactly two identical. 'solution' indices are the matches.
      3. 'odd_one_out': Logic based. 4-6 items, one different. 'solution' index is outlier.
      4. 'pattern_completion': Logic based. 3 items in a pattern (e.g. A-B-A), 4th is the answer index in 'items'.
      5. 'emotional_matching': EQ based. 'items' contains an emotional situation or emoji, 'solution' index is the matching feeling.

      Guidelines:
      - Use clear emojis.
      - Make customInstructions child-friendly.
      - Return JSON matching BloomBrainActivity.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            ageGroup: { type: Type.STRING },
            primarySkill: { 
              type: Type.STRING, 
              enum: ["working_memory", "attention", "emotion_regulation", "logic", "creativity", "metacognition"] 
            },
            researchBasis: { type: Type.ARRAY, items: { type: Type.STRING } },
            durationMinutes: { type: Type.NUMBER },
            difficultyLevel: { type: Type.NUMBER },
            adaptiveRule: { type: Type.STRING },
            aiTone: { type: Type.STRING, enum: ["gentle", "encouraging", "reflective"] },
            customInstructions: { type: Type.STRING },
            gameData: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["sequence", "matching", "odd_one_out", "pattern_completion", "emotional_matching"] },
                items: { type: Type.ARRAY, items: { type: Type.STRING } },
                solution: { type: Type.ARRAY, items: { type: Type.NUMBER } }
              },
              required: ["type", "items", "solution"]
            }
          },
          required: ["id", "name", "ageGroup", "primarySkill", "durationMinutes", "difficultyLevel", "customInstructions", "gameData"]
        }
      }
    });

    const json = JSON.parse(cleanJsonString(response.text || '{}'));
    return {
      ...json,
      id: `ai-${Date.now()}`,
      aiTone: json.aiTone || "encouraging"
    } as BloomBrainActivity;
  } catch (e: any) {
    console.warn("Gemini Quota Exceeded or API Error. Using Offline Fallback Mode.");
    return getFallbackActivity(ageGroup, focusSkill, theme);
  }
};

function getFallbackActivity(ageGroup: string, skill: string, theme: string): BloomBrainActivity {
  const fallbacks: Record<string, any> = {
    working_memory: {
      name: `${theme} Memory`,
      type: 'sequence',
      items: ['🍄', '🌸', '🌲', '🌟', '🐦', '🦋'],
      solution: [0, 2, 4],
      instruction: `Remember the order of these ${theme} items!`
    },
    attention: {
      name: `${theme} Match`,
      type: 'matching',
      items: ['🍎', '🍌', '🍎', '🍇', '🍉', '🍓'],
      solution: [0, 2],
      instruction: `Find the two ${theme} items that look exactly the same!`
    },
    logic: {
      name: `${theme} Outlier`,
      type: 'odd_one_out',
      items: ['🚗', '✈️', '🚢', '🥦'],
      solution: [3],
      instruction: `One of these ${theme} items doesn't belong. Can you find it?`
    },
    emotion_regulation: {
      name: `${theme} Feelings`,
      type: 'emotional_matching',
      items: ['🏠 (Safe)', '😱 (Scary)', '🥳 (Party)', '😔 (Alone)'],
      solution: [2],
      instruction: "How do you think the explorer feels at the party?"
    }
  };

  const selected = fallbacks[skill] || fallbacks['working_memory'];

  return {
    id: `fallback-${Date.now()}`,
    name: selected.name,
    ageGroup: ageGroup as any,
    primarySkill: skill as any,
    researchBasis: ["Offline redundancy logic"],
    durationMinutes: 3,
    difficultyLevel: 1,
    adaptiveRule: "Standard fallback",
    aiTone: "gentle",
    customInstructions: selected.instruction,
    gameData: {
      type: selected.type,
      items: selected.items,
      solution: selected.solution
    }
  };
}

export const getStoryHints = async (currentContext: string): Promise<string[]> => {
  try {
    if (!hasApiKey()) return ["Explore", "Say Hello", "Rest"];
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this story context: "${currentContext}", suggest 3 very short (2-4 words) possible next actions for a child to take in the story. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(cleanJsonString(response.text || '[]'));
  } catch (e) {
    return ["Go left", "Go right", "Open it"];
  }
};

export const getMapsResponse = async (query: string, location?: { latitude: number, longitude: number }) => {
  try {
    if (!hasApiKey()) return { text: "I need my magic key to see the world!", links: [] };
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `The child is looking for: ${query}. Help them find interesting, educational, and safe places to visit. Be very encouraging.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: location
          }
        }
      }
    });

    const text = response.text || "I found some interesting spots!";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links = chunks
      .filter((c: any) => c.maps)
      .map((c: any) => ({
        uri: c.maps.uri,
        title: c.maps.title || "View on Map"
      }));

    return { text, links };
  } catch (e) {
    return { text: "I'm having trouble finding places right now. Let's try later!", links: [] };
  }
};

export const createProChat = (systemInstruction?: string) => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction || KID_FRIENDLY_SYSTEM
    }
  });
};

export const analyzeVideo = async (videoBase64: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: videoBase64, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: KID_FRIENDLY_SYSTEM
    }
  });
  return response.text || 'Analysis failed.';
};

export const generateVeoVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  const ai = getAI();
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed to return a URI.");

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
     const errorText = await response.text();
     if (errorText.includes("Requested entity was not found")) {
        throw new Error("KEY_RESET_REQUIRED");
     }
     throw new Error(`Failed to fetch video: ${response.statusText}`);
  }
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const checkApiKey = async (): Promise<boolean> => {
  if (typeof window !== 'undefined' && (window as any).aistudio?.hasSelectedApiKey) {
    return await (window as any).aistudio.hasSelectedApiKey();
  }
  return hasApiKey();
};

export const requestApiKey = async (): Promise<void> => {
  if (typeof window !== 'undefined' && (window as any).aistudio?.openSelectKey) {
    await (window as any).aistudio.openSelectKey();
  }
};