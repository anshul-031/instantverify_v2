"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VerificationDetails } from '@/lib/types/verification';
import { ExtractedInfo } from '@/lib/types/deepvue';

interface VerificationStore {
  verifications: Record<string, VerificationDetails>;
  extractedInfo: Record<string, ExtractedInfo>;
  setVerification: (id: string, details: VerificationDetails) => void;
  setExtractedInfo: (id: string, info: ExtractedInfo) => void;
  getVerification: (id: string) => VerificationDetails | null;
  getExtractedInfo: (id: string) => ExtractedInfo | null;
  clearVerification: (id: string) => void;
  clearAll: () => void;
}

export const useVerificationStore = create<VerificationStore>()(
  persist(
    (set, get) => ({
      verifications: {},
      extractedInfo: {},
      setVerification: (id, details) => 
        set((state) => ({
          verifications: {
            ...state.verifications,
            [id]: details
          }
        })),
      setExtractedInfo: (id, info) =>
        set((state) => ({
          extractedInfo: {
            ...state.extractedInfo,
            [id]: info
          }
        })),
      getVerification: (id) => get().verifications[id] || null,
      getExtractedInfo: (id) => get().extractedInfo[id] || null,
      clearVerification: (id) =>
        set((state) => {
          const { [id]: _, ...restVerifications } = state.verifications;
          const { [id]: __, ...restExtractedInfo } = state.extractedInfo;
          return { 
            verifications: restVerifications,
            extractedInfo: restExtractedInfo
          };
        }),
      clearAll: () => set({ verifications: {}, extractedInfo: {} }),
    }),
    {
      name: 'verification-storage',
      version: 1,
    }
  )
);