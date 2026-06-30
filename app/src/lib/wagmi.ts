"use client";

import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "demo-project-id";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: "Trends Mining Simulator" }),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC ?? "https://mainnet.base.org",
    ),
  },
  ssr: true,
});
