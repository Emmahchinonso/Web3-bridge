import { isAddress } from "ethers";
import * as Yup from "yup";

export const sendFormSchema = Yup.object().shape({
  recipientAddress: Yup.string()
    .test(
      "is-wallet-address-valid",
      "Please enter a valid wallet address",
      (value) => (value ? isAddress(value) : false)
    )
    .required("please enter recipient awallet address"),
  tokenAmount: Yup.number()
    .typeError("Please enter a valid number")
    .required("Please enter amount")
    .moreThan(0, "Please enter an amount greater than 0"),
  token: Yup.string().required("Please select a token"),
});
