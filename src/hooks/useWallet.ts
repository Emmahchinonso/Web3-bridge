// hooks/useWallet.ts
import { useEffect } from "react";
import { useWalletStore, useWalletUIStore } from "../store/walletStore";
import { walletService } from "../services/WalletService";

export function useWallet() {
  const wallet = useWalletStore();
  const ui = useWalletUIStore();

  // Initialize on mount (handles reload/uninstall detection)
  useEffect(() => {
    walletService.init();
  }, []);

  const connect = async () => {
    await walletService.connect();
    if (walletService.getState().isConnected) {
      ui.setPreferredChain(walletService.getState().chainId || 1);
    }
  };

  const disconnect = () => walletService.disconnect();

  const switchChain = (chainId: number) => {
    walletService.switchChain(chainId);
    ui.setPreferredChain(chainId);
  };

  return {
    address: wallet.address,
    chainId: wallet.chainId,
    isConnected: wallet.isConnected,
    isConnecting: wallet.isConnecting,
    error: wallet.error,
    connect,
    disconnect,
    switchChain,
    getSigner: () => walletService.getSigner(),
    getProvider: () => walletService.getProvider(),
    signMessage: (msg: string) => walletService.signMessage(msg),
  };
}
