import { GoogleGenAI, Type, Content } from "@google/genai";
import { AnalysisResponse, AiSuggestion, AutofillConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProjectIdea = async (idea: string): Promise<AnalysisResponse> => {
  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      You are the Lead Architect at Timace Studio v2. 
      We are an async, productized development studio that uses agentic AI (Gemini 3 Pro, Claude Opus) guided by human vision.
      We build MVPs in 1 hour. We value speed, transparency, and no-nonsense execution.
      
      Analyze the user's project idea. Provide a JSON response with:
      1. Feasibility (High/Medium/Low) based on our 1-hour prototype promise.
      2. Recommended Stack (React, Tailwind, Supabase, etc.).
      3. Estimated Timeline (e.g., "1 Hour Prototype", "2 Days MVP").
      4. Agentic Insight: A brief, sharp comment on how an AI Agent would execute a specific part of this build autonomously.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: idea,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feasibility: { type: Type.STRING },
            stackRecommendation: { type: Type.STRING },
            estimatedTimeline: { type: Type.STRING },
            agenticInsight: { type: Type.STRING },
          },
          required: ["feasibility", "stackRecommendation", "estimatedTimeline", "agenticInsight"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

export const getChatResponse = async (history: { role: 'user' | 'model', text: string }[], message: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    
    // Convert simplified history to SDK Content format
    const contents: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
        model,
        config: {
            systemInstruction: "You are the AI Support Agent for Timace Studio v2. We are an async productized studio. We build prototypes in 1 hour. Pricing is fixed. Communication is async. Be helpful, concise, and professional. If you don't know the answer, advise them to submit a ticket or message the studio team directly."
        },
        history: contents
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I apologize, I couldn't process that request.";
  } catch (error) {
    console.error("Chat Error", error);
    return "Connection error. Please try again or contact human support.";
  }
};

export const generateCheckoutSuggestions = async (products: string[], userNotes: string): Promise<AiSuggestion[]> => {
  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      You are a Product Strategy Agent for Timace Studio. 
      The user is buying: ${products.join(", ")}.
      User notes: "${userNotes}".
      
      Suggest 3 specific, high-value technical features or architectural choices that would improve their project.
      Keep it brief and actionable.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: "Generate suggestions based on the user notes.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
               featureName: { type: Type.STRING },
               reasoning: { type: Type.STRING }
             },
             required: ["featureName", "reasoning"]
          }
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as AiSuggestion[];
  } catch (error) {
    console.error("Suggestion Error", error);
    return [
      { featureName: "Supabase Auth", reasoning: "Robust user management out of the box." },
      { featureName: "Vercel Edge Functions", reasoning: "Lowest latency for global users." }
    ];
  }
};

export const autofillProjectConfig = async (
  items: { index: number; name: string; type: string; availableFields: string[] }[],
  userDescription: string
): Promise<AutofillConfig[]> => {
  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      You are a Configuration Agent for Timace Studio.
      Your goal is to infer the best technical and design choices for a project based on the user's description.
      
      User Description: "${userDescription}"
      
      For each item in the cart, select the best option from the 'availableFields' (implied) for that specific field key.
      Return a value that creates a cohesive product.
      
      Example Fields:
      - 'aesthetic': 'Minimal', 'Brutalist', 'Corporate', 'Playful', 'Dark Mode'
      - 'typography': 'Sans Serif (Inter)', 'Serif (Playfair)', 'Monospace (JetBrains)'
      - 'auth_provider': 'Supabase', 'Firebase', 'Clerk', 'None'
      - 'primary_color': 'Blue', 'Green', 'Purple', 'Orange', 'Black/White'
      
      Return a JSON array where each object has the item index and a 'config' object mapping field keys to values.
      Only return values that are reasonable based on the description.
    `;

    // Construct a prompt detailing what fields need filling
    let prompt = "Please configure these items:\n";
    items.forEach(item => {
      prompt += `Item ${item.index} (${item.name}): Fields to fill: ${item.availableFields.join(', ')}\n`;
    });

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
             type: Type.OBJECT,
             properties: {
               itemId: { type: Type.INTEGER },
               config: { 
                 type: Type.OBJECT,
                 properties: {
                    aesthetic: { type: Type.STRING, nullable: true },
                    typography: { type: Type.STRING, nullable: true },
                    primary_color: { type: Type.STRING, nullable: true },
                    auth_provider: { type: Type.STRING, nullable: true },
                    database: { type: Type.STRING, nullable: true },
                    payments: { type: Type.STRING, nullable: true },
                 }
               }
             },
             required: ["itemId", "config"]
          }
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as AutofillConfig[];

  } catch (error) {
    console.error("Autofill Error", error);
    return [];
  }
};