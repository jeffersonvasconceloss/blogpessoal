
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI {
    if (this.ai) return this.ai;

    // @ts-ignore
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || '';

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      console.warn("Gemini API key is not set. Please set VITE_GEMINI_API_KEY in .env.local");
      // Return a dummy client or throw a more descriptive error inside methods
    }

    this.ai = new GoogleGenAI(apiKey);
    return this.ai;
  }


  async summarizeArticle(title: string, content: string): Promise<string> {
    try {
      const client = this.getClient();
      // @ts-ignore
      const response = await client.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: `Resuma o seguinte ensaio literário intitulado "${title}" em três parágrafos profundos e poéticos:\n\n${content}` }] }],
        config: {
          systemInstruction: "Você é um crítico literário erudito e sofisticado.",
          temperature: 0.7,
        }
      });
      return response.text || "Não foi possível gerar um resumo.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Para resumos automáticos, configure sua API Key do Gemini no arquivo .env.local.";
    }
  }

  async getWritingInspiration(topic: string): Promise<string[]> {
    try {
      const client = this.getClient();
      // @ts-ignore
      const response = await client.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: `Gere 3 prompts de escrita profunda e filosófica baseados no tema: ${topic}. Retorne apenas um array JSON de strings.` }] }],
        config: {
          systemInstruction: "Você é um mentor de escrita criativa focado em filosofia e literatura.",
          responseMimeType: "application/json",
        }
      });
      const data = JSON.parse(response.text || '[]');
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Inspiration Error:", error);
      return ["O silêncio como forma de protesto.", "A geometria das sombras na arquitetura urbana.", "A memória dos objetos inanimados."];
    }
  }

}

export const geminiService = new GeminiService();
