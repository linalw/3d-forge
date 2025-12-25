import { GoogleGenAI, Schema } from "@google/genai";
import { GeneratedModel } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generate3DModelFromImage = async (
  file: File, 
  apiKey: string
): Promise<GeneratedModel> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Data = await fileToGenerativePart(file);

  // We use gemini-3-pro-preview because generating valid OBJ syntax requires high reasoning and code generation capabilities.
  // It also supports multimodal input (images).
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    Analyze the provided image. Identify the main subject (object or person).
    Your task is to create a low-to-medium poly 3D representation of this subject in Wavefront OBJ format.
    
    1. First, provide a short description of the object you are modeling.
    2. Then, generate the raw OBJ content. 
       - Use 'v' for vertices and 'f' for faces.
       - Ensure the mesh is watertight if possible.
       - Scale the model to fit within a unit cube (-1 to 1).
       - Keep the vertex count between 100 and 1500 to ensure reasonable generation time, but enough detail to recognize the shape.
       - Do not include normals (vn) or texture coords (vt) unless necessary for shape, keep it simple geometry.
    
    The output must be strictly structured.
    Return a JSON object with two fields: "description" and "objString".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        // Setting a schema ensures we get the exact format we need to render the 3D model
        responseSchema: {
          type: "OBJECT",
          properties: {
            description: { type: "STRING" },
            objString: { type: "STRING", description: "The raw Wavefront OBJ file content" }
          },
          required: ["description", "objString"]
        } as any // Cast to any because the SDK types might be strict on Schema enum usage vs string literals
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(text) as GeneratedModel;
    return data;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate 3D model.");
  }
};