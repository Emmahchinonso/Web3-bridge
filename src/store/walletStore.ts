// store/walletStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { walletService } from "../services/WalletService";
import type { WalletState } from "../lib/types/wallet";

// Only persist UI preferences, NOT wallet state
interface WalletUIState {
  // UI preferences (safe to persist)
  preferredChainId: number | null;
  hasConnectedBefore: boolean;

  // Volatile UI state
  isModalOpen: boolean;

  // Actions
  setPreferredChain: (chainId: number) => void;
  setModalOpen: (open: boolean) => void;
}

export const useWalletUIStore = create<WalletUIState>()(
  persist(
    (set) => ({
      preferredChainId: null,
      hasConnectedBefore: false,
      isModalOpen: false,

      setPreferredChain: (chainId) => set({ preferredChainId: chainId }),
      setModalOpen: (open) => set({ isModalOpen: open }),
    }),
    {
      name: "wallet-preferences",
      storage: createJSONStorage(() => localStorage),
      // Only persist these fields:
      partialize: (state) => ({
        preferredChainId: state.preferredChainId,
        hasConnectedBefore: state.hasConnectedBefore,
      }),
    }
  )
);

export const useWalletStore = create<WalletState>(() =>
  walletService.getState()
);

// Subscribe to service updates
walletService.subscribe((state) => {
  useWalletStore.setState(state);
});
