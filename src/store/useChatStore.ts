import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatStore {
  isOpen: boolean;
  messages: ChatMessage[];
  sessionId: string;
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (msg: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  clearHistory: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      isOpen: false,
      messages: [{
        id: 'initial',
        role: 'assistant',
        content: 'Hi! I am SAMM (Simple AI Made by Me), Yash\'s personal AI representative. How can I help you today?',
        timestamp: Date.now()
      }],
      sessionId: crypto.randomUUID(),
      setIsOpen: (isOpen) => set({ isOpen }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      updateLastMessage: (content) => set((state) => {
        const newMessages = [...state.messages];
        if (newMessages.length > 0) {
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = { ...newMessages[lastIndex], content };
        }
        return { messages: newMessages };
      }),
      clearHistory: () => set({ 
        messages: [{
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Chat history cleared. How can I help you?',
          timestamp: Date.now()
        }],
        sessionId: crypto.randomUUID()
      })
    }),
    {
      name: 'samm-chat-storage',
    }
  )
);
