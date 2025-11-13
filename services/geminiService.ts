
import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapNode } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Please set it to use the Gemini API.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const nodeSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The name of this stage, skill, or concept.",
        },
        description: {
            type: Type.STRING,
            description: "A detailed description of what this involves and why it's important.",
        },
        resources: {
            type: Type.ARRAY,
            description: "A list of helpful learning resources like URLs, books, or courses.",
            items: { type: Type.STRING },
        },
        salaryExpectations: {
            type: Type.STRING,
            description: "Typical salary range for this role or stage, if applicable.",
        },
        careerProgression: {
            type: Type.STRING,
            description: "Description of the career progression from this stage over the next 5-10 years, if applicable.",
        },
        children: {
            type: Type.ARRAY,
            description: "A list of sub-steps, more detailed skills, or specializations.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    resources: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    },
                    salaryExpectations: { type: Type.STRING },
                    careerProgression: { type: Type.STRING },
                    children: {
                        type: Type.ARRAY,
                        items: {
                           type: Type.OBJECT,
                           properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING },
                                resources: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                },
                                salaryExpectations: { type: Type.STRING },
                                careerProgression: { type: Type.STRING },
                           }
                        },
                    },
                },
            },
        },
    },
    required: ["name", "description"],
};


const roadmapSchema = {
    type: Type.OBJECT,
    properties: {
        name: {
            type: Type.STRING,
            description: "The title of the overall career path.",
        },
        description: {
            type: Type.STRING,
            description: "A brief summary of this career path.",
        },
        children: {
            type: Type.ARRAY,
            description: "The main stages or foundational areas of this career path.",
            items: nodeSchema,
        },
    },
    required: ["name", "description", "children"],
};


export const generateRoadmap = async (interests: string): Promise<RoadmapNode> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Generate a detailed, tree-structured career roadmap for a student whose interests are: "${interests}". The roadmap should start with foundational knowledge and branch out into specializations. For relevant job roles or senior stages, include typical salary expectations and a brief overview of the career progression in the coming years based on the current market.`,
      config: {
        systemInstruction: "You are an expert career counselor. Your task is to create a detailed, step-by-step career roadmap for a student based on their interests. The roadmap should be structured as a tree, starting from foundational steps to advanced specializations. For relevant roles, you must include salary expectations and career progression projections. Provide clear descriptions and suggest helpful resources for each step. Output in the requested JSON format.",
        responseMimeType: "application/json",
        responseSchema: roadmapSchema,
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as RoadmapNode;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw new Error("Failed to generate career roadmap. Please check your API key and try again.");
  }
};

export const getGroundedInfo = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.filter(
      (chunk: any) => chunk.web
    ) || [];

    return { text: response.text, sources };
  } catch (error) {
    console.error("Error getting grounded info:", error);
    throw new Error("Failed to get information from Google Search. Please check your API key and try again.");
  }
};