"use client";

import Header from "./components/header";
import Head from "next/head";
import "./globals.css";
import { WagmiProvider, http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const config = createConfig({
  ssr: true,
  chains: [sepolia],
  connectors: [metaMask],
  transports: {
    [sepolia.id]: http(),
  },
});

export default function RootLayout({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <html lang="en">
          <Header />
          <body>{children}</body>
        </html>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
