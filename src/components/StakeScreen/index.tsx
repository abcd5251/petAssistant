import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { TypedData } from "viem";
import { baseSepolia } from "wagmi/chains";
import { useAccount, useReadContract } from "wagmi";
import { waitForTransactionReceipt, signTypedData } from "@wagmi/core";
import { ToastContainer, toast } from "react-toastify";

import { EXECUTOR, USDC, USDC_DECIMAL } from "../../helpers/constants";
import CurrencyInput from "../CurrencyInput";
import { config } from "../../config";
import { usdcAbi } from "../../abis/usdc";
import { execution } from "../../helpers/mock-backend";
import { createMorphoCall } from "../../helpers/strategy";

const types = {
  Permit: [
    { name: "owner", type: "address" },
    { name: "spender", type: "address" },
    { name: "value", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
  ],
} as const satisfies TypedData;

interface DepositFormData {
  deposit: {
    currency: string;
    amount: string;
  };
}

interface StakeScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXPIRY = 60000;

function serializeAmount(amount: string, decimal: number) {
  const floatAmount = parseFloat(amount);
  if (isNaN(floatAmount)) {
    throw new Error("Amount must be a valid number.");
  }

  const integerAmount = Math.floor(floatAmount * decimal);
  return BigInt(integerAmount);
}

export default function StakeScreen({ isOpen, onClose }: StakeScreenProps) {
  const { control, handleSubmit } = useForm<DepositFormData>();
  const [inputValue, setinputValue] = useState(0);
  const { address } = useAccount();
  const { data: nonce } = useReadContract({
    abi: usdcAbi,
    address: USDC,
    functionName: "nonces",
    args: [address!],
  });

  async function onSubmit(data: DepositFormData) {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const deadline = BigInt(timestampInSeconds) + BigInt(EXPIRY);
    const amount = serializeAmount(data.deposit.amount, USDC_DECIMAL);

    const signature = await signTypedData(config, {
      domain: {
        name: "USDC",
        chainId: baseSepolia.id,
        verifyingContract: USDC,
        version: "2",
      },
      types,
      primaryType: "Permit",
      message: {
        owner: address!,
        spender: EXECUTOR,
        value: amount,
        nonce: nonce!,
        deadline,
      },
    });

    const calls = await createMorphoCall(address!, amount, deadline, signature);
    const tx = await execution(address!, calls);

    console.log("Tx done");
    console.log("Call tx", tx);
    toast.promise(
      waitForTransactionReceipt(config, {
        hash: tx,
      }),
      {
        pending: "Transaction is pending...",
        success: `Transaction confirmed ! \n Tx hash: ${tx}`,
        error: "Transaction failed",
      }
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0  flex items-center justify-center z-50">
        <div className="bg-gray-900/80 absolute t-0 left-0 w-full h-full z-0"></div>
        <div className="bg-[#1E90FF] text-white rounded-lg shadow-lg p-6 w-[90vw] max-w-[600px] z-10 relative">
          {/* Header */}
          <div className="flex justify-center items-center border-b border-white pb-2">
            <div className="items-center">
              <span className="text-3xl inline-block">🛡️</span>
              <img src="/morpho/eventInfo.svg" className="h-6 inline-block" />
            </div>
            <img
              src="/morpho/cancel.svg"
              className="h-10 absolute -right-2 top-2 cursor-pointer"
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <div className="mt-4 flex flex-col">
            <img src="/Stake/information.svg" className="h-18" />
            <img src="/Stake/intro.svg" className="h-10 mt-10" />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-y-3"
            >
              <Controller
                name="deposit"
                control={control}
                rules={{
                  required: "Please enter an amount",
                  validate: {
                    positive: (value) =>
                      parseFloat(value.amount) > 0 ||
                      "Amount must be greater than 0",
                  },
                }}
                render={({ field }) => <CurrencyInput {...field} />}
              />
              <div className="self-center max-sm:mt-auto mt-5">
                <button type="submit">
                  <img
                    src="/Stake/confirm.svg"
                    className="h-16 mt-6 cursor-pointer"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </>
  );
}
