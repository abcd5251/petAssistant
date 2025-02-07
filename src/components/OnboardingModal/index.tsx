"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useAccount, useWriteContract } from "wagmi";
import { useForm, Controller } from "react-hook-form";
import { erc20Abi } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";

import CustomRainbowKitConnectButton from "../CustomConnectButton";
import CurrencyInput from "../CurrencyInput";
import { vaultAbi } from "../../abis/vault";
import { config } from "../../config";

interface DepositFormData {
  deposit: {
    currency: string;
    amount: string;
  };
}

const USDC_DECIMAL = 10e6;
const USDC = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const VAULT = "0xaA0374509a9FE96C95A9D3C423ac577814243742";

export default function OnboardingModal({
  openModal,
  setOpenModal,
  setIsDeposited,
}: {
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  setIsDeposited: Dispatch<SetStateAction<boolean>>;
}) {
  const { address } = useAccount();
  const { control, handleSubmit } = useForm<DepositFormData>();
  const { writeContractAsync } = useWriteContract();

  async function onSubmit(data: DepositFormData) {
    console.log("Form submitted with values:", data);

    const parsedAmount = BigInt(data.deposit.amount) * BigInt(USDC_DECIMAL);
    {
      const tx = await writeContractAsync({
        abi: erc20Abi,
        address: USDC,
        functionName: "approve",
        args: [VAULT, parsedAmount],
      });

      await waitForTransactionReceipt(config, {
        hash: tx,
      });
    }

    {
      const tx = await writeContractAsync({
        abi: vaultAbi,
        address: VAULT,
        functionName: "deposit",
        args: [parsedAmount],
      });

      await waitForTransactionReceipt(config, {
        hash: tx,
      });
    }

    setIsDeposited(true);
    setOpenModal(false);
  }

  return (
    <Dialog
      open={openModal}
      onClose={setOpenModal}
      className="relative z-10 overflow-visible"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in overflow-visible"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-visible">
        <div className="flex sm:min-h-full justify-center p-4 text-center sm:items-center sm:p-0 overflow-visible">
          <DialogPanel
            transition
            className="sm:min-w-[55vw] relative transform overflow-visible bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-background-light-blue text-center relative py-2 overflow-visible">
              <DialogTitle
                as="h2"
                style={{
                  textShadow: " -1px 2px 0px #000000",
                  WebkitTextFillColor: "white",
                  WebkitTextStroke: "0.2px black",
                }}
                className="text-3xl uppercase font-semibold text-gray-900"
              >
                Getting Started
              </DialogTitle>

              <div className="absolute top-[10px] right-[-10px] overflow-visible">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="border border-black z-50 parallelogram bg-red-700 px-3 py-1 text-white hover:bg-red-800 transition-colors shadow-[0_4px_0_0_rgba(0,0,0,1)]"
                >
                  <span className="sr-only">Close</span>
                  <img
                    src="/icon-cancel.png"
                    className="w-5 h-5 object-contain"
                  />
                </button>
              </div>
            </div>

            <div className="bg-background-blue min-h-[85vh] sm:min-h-[45vh] pb-10 pt-3 overflow-visible flex flex-col">
              <div className="flex flex-col sm:flex-row flex-1">
                <div className="flex items-center justify-center sm:mx-5">
                  <img
                    src="/deposit-logo.png"
                    className="w-56 h-56 object-contain"
                  />
                </div>
                <div className="px-3 sm:px-0 text-left items-center sm:items-start max-sm:justify-between text-white flex flex-col flex-1 max-sm:min-h-[60vh] sm:pr-8">
                  {!address ? (
                    <>
                      {/* CONNECT WALLET PAGE */}
                      <p
                        className="text-2xl"
                        style={{
                          textShadow: " -1px 2px 0px #000000",
                          WebkitTextFillColor: "white",
                          WebkitTextStroke: "0.5px black",
                        }}
                      >
                        Deposit Funds to Activate Your AI Strategist
                      </p>
                      <p className="mt-5">
                        Before your AI assistant can start optimizing your
                        funds, you need to deposit some USDC or USDT.
                      </p>
                      <p className="max-sm:self-start mt-5">🔹 Why?</p>
                      <p>
                        This deposit will be used for executing DeFi strategies
                        and covering transaction fees when needed.
                      </p>
                      <div className="self-center max-sm:mt-auto mt-5">
                        <CustomRainbowKitConnectButton />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* DEPOSIT PAGE */}
                      <p
                        className="text-2xl"
                        style={{
                          textShadow: " -1px 2px 0px #000000",
                          WebkitTextFillColor: "white",
                          WebkitTextStroke: "0.5px black",
                        }}
                      >
                        Choose Deposit Amount
                      </p>
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
                        <p className="text-sm mt-2">
                          ⚡ If your deposit covers the required gas, you're
                          good to go! Otherwise, we'll remind you to top up.
                        </p>
                        <div className="self-center max-sm:mt-auto mt-5">
                          <button
                            type="submit"
                            className="uppercase shadow-[0_4px_0_0_rgba(0,0,0,1)] text-3xl px-12 py-3 parallelogram bg-background-yellow text-white border-2 border-black hover:scale-105 transition-all duration-300"
                            style={{
                              textShadow: " -1px 3px 0px #000000",
                              WebkitTextFillColor: "white",
                              WebkitTextStroke: "0.2px black",
                            }}
                          >
                            <span>Deposit</span>
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-background-light-blue h-[2vh] overflow-visible" />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
