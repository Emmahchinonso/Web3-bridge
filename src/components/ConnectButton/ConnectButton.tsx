import { useWallet } from "../../hooks/useWallet";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useWalletUIStore } from "../../store/walletStore";
import { CHAIN_ID_MAP, SUPPORTED_NETWORKS } from "../../lib/constants/chains";
import { ellipsizeText } from "../../utils";
import ExitIcon from "../Icons/ExitIcon";
import ChevronDownIcon from "../Icons/ChevronDownIcon";
import classNames from "classnames";

const ConnectButton = () => {
  const { address, isConnected, connect, disconnect, switchChain } =
    useWallet();
  const prefferedChainId = useWalletUIStore((store) => store.preferredChainId);
  const setPreferredChain = useWalletUIStore(
    (store) => store.setPreferredChain
  );

  const selectedNetwork = CHAIN_ID_MAP.get(prefferedChainId);

  const handleNetworkChange = (chainId: number) => {
    if (isConnected) {
      switchChain(chainId);
      return;
    }
    setPreferredChain(chainId);
  };

  const handleConnect = () => {
    if (!isConnected) {
      connect();
      return;
    }
  };

  return (
    <div className="flex items-center gap-5">
      <Listbox value={prefferedChainId} onChange={handleNetworkChange}>
        <ListboxButton
          as="button"
          className="flex items-center gap-1.5 outline-none font-medium"
        >
          <span className="sr-only">Switch network</span>
          {selectedNetwork?.name ? (
            <span className="ellipsis">{selectedNetwork.name}</span>
          ) : (
            "Select network"
          )}
          <ChevronDownIcon />
        </ListboxButton>
        <ListboxOptions
          as="ul"
          className="text-sm rounded-lg bg-white outline-none w-60 shadow-[0px_10px_15px_-3px_rgba(0,_0,_0,_0.1)]"
          anchor={{ to: "bottom start", gap: "12px", padding: "16px" }}
        >
          {SUPPORTED_NETWORKS.map((network) => {
            const isSelected = network.chainId === selectedNetwork?.chainId;
            return (
              <ListboxOption
                as="li"
                key={network.chainId}
                value={network.chainId}
                className={classNames(
                  "flex-between text-gray-700 hover:bg-gray-200 border-b last:border-none border-[#F5F5F5] py-4 px-6  cursor-pointer data-[selected]:bg-gray-300 !text-left"
                )}
              >
                <div className="">{network.name}</div>
                {isSelected ? (
                  <span className="block size-1.5 bg-green-700 rounded-full " />
                ) : null}
              </ListboxOption>
            );
          })}
        </ListboxOptions>
      </Listbox>

      <div>
        {!isConnected ? (
          <button
            onClick={handleConnect}
            className="py-2 px-5 border font-medium border-black rounded-full"
          >
            Connect
          </button>
        ) : null}
        {isConnected ? (
          <Menu>
            <MenuButton
              as="button"
              className="py-2 outline-none px-5 border font-medium border-black rounded-full"
            >
              {ellipsizeText({
                text: address!,
                truncRatio: 7,
                postEllipsisCount: 2,
              })}
            </MenuButton>
            <MenuItems
              anchor={{ to: "bottom start", gap: "12px", padding: "16px" }}
              className="text-sm py-5 px-4 rounded-lg bg-white outline-none w-60 shadow-[0px_10px_15px_-3px_rgba(0,_0,_0,_0.1)]"
            >
              <MenuItem
                as="button"
                className="flex items-center gap-3 w-full"
                onClick={disconnect}
              >
                <ExitIcon /> Disconnect wallet
              </MenuItem>
            </MenuItems>
          </Menu>
        ) : null}
      </div>
    </div>
  );
};

export default ConnectButton;
