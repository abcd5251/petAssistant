import "@rainbow-me/rainbowkit/styles.css";
import { useState } from 'react';
import { ConnectButton, RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http } from "wagmi";
import { rainbowWeb3AuthConnector } from "./RainbowWeb3authConnector";
import { rainbowWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  sepolia,
  mainnet,
  arbitrum,
  base,
} from "wagmi/chains";

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '04309ed1007e77d1f119b85205bb779d',
  chains: [mainnet, sepolia, arbitrum, base],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
  wallets: [{
    groupName: 'Recommended',
    wallets: [
      rainbowWallet,
      rainbowWeb3AuthConnector,
      metaMaskWallet,
    ],
  }],
});

const queryClient = new QueryClient()

export default function App() {
  const [inputText, setInputText] = useState('');
  const [displayBox, setDisplayBox] = useState<{ text: string; color: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSend = () => {
    const value = inputText.toLowerCase();
    if (value === 'news') {
      setDisplayBox({ text: 'hello, how can i help you', color: 'yellow' });
    } else if (value === 'low risk') {
      setDisplayBox({ text: 'low risk strategy', color: 'green' });
    } else if (value === 'high risk') {
      setDisplayBox({ text: 'high risk strategy', color: 'red' });
    } else {
      setDisplayBox(null);
    }
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              fontFamily: "sans-serif",
            }}>
            <ConnectButton />
          </div>
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type news, low risk, or high risk"
                style={{
                  padding: '10px',
                  width: '300px',
                  borderRadius: '5px',
                  border: '1px solid #ccc'
                }}
              />
              <button 
                onClick={handleSend}
                style={{
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  backgroundColor: '#007bff',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </div>
            {displayBox && (
              <div style={{
                padding: '20px',
                backgroundColor: displayBox.color,
                borderRadius: '5px',
                marginTop: '20px',
                color: displayBox.color === 'yellow' ? 'black' : 'white'
              }}>
                {displayBox.text}
              </div>
            )}
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}