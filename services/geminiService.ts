import { GoogleGenAI, Type } from "@google/genai";
import { Subject } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTutorResponse = async (
  message: string,
  subject: Subject,
  history: string[] = []
): Promise<string> => {
  try {
    const prompt = `
      You are "Prof. Nexus", an advanced AI science tutor for high school students (grades 9-12).
      Current Subject: ${subject}.
      
      Guidelines:
      1. Provide accurate, academic explanations suitable for AP/IB level.
      2. Use scientific terminology, formulas, and constants where applicable.
      3. Keep responses concise but insightful (max 4 sentences unless asked for derivation).
      4. Encourage critical thinking and inquiry.
      
      History: ${history.join('\n')}
      Student asks: ${message}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I am currently calibrating my knowledge base. Please try again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection to the research database interrupted.";
  }
};

export const simulateChemicalReaction = async (r1: string, r2: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Simulate a chemical reaction between ${r1} and ${r2}.
        Return a JSON object with:
        - balancedEquation: The full balanced chemical equation (e.g., 2H2 + O2 -> 2H2O).
        - products: Array of product names.
        - observation: Visual/physical changes (precipitate, gas evolution, color change).
        - type: Reaction type (e.g., Single Replacement, Neutralization, Redox).
        - enthalpy: "Exothermic", "Endothermic", or "Neutral".
        
        If no reaction occurs, state "No Reaction" in observation.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                balancedEquation: { type: Type.STRING },
                products: { type: Type.ARRAY, items: { type: Type.STRING } },
                observation: { type: Type.STRING },
                type: { type: Type.STRING },
                enthalpy: { type: Type.STRING }
            }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { 
        balancedEquation: "Error in simulation", 
        products: [], 
        observation: "Simulation failed", 
        type: "Unknown",
        enthalpy: "Unknown"
    };
  }
};

export const analyzeGenetics = async (trait: string, p1: string, p2: string): Promise<{ explanation: string, ratios: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
            Analyze a genetic cross for the trait: "${trait}".
            Parent 1 Genotype: ${p1}.
            Parent 2 Genotype: ${p2}.
            
            Return JSON:
            - explanation: A brief explanation of the inheritance pattern (Dominant/Recessive, Codominance, etc.) and the resulting phenotypes.
            - ratios: The Genotypic and Phenotypic ratios (e.g., "1:2:1 Genotype, 3:1 Phenotype").
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        explanation: { type: Type.STRING },
                        ratios: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text || '{}');
    } catch (e) {
        return { explanation: "Genetic analysis unavailable.", ratios: "N/A" };
    }
}

export const evolveOrganism = async (environment: string): Promise<{ scientificName: string, traits: string[], adaptationAnalysis: string }> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
             Design a hypothetical organism evolved to survive in this environment: ${environment}.
             Return JSON:
             - scientificName: A Latin-sounding biological name.
             - traits: A list of 3-4 specific physiological or behavioral adaptations.
             - adaptationAnalysis: A paragraph explaining how natural selection favored these traits based on the environmental pressures.
            `,
            config: {
                responseMimeType: "application/json",
                 responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scientificName: { type: Type.STRING },
                        traits: { type: Type.ARRAY, items: { type: Type.STRING } },
                        adaptationAnalysis: { type: Type.STRING }
                    }
                }
            }
        });
         return JSON.parse(response.text || '{}');
    } catch (e) {
        return { scientificName: "Specimen Unknown", traits: [], adaptationAnalysis: "Data corrupted." };
    }
}
