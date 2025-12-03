import { GoogleGenAI, Type } from "@google/genai";
import { Subject, EducationLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTutorResponse = async (
  message: string,
  subject: Subject,
  level: EducationLevel,
  history: string[] = []
): Promise<string> => {
  try {
    let systemInstruction = "";
    
    switch (level) {
        case EducationLevel.ELEMENTARY:
            systemInstruction = `You are "Professor Spark", a fun, energetic, and encouraging science guide for elementary school kids (ages 6-10).
            - Use simple words, analogies, and emojis 🌟.
            - Keep answers very short (1-2 sentences).
            - Focus on the "Wow!" factor of science.
            - Never use complex formulas.`;
            break;
        case EducationLevel.MIDDLE:
            systemInstruction = `You are "The Science Detective", a helpful guide for middle schoolers (ages 11-14).
            - Explain *why* things happen using clear logic.
            - Use real-world examples (sports, video games, nature).
            - Introduce basic terms but explain them immediately.
            - Encourage them to experiment.`;
            break;
        case EducationLevel.HIGH:
        default:
            systemInstruction = `You are "Prof. Nexus", an advanced AI science tutor for high school students (grades 9-12).
            - Provide accurate, academic explanations suitable for AP/IB level.
            - Use scientific terminology, formulas, and constants.
            - Encourage critical thinking.`;
            break;
    }

    const prompt = `
      ${systemInstruction}
      Current Subject: ${subject}.
      
      History: ${history.join('\n')}
      Student asks: ${message}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I'm thinking! Try asking again.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "My connection is a bit fuzzy. Can you ask that again?";
  }
};

export const simulateChemicalReaction = async (r1: string, r2: string, level: EducationLevel): Promise<any> => {
  try {
    const complexityPrompt = level === EducationLevel.ELEMENTARY 
        ? "Explain the observation simply for a 7 year old (e.g. 'It bubbled!', 'It turned blue!'). Do not use chemical equations in the observation." 
        : "Provide a standard scientific observation.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Simulate a chemical reaction between ${r1} and ${r2}.
        Target Audience: ${level}.
        ${complexityPrompt}
        
        Return a JSON object with:
        - balancedEquation: The chemical equation (if High School, provide balanced; if Elementary/Middle, provide word equation like "Vinegar + Baking Soda -> Gas").
        - products: Array of product names.
        - observation: Visual description of what happens.
        - type: Reaction type (e.g., Single Replacement, Neutralization).
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
        balancedEquation: "Error", 
        products: [], 
        observation: "Simulation failed", 
        type: "Unknown",
        enthalpy: "Unknown"
    };
  }
};

export const analyzeGenetics = async (trait: string, p1: string, p2: string, level: EducationLevel): Promise<{ explanation: string, ratios: string }> => {
    try {
        const promptContext = level === EducationLevel.ELEMENTARY 
            ? "Explain it like a story for a child. Don't use percentages, use words like 'Most likely' or 'Rarely'." 
            : "Provide a scientific analysis with genotypic/phenotypic ratios.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
            Analyze a genetic cross for: "${trait}".
            Parent 1: ${p1}.
            Parent 2: ${p2}.
            Context: ${promptContext}
            
            Return JSON:
            - explanation: A brief explanation of what the babies might look like.
            - ratios: The ratios or probability summary.
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

export const evolveOrganism = async (environment: string, level: EducationLevel): Promise<{ scientificName: string, traits: string[], adaptationAnalysis: string }> => {
    try {
        const complexity = level === EducationLevel.ELEMENTARY 
            ? "Create a cool, imaginary creature name. Explain traits simply (e.g. 'Big feet to walk on snow')."
            : "Use Latin scientific naming conventions. Explain evolutionary pressures and physiological adaptations.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
             Design an organism for this environment: ${environment}.
             Target Audience: ${level}.
             ${complexity}
             
             Return JSON:
             - scientificName: Name of the organism.
             - traits: A list of 3-4 specific body parts or behaviors.
             - adaptationAnalysis: Why it looks this way.
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