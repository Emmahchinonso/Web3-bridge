import type {
  Interface,
  InterfaceAbi,
  JsonRpcApiProvider,
  JsonRpcSigner,
} from "ethers";
import { Contract } from "ethers";

class ContractService {
  getContract(
    contractAddress: string,
    abi: Interface | InterfaceAbi,
    provider: JsonRpcSigner | JsonRpcApiProvider
  ) {
    return new Contract(contractAddress, abi, provider);
  }
}

export const contractService = new ContractService();
