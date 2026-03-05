import type { SupportedNetwork } from "../types/chains";

export const SUPPORTED_NETWORKS: SupportedNetwork[] = [
  {
    chainId: 11155111,
    name: "Sepolia",
    rpcUrl: "https://rpc.sepolia.org",
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
    nativeCurrency: {
      name: "Sepolia ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    chainId: 80002,
    name: "Polygon Amoy",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    blockExplorerUrls: ["https://amoy.polygonscan.com"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  {
    chainId: 97,
    name: "BSC Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorerUrls: ["https://testnet.bscscan.com"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  {
    chainId: 84532,
    name: "Base Sepolia",
    rpcUrl: "https://sepolia.base.org",
    blockExplorerUrls: ["https://sepolia.basescan.org"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
  },
];

const CHAIN_ID_MAP = new Map<number, SupportedNetwork>();
SUPPORTED_NETWORKS.forEach((chain) => CHAIN_ID_MAP.set(chain.chainId, chain));
export { CHAIN_ID_MAP };

export const DEFAULT_CHAIN_ID = 11155111;

export const DISCONNECT_KEY = "user_disconnected";

export const TX_STATUS = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};
