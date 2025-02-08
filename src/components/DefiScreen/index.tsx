import CustomRainbowKitConnectButton from "../CustomConnectButton";

import { useAccount, useReadContract } from "wagmi";
import { signTypedData } from "@wagmi/core";
import { waitForTransactionReceipt } from "@wagmi/core";
import { baseSepolia } from "wagmi/chains";
import type { TypedData } from "viem";
import { config } from "../../config";
import { EXECUTOR, USDC, USDC_DECIMAL } from "../../helpers/constants";
import { usdcAbi } from "../../abis/usdc";
import { execution } from "../../helpers/mock-backend";
import React, { useState } from "react";
import StrategyPopup from '../StrategyPopup';
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

const MOCK_VAUlE = BigInt(1);
const EXPIRY = 60000;

export default function DefiScreen() {
  const { address } = useAccount();
  const { data: nonce } = useReadContract({
    abi: usdcAbi,
    address: USDC,
    functionName: "nonces",
    args: [address!],
  });
  const [showPopup, setShowPopup] = useState(false);

  async function testSign() {
    const timestampInSeconds = Math.floor(Date.now() / 1000);
    const deadline = BigInt(timestampInSeconds) + BigInt(EXPIRY);
    const amount = MOCK_VAUlE * BigInt(USDC_DECIMAL);

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
    console.log("Calls", calls);
    const tx = await execution(address!, calls);

    await waitForTransactionReceipt(config, {
      hash: tx,
    });

    console.log("Tx done");
    console.log("Call tx", tx);
  }

  return (
    <div className="relative bg-[url('/defi-background.png')] bg-cover bg-center bg-no-repeat h-screen w-full overflow-y-scroll">
      {/* HEADER */}
      <div className="absolute top-0 w-full flex z-50">
        <img src="stat-titles.png" className="object-contain w-96 h-auto" />
        <div className="ml-auto mr-3 mt-3">
          <CustomRainbowKitConnectButton />
        </div>
      </div>
      {/* CONTENT */}
      <div className="relative flex items-center justify-center h-full flex-col">
        <div
          style={{ backgroundColor: "rgba(10, 26, 107, 0.5)" }}
          className="w-[95vw] pl-3 mx-3 parallelogram relative pb-3"
        >
          <div
            style={{ backgroundColor: "rgba(10, 26, 107, 0.74)" }}
            className="relative pl-3"
          >
            <h2
              style={{
                textShadow: "-5px 3px 0px #000000",
                WebkitTextFillColor: "white",
                WebkitTextStroke: "2px black",
              }}
              className="text-white text-4xl uppercase text-center tracking-tighter py-1"
            >
              Command Center
            </h2>
          </div>
          <div className="flex justify-between gap-x-2">
            <div
              onClick={testSign}
              className="w-1/3 border-2 border-black cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <div className="text-right text-[#7583A4] bg-black">
                <p>Low risk Strategy</p>
              </div>
              <div
                style={{
                  textShadow: " -1.5px 1px 0px #000000",
                  WebkitTextFillColor: "white",
                  WebkitTextStroke: "1.2px black",
                }}
                className="bg-[#82D724] text-white pl-3"
              >
                <div className="flex items-center py-2">
                  <div className="text-5xl mr-3">🛡️</div>
                  <div>
                    <p className="uppercase text-3xl">Safe Harbour</p>
                    <p className="uppercase text-2xl">STABLE, LOW RISK PLAYS</p>
                  </div>
                </div>
              </div>
              <div className="bg-[url('/defi-background.png')] object-contain h-32 w-full" />
            </div>

            <div
              onClick={() => setShowPopup(true)}
              className="w-1/3 border-2 border-black cursor-pointer hover:scale-105 transition-all duration-300"
            >
              <div className="text-right text-[#7583A4] bg-black">
                <p>Mid-Risk Strategy</p>
              </div>
              <div
                style={{
                  textShadow: " -1.5px 1px 0px #000000",
                  WebkitTextFillColor: "white",
                  WebkitTextStroke: "1.2px black",
                }}
                className="bg-[#9C3EF4] text-white pl-3"
              >
                <div className="flex items-center py-2">
                  <div className="text-5xl mr-3">⚖️️</div>
                  <div>
                    <p className="uppercase text-3xl">Balanced</p>
                    <p className="uppercase text-2xl">OPTIMIZED YIELD</p>
                  </div>
                </div>
              </div>
              <div className="bg-[url('/balanced.png')] object-contain h-32 w-full" />
            </div>

            <div className="w-1/3 border-2 border-black cursor-pointer hover:scale-105 transition-all duration-300">
              <div
                onClick={() => {
                  // TODO
                  console.log("High-Risk Strategy");
                }}
                className="text-right text-[#7583A4] bg-black"
              >
                <p>High-Risk Strategy</p>
              </div>
              <div
                style={{
                  textShadow: " -1.5px 1px 0px #000000",
                  WebkitTextFillColor: "white",
                  WebkitTextStroke: "1.2px black",
                }}
                className="bg-[#E53B52] text-white pl-3"
              >
                <div className="flex items-center py-2">
                  <div className="text-5xl mr-3">🚀</div>
                  <div>
                    <p className="uppercase text-3xl">High Stakes</p>
                    <p className="uppercase text-2xl">
                      HIGH-RISK & BIG REWARDS
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[url('/high-risk.png')] object-contain h-32 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER, fixed at the bottom */}
      <div className="absolute bottom-0 w-full flex items-center justify-center pb-3">
        <div className="flex justify-center items-end gap-x-3 ml-2">
          <button
            onClick={() => {
              // TODO: Handle rewards click
              console.log("Rewards clicked");
            }}
            type="button"
            className="focus:outline-none"
          >
            <img
              src="/btn-rewards.svg"
              className="h-24 w-auto object-contain hover:scale-105 transition-all duration-300"
              alt="Rewards"
            />
          </button>

          <button
            onClick={() => {
              // TODO: Handle quests click
              console.log("Quests clicked");
            }}
            type="button"
            className="focus:outline-none"
          >
            <img
              src="/btn-quests.svg"
              className="h-24 w-auto object-contain hover:scale-105 transition-all duration-300"
              alt="Quests"
            />
          </button>

          <button
            onClick={() => {
              // TODO: Handle history click
              console.log("History clicked");
            }}
            type="button"
            className="focus:outline-none"
          >
            <img
              src="/btn-history.svg"
              className="h-24 w-auto object-contain hover:scale-105 transition-all duration-300"
              alt="History"
            />
          </button>
        </div>
        <div className="ml-auto flex justify-center items-end gap-x-3 pr-3">
          <button
            onClick={() => {
              // TODO: Handle news click
              console.log("News clicked");
            }}
            type="button"
            className="focus:outline-none"
          >
            <img
              src="/btn-news.svg"
              className="h-24 w-auto object-contain hover:scale-105 transition-all duration-300"
              alt="News"
            />
          </button>

          <button
            onClick={() => {
              // TODO: Handle AI chat click
              console.log("AI Chat clicked");
            }}
            type="button"
            className="focus:outline-none"
          >
            <img
              src="/btn-ai-chat.svg"
              className="h-20 w-auto object-contain hover:scale-105 transition-all duration-300"
              alt="AI Chat"
            />
          </button>
        </div>
      </div>
      <StrategyPopup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
      />
    </div>
  );
}
