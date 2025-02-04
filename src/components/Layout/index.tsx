"use client";

import { useAccount } from "wagmi";
import WelcomeScreen from "../WelcomeScreen";
import DefiScreen from "../DefiScreen";

export default function Layout() {
  const { address } = useAccount();

  if (address) {
    return <DefiScreen />;
  } else {
    // wallet not connected.
    return <WelcomeScreen />;
  }
}
