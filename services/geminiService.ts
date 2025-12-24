import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ArtConcept, AnalysisResult } from "../types";

const apiKey = process.env.API_KEY;
// Initialize the client. The key is guaranteed to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: apiKey });

const MODEL_TEXT = "gemini-3-flash-preview";

// Helper to parse potential JSON from text that might contain markdown code blocks
const cleanAndParseJson = <T>(text: string): T => {
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleanText) as T;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("La resposta de la IA no s'ha pogut processar correctament.");
  }
};

export const generateArtConcept = async (difficulty: string, focus: string): Promise<ArtConcept> => {
  const prompt = `
    Actua com un professor d'arts plàstiques creatiu. Genera una idea de projecte artístic per a un estudiant de nivell ${difficulty}.
    L'enfocament principal ha de ser: ${focus}.
    
    Retorna la resposta EXCLUSIVAMENT en format JSON amb aquesta estructura, sense text addicional:
    {
      "theme": "Nom del tema (en català)",
      "technique": "Tècnica suggerida (en català)",
      "material": "Materials necessaris (en català)",
      "description": "Una breu explicació inspiradora del projecte (en català)"
    }
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const text = response.text || "{}";
    return cleanAndParseJson<ArtConcept>(text);
  } catch (error) {
    console.error("Error generating concept:", error);
    throw error;
  }
};

export const analyzeImage = async (base64Image: string, userPrompt?: string): Promise<string> => {
  const defaultPrompt = "Analitza aquesta imatge des d'una perspectiva artística pedagògica. Parla de la composició, l'ús del color, i la tècnica. Sigues constructiu i utilitza un to educatiu en català.";
  const finalPrompt = userPrompt ? `${defaultPrompt} A més, respon a: ${userPrompt}` : defaultPrompt;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity, or detect from file
              data: base64Image
            }
          },
          { text: finalPrompt }
        ]
      }
    });

    return response.text || "No s'ha pogut analitzar la imatge.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const chatWithArtHistorian = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_TEXT,
      history: history,
      config: {
        systemInstruction: "Ets un expert en Història de l'Art i professor de secundària. Respon als dubtes dels estudiants de manera didàctica, precisa i sempre en català. Fomenta el pensament crític."
      }
    });

    const result = await chat.sendMessage({ message: message });
    return result.text || "";
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};