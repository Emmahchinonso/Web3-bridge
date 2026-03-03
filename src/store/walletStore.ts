// store/walletStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { walletService } from "../services/WalletService";
import type { WalletState } from "../lib/types/wallet";
import { DEFAULT_CHAIN_ID } from "../lib/constants/chains";

// Only persist UI preferences, NOT wallet state
interface WalletUIState {
  preferredChainId: number;
  hasConnectedBefore: boolean;
  isModalOpen: boolean;
  setPreferredChain: (chainId: number) => void;
  setModalOpen: (open: boolean) => void;
}

export const useWalletUIStore = create<WalletUIState>()(
  persist(
    (set) => ({
      preferredChainId: DEFAULT_CHAIN_ID,
      hasConnectedBefore: false,
      isModalOpen: false,

      setPreferredChain: (chainId) => {
        set({ preferredChainId: chainId });
      },
      setModalOpen: (open) => set({ isModalOpen: open }),
    }),
    {
      name: "wallet-preferences",
      storage: createJSONStorage(() => localStorage),
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
