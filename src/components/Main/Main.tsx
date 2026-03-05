import { Field, Input, Label, Select } from "@headlessui/react";
import ChevronDownIcon from "../Icons/ChevronDownIcon";
import { useAssetStore } from "../../store/assetStore";
import { useFormik } from "formik";
import { sendFormSchema } from "../../lib/validationSchema";
import classNames from "classnames";
import { useState } from "react";
import useAssets from "../../hooks/useAssets";
import { TX_STATUS } from "../../lib/constants/chains";

const Main = () => {
  const { assets, setSelectedAsset, selectedAsset } = useAssetStore();
  const { transferAsset } = useAssets();
  const [status, setStatus] = useState<
    (typeof TX_STATUS)[keyof typeof TX_STATUS]
  >(TX_STATUS.IDLE);
  const [statusMessage, setStatusMessage] = useState("");

  const [txHash, setTxHash] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      recipientAddress: "",
      token: selectedAsset?.id || "",
      tokenAmount: "",
    },
    validateOnMount: true,
    validateOnBlur: true,
    validationSchema: sendFormSchema,
    async onSubmit({ recipientAddress, token, tokenAmount }) {
      try {
        setStatus(TX_STATUS.PENDING);
        const tx = await transferAsset(recipientAddress, +token, tokenAmount);
        await tx?.wait();
        setTxHash(tx.hash);
        setStatus(TX_STATUS.SUCCESS);
        formik.resetForm();
      } catch (error: any) {
        setStatus(TX_STATUS.ERROR);
        if (error.code === "ACTION_REJECTED" || error.code === 4001) {
          setStatusMessage("❌ You rejected the transaction");
          return;
        }
      }
    },
  });
  const isDisabled = !formik.isValid || status === TX_STATUS.PENDING;

  const txStatusInfo = {
    [TX_STATUS.ERROR]: {
      message: statusMessage || "❌ Transaction failed. Please try again",
      className: "text-red-800 bg-red-100",
    },
    [TX_STATUS.PENDING]: {
      message: "⏳ Transaction is being processed. please wait..",
      className: "text-violet-800 bg-violet-100",
    },
    [TX_STATUS.SUCCESS]: {
      message: (
        <span>
          ✅ Transaction confirmed successfully.
          <span className="block truncate">Tx hash: {txHash}</span>
        </span>
      ),
      className: "text-green-800 bg-green-100",
    },
  };

  return (
    <main className="mt-10 px-4">
      <div className="">
        <section className="text-center">
          <h1 className="mb-10 font-semibold text-2xl text-gray-600">
            Transfer crypto the easy way, it's fast and reliable
          </h1>
        </section>
        <div className="max-w-[500px] bg-white mx-auto shadow-[0px_10px_15px_-3px_rgba(0,_0,_0,_0.1)] rounded-2xl p-10 ">
          <form onSubmit={formik.handleSubmit}>
            {status !== TX_STATUS.IDLE ? (
              <p
                className={`text-sm rounded-md p-3 mb-4 ${txStatusInfo[status].className}`}
              >
                {txStatusInfo[status].message}
              </p>
            ) : null}
            <div className="space-y-5 mb-12">
              <Field>
                <Label className="input-label mb-1">Receiver address</Label>
                <Input
                  type="text"
                  name="recipientAddress"
                  placeholder="e.g 0xefbe.."
                  className="input"
                  value={formik.values.recipientAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.recipientAddress &&
                !!formik.errors.recipientAddress ? (
                  <span className="error-text">
                    {formik.errors.recipientAddress}
                  </span>
                ) : undefined}
              </Field>
              <Field>
                <Label className="input-label mb-1">Select token</Label>
                <div className="relative">
                  <Select
                    className="input appearance-none"
                    name="token"
                    value={formik.values.token}
                    onChange={(e) => {
                      formik.setFieldValue("token", e.target.value);
                      setSelectedAsset(
                        assets.find(
                          (asset) => asset.id == Number(e.target.value)
                        )!
                      );
                    }}
                    onBlur={formik.handleBlur}
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
                    className="group pointer-events-none absolute top-1/2 -translate-y-1/2 right-2.5 size-4 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                {formik.touched.token && !!formik.errors.token ? (
                  <span className="error-text">{formik.errors.token}</span>
                ) : undefined}
              </Field>
              <Field>
                <Label className="input-label mb-1">Token amount</Label>
                <input
                  type="text"
                  placeholder="e.g 5"
                  name="tokenAmount"
                  className="input"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tokenAmount}
                />
                {formik.touched.tokenAmount && formik.errors.tokenAmount ? (
                  <span className="error-text">
                    {formik.errors.tokenAmount}
                  </span>
                ) : undefined}
              </Field>
            </div>
            <button
              className={classNames(
                "w-full py-4 bg-black text-white rounded-full",
                {
                  "bg-gray-400 pointer-events-none cursor-not-allowed":
                    isDisabled,
                }
              )}
              disabled={isDisabled}
            >
              {status === TX_STATUS.PENDING ? "Loading..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Main;
