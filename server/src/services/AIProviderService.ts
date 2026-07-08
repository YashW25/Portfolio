import { GoogleGenAI } from '@google/genai';

export interface ChatMessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIProviderService {
  private ai: GoogleGenAI | null = null;
  private isConfigured = false;
  
  constructor() {
    this.initialize();
  }
  
  private initialize() {
    // Attempt to load from env
    const apiKey = process.env.GEMINI_API_KEY || 'dummy';
    try {
      this.ai = new GoogleGenAI({ apiKey });
      this.isConfigured = true;
    } catch (err) {
      console.warn("AI Provider not properly configured. Fallback will be used.");
    }
  }
  
  public getIsConfigured(): boolean {
    return this.isConfigured;
  }
  
  public async *streamResponse(messages: ChatMessageParam[], systemContext: string) {
    if (!this.ai || !this.isConfigured) {
      yield "I'm sorry, my AI brain is currently offline. Please use the contact form to reach Yash directly!";
      return;
    }
    
    // Google Gen AI expects contents array
    const contents = messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));
    
    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: systemContext
        }
      });
      
      for await (const chunk of responseStream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (err) {
      console.error("AI Generation Error", err);
      yield "\n\n(An error occurred while connecting to the AI provider. Please try again later.)";
    }
  }
}

export const aiProviderService = new AIProviderService();
