import type { ethers } from "ethers";

export interface WalletState {
  address: string | null;
  chainId: number | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export interface Asset {
  id: string;
  name: string;
  amount: string;
}
