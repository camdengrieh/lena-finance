"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const client = new ApolloClient({
  uri: "http://localhost:42069",
  //uri: "https://",
  cache: new InMemoryCache(),
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "01ac66b8-30d8-4105-b965-8a08b79e9111",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <ProgressBar height="3px" color="#2299dd" />
            <DynamicWagmiConnector>
              <ScaffoldEthApp>{children}</ScaffoldEthApp>
            </DynamicWagmiConnector>
          </QueryClientProvider>
        </ApolloProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
};
