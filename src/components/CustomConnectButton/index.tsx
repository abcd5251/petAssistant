"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CustomRainbowKitConnectButton() {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        // authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted;
        const connected = ready && account && chain;
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="cursor-pointer text-xl px-16 py-2 bg-background-blue border border-solid border-black parallelogram uppercase text-white ml-6 rounded-md px-3 py-1"
                    onClick={openConnectModal}
                    type="button"
                    style={{
                      textShadow: " -1px 2px 0px #000000",
                      WebkitTextFillColor: "white",
                      WebkitTextStroke: "0.2px black",
                    }}
                  >
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="ml-6" style={{ display: "flex" }}>
                  <button
                    onClick={openChainModal}
                    style={{ display: "flex", alignItems: "center" }}
                    type="button"
                  ></button>
                  <button
                    className="bg-transparent border border-solid border-primary rounded-md px-3 py-1"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
