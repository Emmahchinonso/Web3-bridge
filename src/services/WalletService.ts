import { ethers } from "ethers";
import type { WalletState } from "../lib/types/wallet";
import { DISCONNECT_KEY } from "../lib/constants/chains";

class WalletService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private listeners: Set<(state: WalletState) => void> = new Set();

  private state: WalletState = {
    address: null,
    chainId: null,
    provider: null,
    signer: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  };

  subscribe(callback: (state: WalletState) => void) {
    this.listeners.add(callback);
    callback(this.state);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.state));
    console.log("Has notifiied");
  }

  private setState(partial: Partial<WalletState>) {
    console.log("Is Updating state");
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  private getBrowserProvider = () => {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    return new ethers.BrowserProvider(window.ethereum);
  };

  async init(preferredChainId?: number) {
    if (typeof window === "undefined") return;

    if (!window.ethereum) {
      this.setState({ error: "No wallet detected" });
      return;
    }

    try {
      const browserProvider = this.getBrowserProvider();

      // checks  for previous connection
      const accounts = await browserProvider.listAccounts();

      const userDisconnected = localStorage.getItem(DISCONNECT_KEY) === "true";
      if (userDisconnected) {
        this.setState({
          provider: browserProvider,
          isConnected: false,
        });
        return;
      }

      if (accounts.length > 0) {
        const signer = await browserProvider.getSigner();
        const network = await browserProvider.getNetwork();
        const currentChainId = Number(network.chainId);
        const address = await signer.getAddress();

        this.provider = browserProvider;
        this.signer = signer;

        if (preferredChainId && currentChainId !== preferredChainId) {
          // Try to switch to preferred chain
          try {
            await this.switchChain(preferredChainId);
            this.init();
            return;
          } catch (error: any) {
            // User rejected switch or chain not added
            console.warn("Failed to switch to preferred chain");
            console.log("error", error);
          }
        }

        this.setState({
          address,
          chainId: Number(network.chainId),
          provider: browserProvider,
          signer,
          isConnected: true,
          error: null,
        });
        console.log(this.state);
        this.setupEventListeners();
      } else {
        this.setState({
          provider: browserProvider,
          error: null,
        });
      }
    } catch (error: unknown) {
      this.setState({ error: "Failed to initialize wallet" });
      console.error(error);
      // send sentry report for the error
    }
  }

  async connect() {
    this.setState({ isConnecting: true, error: null });

    try {
      const browserProvider = this.getBrowserProvider();
      await browserProvider.send("eth_requestAccounts", []);

      const signer = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();
      const address = await signer.getAddress();

      this.provider = browserProvider;
      this.signer = signer;

      localStorage.removeItem(DISCONNECT_KEY);

      this.setState({
        address,
        chainId: Number(network.chainId),
        provider: browserProvider,
        signer,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      this.setupEventListeners();
    } catch (error: any) {
      console.log("error_connecting", error);
      this.setState({
        isConnecting: false,
        error: error.message || "Connection rejected",
      });
    }
  }

  async disconnect() {
    if (this.provider) {
      (window.ethereum as any)?.removeAllListeners?.();
    }
    localStorage.setItem(DISCONNECT_KEY, "true");

    this.provider = null;
    this.signer = null;

    this.setState({
      address: null,
      chainId: null,
      provider: null,
      signer: null,
      isConnected: false,
      error: null,
    });
  }

  async switchChain(chainId: number) {
    // check for connected wallet in addition to window
    // used signer because provider might already exist during init
    if (!this.signer || !window.ethereum) return;

    try {
      // todo: Add check for supported chainId and throw error
      window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // todo: Chain not added - would need to add it here
        this.setState({ error: "Chain not available" });
      }
    }
  }

  async signMessage(message: string): Promise<string | null> {
    if (!this.signer) {
      this.setState({ error: "Wallet not connected" });
      return null;
    }
    return await this.signer.signMessage(message);
  }

  private setupEventListeners() {
    if (!window.ethereum) return;

    (window.ethereum as any).removeAllListeners();

    (window.ethereum as any).on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.init();
      }
    });

    (window.ethereum as any).on("chainChanged", (chainId: string) => {
      this.setState({ chainId: parseInt(chainId, 16) });
      // todo: Add check for supported chainId, and a way to update provider
      window.location.reload();
    });

    (window.ethereum as any).on("disconnect", (error: any) => {
      console.log(error);
      this.disconnect();
    });
  }

  getState(): WalletState {
    return this.state;
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }
}

export const walletService = new WalletService();
