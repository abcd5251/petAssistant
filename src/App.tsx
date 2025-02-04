import "@rainbow-me/rainbowkit/styles.css";
import { useState } from "react";
import {
  ConnectButton,
  RainbowKitProvider,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { rainbowWeb3AuthConnector } from "./RainbowWeb3authConnector";
import { rainbowWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia, mainnet, arbitrum, base } from "wagmi/chains";
import Layout from "./components/Layout";

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "04309ed1007e77d1f119b85205bb779d",
  chains: [mainnet, sepolia, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  wallets: [
    {
      groupName: "Recommended",
      wallets: [rainbowWallet, rainbowWeb3AuthConnector, metaMaskWallet],
    },
  ],
});

const queryClient = new QueryClient();

export default function App() {
  const [inputText, setInputText] = useState("");
  const [displayBox, setDisplayBox] = useState<{
    text: string;
    color: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    const value = inputText.toLowerCase();
    if (value === "news") {
      setDisplayBox({ text: "hello, how can i help you", color: "yellow" });
    } else if (value === "low risk") {
      setDisplayBox({ text: "low risk strategy", color: "green" });
    } else if (value === "high risk") {
      setDisplayBox({ text: "high risk strategy", color: "red" });
    } else {
      setDisplayBox(null);
    }
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="relative bg-[url('/background.png')] bg-cover bg-center bg-no-repeat h-screen w-full overflow-y-scroll">
            <Layout />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
