import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
}

interface AppState {
  hasConsented: boolean;
  cookiePreferences: CookiePreferences;
  setConsent: (preferences: Partial<CookiePreferences>) => void;
  welcomePopupShown: boolean;
  setWelcomePopupShown: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasConsented: false,
      cookiePreferences: {
        essential: true, // Always true
        analytics: false,
        performance: false,
        marketing: false,
      },
      setConsent: (preferences) =>
        set((state) => ({
          hasConsented: true,
          cookiePreferences: { ...state.cookiePreferences, ...preferences },
        })),
      welcomePopupShown: false,
      setWelcomePopupShown: () => set({ welcomePopupShown: true }),
    }),
    {
      name: 'portfolio-app-storage',
    }
  )
);
