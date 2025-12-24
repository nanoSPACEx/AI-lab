import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ArtConcept, ArtConceptResult, ChatResponse, WebSource } from "../types";

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

const extractSources = (response: GenerateContentResponse): WebSource[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return [];
  
  return chunks
    .filter(chunk => chunk.web?.uri && chunk.web?.title)
    .map(chunk => ({
      uri: chunk.web!.uri!,
      title: chunk.web!.title!
    }));
};

export const generateArtConcept = async (difficulty: string, focus: string, topic?: string): Promise<ArtConceptResult> => {
  const prompt = `
    Actua com un professor d'arts plàstiques creatiu. Genera una idea de projecte artístic per a un estudiant de nivell ${difficulty}.
    L'enfocament principal ha de ser: ${focus}.
    ${topic ? `IMPORTANT: El projecte ha d'estar basat o inspirat en el tema: "${topic}". Utilitza Google Search per trobar referències reals, artistes o context si cal.` : ''}
    
    Retorna la resposta EXCLUSIVAMENT en format JSON amb aquesta estructura, sense text addicional fora del JSON (no incloguis explicacions prèvies ni posteriors):
    {
      "theme": "Nom del tema (en català)",
      "technique": "Tècnica suggerida (en català)",
      "material": "Materials necessaris (en català)",
      "description": "Una breu explicació inspiradora del projecte (en català)"
    }
  `;

  try {
    // When using tools, we cannot strictly enforce responseMimeType: "application/json" as it might conflict with tool output text.
    // We rely on the prompt to ensure JSON output.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    const text = response.text || "{}";
    const concept = cleanAndParseJson<ArtConcept>(text);
    const sources = extractSources(response);

    return { concept, sources };
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

export const chatWithArtHistorian = async (history: {role: string, parts: {text: string}[]}[], message: string): Promise<ChatResponse> => {
  try {
    const chat = ai.chats.create({
      model: MODEL_TEXT,
      history: history,
      config: {
        systemInstruction: "Ets un expert en Història de l'Art i professor de secundària. Respon als dubtes dels estudiants de manera didàctica, precisa i sempre en català. Utilitza Google Search per trobar informació actualitzada sobre exposicions, descobriments recents o dades precises si és necessari.",
        tools: [{ googleSearch: {} }]
      }
    });

    const response = await chat.sendMessage({ message: message });
    const sources = extractSources(response);

    return { 
      text: response.text || "",
      sources: sources
    };
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};