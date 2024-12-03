"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VerificationDetails } from '@/lib/types/verification';

interface VerificationStore {
  verifications: Record<string, VerificationDetails>;
  setVerification: (id: string, details: VerificationDetails) => void;
  getVerification: (id: string) => VerificationDetails | null;
  clearVerification: (id: string) => void;
  clearAll: () => void;
}

export const useVerificationStore = create<VerificationStore>()(
  persist(
    (set, get) => ({
      verifications: {},
      setVerification: (id, details) => 
        set((state) => ({
          verifications: {
            ...state.verifications,
            [id]: details
          }
        })),
      getVerification: (id) => get().verifications[id] || null,
      clearVerification: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.verifications;
          return { verifications: rest };
        }),
      clearAll: () => set({ verifications: {} }),
    }),
    {
      name: 'verification-storage',
      version: 1,
    }
  )
);