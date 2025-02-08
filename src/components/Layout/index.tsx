"use client";

import { useAccount } from "wagmi";
import WelcomeScreen from "../WelcomeScreen";
import DefiScreen from "../DefiScreen";
import { useState } from "react";

export default function Layout() {
  const [isDeposited, setIsDeposited] = useState(false);
  const { address } = useAccount();

  if (address && isDeposited) {
    return <DefiScreen />;
  } else {
    // wallet not connected.
    return <WelcomeScreen setIsDeposited={setIsDeposited} />;
  }
}
