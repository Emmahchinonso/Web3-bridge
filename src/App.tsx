import Header from "./components/Header/Header";
import { useEffect } from "react";
import { walletService } from "./services/WalletService";
import Main from "./components/Main/Main";
import { useAssetStore } from "./store/assetStore";
import useAssets from "./hooks/useAssets";
import { useWalletStore } from "./store/walletStore";

function App() {
  const setAssets = useAssetStore((store) => store.setAssets);
  const setSelectedAsset = useAssetStore((store) => store.setSelectedAsset);
  const assets = useAssetStore((store) => store.assets);
  const selectedAsset = useAssetStore((store) => store.selectedAsset);
  const isConnected = useWalletStore((store) => store.isConnected);
  const { fetchAssets } = useAssets();

  useEffect(() => {
    walletService.init();
  }, []);

  useEffect(() => {
    async function loadAssets() {
      try {
        if (!isConnected) return;

        const res = await fetchAssets();
        setAssets(res);
      } catch (error) {
        console.log("error_in_fetching assets", error);
      }
    }
    loadAssets();
  }, [fetchAssets, isConnected, setAssets]);

  useEffect(() => {
    if (!selectedAsset && assets.length) {
      setSelectedAsset(assets[0]);
    }
  }, [assets, selectedAsset, setSelectedAsset]);

  return (
    <>
      <Header />
      <Main />
    </>
  );
}

export default App;
