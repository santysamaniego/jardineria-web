import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Safe access to API Key to prevent blank screen crashes
const getApiKey = () => {
  try {
    // @ts-ignore
    return process.env.API_KEY || (import.meta && import.meta.env ? import.meta.env.VITE_API_KEY : '');
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const getGardenAdvice = async (
  userQuery: string,
  availableProducts: Product[]
): Promise<string> => {
  const productContext = availableProducts
    .map((p) => `- ${p.name} (${p.category}): $${p.price}. ${p.description}`)
    .join("\n");

  const systemInstruction = `
    Eres "El Jardinero Virtual", un experto asistente de IA para una empresa de jardinería y paisajismo en Ramos Mejía.
    Tu tono es profesional, amable y muy conocedor de botánica.
    
    Tus objetivos son:
    1. Diagnosticar problemas de plantas basados en la descripción del usuario (hojas amarillas, hongos, plagas, etc.).
    2. Dar consejos de cuidado (riego, luz, poda).
    3. RECOMENDAR PRODUCTOS DE NUESTRA TIENDA si solucionan el problema.
    
    Aquí está la lista de productos disponibles en la tienda ahora mismo:
    ${productContext}
    
    Reglas:
    - Si recomiendas un producto, menciona su nombre exacto y por qué ayuda.
    - Si el problema requiere un servicio profesional (como poda de altura o diseño completo), sugiere que contraten nuestros servicios a través del formulario de contacto.
    - Sé conciso pero útil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userQuery,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "Lo siento, no pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Tuve un problema conectando con mi base de conocimientos botánica. Por favor intenta de nuevo.";
  }
};