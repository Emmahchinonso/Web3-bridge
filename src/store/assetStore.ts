import { create } from "zustand";
import type { Asset } from "../lib/types/wallet";
import { createJSONStorage, persist } from "zustand/middleware";

interface AssetState {
  assets: Asset[];
  selectedAsset?: Asset;
  setAssets: (assets: Asset[]) => void;
  setSelectedAsset: (asset: Asset) => void;
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set) => ({
      assets: [],

      setAssets: (assets) => {
        set({ assets });
      },
      setSelectedAsset: (selectedAsset) => set({ selectedAsset }),
    }),
    {
      name: "asset-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
