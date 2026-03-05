import Web3LinkABI from "../lib/abis/Web3LinkABI";
import { CONTRACT_ADDRESS } from "../lib/constants/contracts";
import { WALLET_ERRORS } from "../lib/constants/errors";
import type { Asset } from "../lib/types/wallet";
import { contractService } from "../services/ContractService";
import { useWalletStore } from "../store/walletStore";

const useContract = () => {
  const signer = useWalletStore((store) => store.signer);
  const contract = contractService.getContract(
    CONTRACT_ADDRESS,
    Web3LinkABI,
    signer!
  );

  const fetchAssets = async () => {
    if (!signer) {
      throw new Error(WALLET_ERRORS.WALLET_NOT_CONNECTED);
    }
    const assets: Asset[] = await contract.getAssets();

    return assets.map((asset) => ({
      id: Number(asset.id),
      name: asset.name,
      amount: Number(asset.amount),
    }));
  };

  async function transferAsset(to: string, assetId: string, amount: string) {
    if (!signer) {
      throw new Error(WALLET_ERRORS.WALLET_NOT_CONNECTED);
    }
    return await contract.transferAsset(to, assetId, amount);
  }

  return {
    getContract: contractService.getContract,
    fetchAssets,
    transferAsset,
  };
};

export default useContract;
