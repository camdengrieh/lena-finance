import { wagmiConnectors } from "./wagmiConnectors";
import { getOrMapViemChain } from "@dynamic-labs/ethereum-core";
import { Chain, createClient, fallback, http } from "viem";
import { hardhat, mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig, { DEFAULT_ALCHEMY_API_KEY } from "~~/scaffold.config";
import { getAlchemyHttpUrl } from "~~/utils/scaffold-eth";

const { targetNetworks } = scaffoldConfig;

export const customEvmNetworks = [
  {
    blockExplorerUrls: ["https://explorer.soniclabs.com/"],
    chainId: 146,
    name: "Sonic Mainnet",
    iconUrls: ["https://avatars.githubusercontent.com/u/132543920?v=4"],
    rpcUrls: ["https://rpc.soniclabs.com"],
    nativeCurrency: {
      name: "Sonic",
      symbol: "S",
      decimals: 18,
    },
    networkId: 146,
  },
  {
    blockExplorerUrls: ["https://sepolia.uniscan.xyz"],
    chainId: 1301,
    name: "Unichain Sepolia",
    iconUrls: ["https://avatars.githubusercontent.com/u/132543920?v=4"],
    rpcUrls: ["https://sepolia.unichain.org"],
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    networkId: 1301,
  },
];

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([mainnet, ...customEvmNetworks.map(getOrMapViemChain)] as const);

export const wagmiConfig = createConfig({
  chains: enabledChains,
  connectors: wagmiConnectors,
  ssr: true,
  client({ chain }) {
    let rpcFallbacks = [http()];

    const alchemyHttpUrl = getAlchemyHttpUrl(chain.id);
    if (alchemyHttpUrl) {
      const isUsingDefaultKey = scaffoldConfig.alchemyApiKey === DEFAULT_ALCHEMY_API_KEY;
      // If using default Scaffold-ETH 2 API key, we prioritize the default RPC
      rpcFallbacks = isUsingDefaultKey ? [http(), http(alchemyHttpUrl)] : [http(alchemyHttpUrl), http()];
    }

    return createClient({
      chain,
      transport: fallback(rpcFallbacks),
      ...(chain.id !== (hardhat as Chain).id
        ? {
            pollingInterval: scaffoldConfig.pollingInterval,
          }
        : {}),
    });
  },
});
