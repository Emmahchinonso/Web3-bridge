import { Field, Input, Label, Select } from "@headlessui/react";
import ChevronDownIcon from "../Icons/ChevronDownIcon";
import { useAssetStore } from "../../store/assetStore";

const Main = () => {
  const { assets, setSelectedAsset, selectedAsset } = useAssetStore();
  return (
    <main className="mt-10 px-4">
      <div className="">
        <section className="text-center">
          <h1 className="mb-10 font-semibold text-2xl text-gray-600">
            Transfer crypto the easy way, it's fast and reliable
          </h1>
        </section>
        <div className="max-w-[500px] bg-white mx-auto shadow-[0px_10px_15px_-3px_rgba(0,_0,_0,_0.1)] rounded-2xl p-10 ">
          <form>
            <div className="space-y-5 mb-12">
              <Field>
                <Label className="input-label mb-1">Receiver address</Label>
                <Input
                  type="text"
                  name="receiverAddress"
                  placeholder="e.g 0xefbe.."
                  className="input"
                />
              </Field>
              <Field>
                <Label className="input-label mb-1">Select token</Label>
                <div className="relative">
                  <Select
                    className="input appearance-none"
                    name="status"
                    value={selectedAsset?.id || ""}
                    onChange={(e) =>
                      setSelectedAsset(
                        assets.find(
                          (asset) => asset.id == Number(e.target.value)
                        )!
                      )
                    }
                  >
                    {assets?.map((asset) => {
                      return (
                        <option key={asset.id} value={asset.id}>
                          {asset.name}
                        </option>
                      );
                    })}
                  </Select>
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-1/2 -translate-y-1/2 right-2.5 size-4"
                    aria-hidden="true"
                  />
                </div>
              </Field>
              <Field>
                <Label className="input-label mb-1">Token amount</Label>
                <input
                  type="text"
                  placeholder="e.g 5"
                  name="token amount"
                  className="input"
                />
              </Field>
            </div>
            <button className="w-full py-4 bg-black text-white rounded-full">
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Main;
