import { ethers } from "ethers";
import { DEFAULT_CHAIN_ID } from "../lib/constants/chains";
import type { WalletState } from "../lib/types/wallet";

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
  }

  private setState(partial: Partial<WalletState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  private getBrowserProvider = () => {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    return new ethers.BrowserProvider(window.ethereum, {
      name: "unknown",
      chainId: DEFAULT_CHAIN_ID,
    });
  };

  async init() {
    if (typeof window === "undefined") return;

    if (!window.ethereum) {
      this.setState({ error: "No wallet detected" });
      return;
    }

    try {
      const browserProvider = this.getBrowserProvider();

      // checks  for previous connection
      const accounts = await browserProvider.listAccounts();
      if (accounts.length > 0) {
        const signer = await browserProvider.getSigner();
        const network = await browserProvider.getNetwork();
        const address = await signer.getAddress();

        this.provider = browserProvider;
        this.signer = signer;

        this.setState({
          address,
          chainId: Number(network.chainId),
          provider: browserProvider,
          signer,
          isConnected: true,
          error: null,
        });

        this.setupEventListeners(browserProvider);
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

  async connectWallet(id?: number) {
    this.setState({ isConnecting: true, error: null });

    try {
      const browserProvider = this.getBrowserProvider();

      await browserProvider.send("eth_requestAccounts", []);

      const signer = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();
      const address = await signer.getAddress();

      this.provider = browserProvider;
      this.signer = signer;

      this.setState({
        address,
        chainId: Number(network.chainId),
        provider: browserProvider,
        signer,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      this.setupEventListeners(browserProvider);
    } catch (error: any) {
      this.setState({
        isConnecting: false,
        error: error.message || "Connection rejected",
      });
    }
  }

  async disconnectWallet() {
    if (this.provider) {
      this.provider?.removeAllListeners?.();
    }
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

  private setupEventListeners(provider: ethers.BrowserProvider) {
    if (!provider) return;

    provider.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnectWallet();
      } else {
        this.init();
        this.connectWallet();
      }
    });

    provider.on("chainChanged", (chainId: string) => {
      this.setState({ chainId: parseInt(chainId, 16) });
      // todo: Add check for supported chainId, and a way to update provider
      window.location.reload();
    });

    provider.on("disconnect", (error: any) => {
      console.log(error);
      this.disconnectWallet();
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
