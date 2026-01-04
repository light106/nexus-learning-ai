import { GoogleGenAI, Type } from "@google/genai";
import { RoadmapData, RoadmapItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRoadmap = async (
  topics: string[],
  startDate: string,
  endDate: string,
  experienceLevel: string,
  hoursPerWeek: number
): Promise<RoadmapData> => {
  const prompt = `
    Create a comprehensive, step-by-step learning roadmap for the following topics: ${topics.join(
      ", "
    )}.
    The roadmap must start strictly on ${startDate} and end on ${endDate}.
    The user's current experience level is: ${experienceLevel}.
    The user can dedicate approximately ${hoursPerWeek} hours per week for study.
    
    Ensure the courses follow a logical progression (e.g., Math -> Python -> ML -> DL -> Specialized AI/Blockchain).
    Distribute the workload evenly across the specified year, ensuring the estimated hours for each item fit within the user's weekly availability (${hoursPerWeek} hours/week) for the duration of that item.

    For each roadmap item, provide 2-3 specific, high-quality learning resources.
    
    **CRITICAL RESOURCE LINKING RULES - STRICT ADHERENCE REQUIRED:**
    1. **NO BROKEN LINKS**: Do not hallucinate URLs. Only provide URLs for resources you are certain exist.
    2. **OFFICIAL SOURCES FIRST**:
       - Documentation: Link strictly to official docs (e.g., 'https://react.dev', 'https://pytorch.org/docs/stable/index.html').
       - GitHub: Link to official repos (e.g., 'https://github.com/tensorflow/tensorflow').
    3. **VERIFIED PLATFORMS**:
       - MOOCs: Use stable landing pages (e.g., 'https://www.coursera.org/learn/machine-learning', 'https://www.edx.org/course/...').
       - YouTube: Link to verified channels or well-known playlists (e.g., 'https://www.youtube.com/c/Freecodecamp').
    4. **FALLBACK STRATEGY**: If you are unsure of a specific deep link (like a specific blog post), provide the generic URL to the main documentation or the main topic page on a learning platform.
    5. **Avoid**:
       - 'localhost' links.
       - 'example.com' links.
       - Links to specific PDF files (they often break).
       - Paywalled articles (Medium, etc.) unless they are canonical.

    Return a valid JSON object strictly matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert curriculum developer. You act as a strict librarian who only provides verified, stable, and accessible URLs. You prioritize official documentation and renowned open-source courseware. You never provide broken or placeholder links.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A high-level executive summary of the learning path." },
            totalHours: { type: Type.NUMBER, description: "Total estimated hours of study for the entire year." },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  startDate: { type: Type.STRING, description: "YYYY-MM-DD format" },
                  endDate: { type: Type.STRING, description: "YYYY-MM-DD format" },
                  category: { 
                    type: Type.STRING, 
                    enum: ["Artificial Intelligence", "Machine Learning", "Data Science", "Blockchain", "General Programming"] 
                  },
                  difficulty: { 
                    type: Type.STRING, 
                    enum: ["Beginner", "Intermediate", "Advanced", "Expert"] 
                  },
                  estimatedHours: { type: Type.NUMBER },
                  keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendedResources: { 
                    type: Type.ARRAY, 
                    items: { 
                      type: Type.OBJECT, 
                      properties: {
                        title: { type: Type.STRING, description: "Title of the resource (e.g. 'Official React Docs')." },
                        url: { type: Type.STRING, description: "A valid, accessible HTTP/HTTPS URL." }
                      },
                      required: ["title", "url"]
                    } 
                  },
                },
                required: ["id", "title", "description", "startDate", "endDate", "category", "difficulty", "estimatedHours", "keyTopics", "recommendedResources"],
              },
            },
          },
          required: ["items", "totalHours", "summary"],
        },
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(response.text) as RoadmapData;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};