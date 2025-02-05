"use client";

import { useState, Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAccount } from "wagmi";
import CustomRainbowKitConnectButton from "../CustomConnectButton";
import CurrencyInput from "../CurrencyInput";
import { useForm, Controller } from "react-hook-form";

interface DepositFormData {
  deposit: {
    currency: string;
    amount: string;
  };
}

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
            className="sm:min-w-[45vw] relative transform overflow-visible bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
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
                  className="rounded-md z-50 parallelogram bg-red-700 p-1 text-white hover:bg-red-800 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon aria-hidden="true" className="size-5" />
                </button>
              </div>
            </div>

            <div className="bg-background-blue min-h-[85vh] sm:min-h-[45vh] pb-10 pt-3 overflow-visible flex flex-col">
              <div className="flex flex-col sm:flex-row flex-1">
                <div className="flex items-center justify-center sm:mr-5">
                  <img
                    src="/victory.png"
                    className="w-56 h-40 object-contain"
                  />
                </div>
                <div className="px-3 sm:px-0 text-left items-center sm:items-start max-sm:justify-between text-white flex flex-col flex-1 max-sm:min-h-[60vh]">
                  {!address ? (
                    <>
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
                        onSubmit={handleSubmit((data) => {
                          console.log("Form submitted with values:", data);
                          setIsDeposited(true);
                          setOpenModal(false);
                        })}
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
                            className="uppercase px-12 py-3 parallelogram bg-background-yellow text-white border-2 border-black hover:scale-105 transition-all duration-300"
                            style={{
                              textShadow: " -1px 2px 0px #000000",
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
