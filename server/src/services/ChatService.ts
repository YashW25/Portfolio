import { knowledgeBaseService } from './KnowledgeBaseService';
import { aiProviderService, ChatMessageParam } from './AIProviderService';
import { prisma } from '../prisma';

export class ChatService {
  
  private systemPrompt = `You are SAMM (Simple AI Made by Me), Yash Warulkar's personal AI representative.
You exist on Yash's portfolio website to answer questions about him, his skills, his startup (PeopleOS / Innovara Dynamics), his projects, and his services.
Be friendly, professional, concise, and helpful. Use markdown to format your responses (bolding, lists, etc.).
If the user asks for a website, an AI system, automation, or expresses intent to hire/work with Yash, enthusiastically encourage them to use the contact form or reach out directly, and let them know you'll alert Yash.

Here is Yash's complete knowledge base (MYSELF.md). Use this as your absolute source of truth:
=========================================
`;

  public async getSession(sessionId: string) {
    let session = await prisma.chatSession.findUnique({ where: { id: sessionId }});
    if (!session) {
      session = await prisma.chatSession.create({ data: { id: sessionId }});
    }
    return session;
  }
  
  public async handleChat(sessionId: string, userMessage: string, history: ChatMessageParam[], onChunk: (text: string) => void) {
    const session = await this.getSession(sessionId);
    
    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: userMessage
      }
    });
    
    const kbText = knowledgeBaseService.getContext();
    const fullSystemPrompt = this.systemPrompt + kbText + "\n=========================================\n";
    
    // Prepare history
    const messages = [...history, { role: 'user', content: userMessage }] as ChatMessageParam[];
    
    let fullResponse = "";
    
    // Simple intent detection for leads (RegEx)
    const intentRegex = /(hire|build|website|app|automation|ai system|work together|project|freelance|consulting)/i;
    if (intentRegex.test(userMessage)) {
      await prisma.chatLead.create({
        data: {
          sessionId: session.id,
          intent: 'Detected Buying/Hiring Intent'
        }
      });
      // Optionally trigger WhatsAppNotificationService here
    }
    
    const stream = aiProviderService.streamResponse(messages, fullSystemPrompt);
    for await (const chunk of stream) {
      fullResponse += chunk;
      onChunk(chunk);
    }
    
    // Save assistant message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: fullResponse
      }
    });
  }
}

export const chatService = new ChatService();
