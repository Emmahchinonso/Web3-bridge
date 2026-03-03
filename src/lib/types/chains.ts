export type SupportedNetwork = {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorerUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
};
