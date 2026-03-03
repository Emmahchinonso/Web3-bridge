// hooks/useWallet.ts
import { useEffect } from "react";
import { useWalletStore, useWalletUIStore } from "../store/walletStore";
import { walletService } from "../services/WalletService";

export function useWallet() {
  const address = useWalletStore((s) => s.address);
  const chainId = useWalletStore((s) => s.chainId);
  const isConnected = useWalletStore((s) => s.isConnected);
  const isConnecting = useWalletStore((s) => s.isConnecting);
  const error = useWalletStore((s) => s.error);

  const setPreferredChain = useWalletUIStore((s) => s.setPreferredChain);

  // Initialize on mount (handles reload/uninstall detection)
  useEffect(() => {
    walletService.init();
  }, []);

  const connect = async () => {
    await walletService.connect();
    if (walletService.getState().isConnected) {
      setPreferredChain(walletService.getState().chainId || 1);
    }
  };

  const disconnect = () => walletService.disconnect();

  const switchChain = async (chainId: number) => {
    await walletService.switchChain(chainId);
    setPreferredChain(chainId);
  };

  return {
    address,
    chainId,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    switchChain,
    getSigner: () => walletService.getSigner(),
    getProvider: () => walletService.getProvider(),
    signMessage: (msg: string) => walletService.signMessage(msg),
  };
}
