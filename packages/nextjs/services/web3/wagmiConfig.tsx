import { Chain, http } from "viem";
import { mainnet } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { xphere, xphereTestnet } from "~~/scaffold.config";

const { targetNetworks } = scaffoldConfig;

export const customEvmNetworks = [
  {
    blockExplorerUrls: ["https://explorer.x-phere.com/"],
    chainId: 20250217,
    name: "Xphere Mainnet",
    iconUrls: [""],
    rpcUrls: ["https://en-bkk.x-phere.com"],
    nativeCurrency: {
      name: "Xphere",
      symbol: "XP",
      decimals: 18,
    },
    networkId: 20250217,
    vanityName: "Xphere",
  },
  {
    blockExplorerUrls: ["https://explorer.x-phere.com/"],
    chainId: 1998991,
    name: "Xphere Testnet",
    iconUrls: [""],
    rpcUrls: ["https://en-bkk.x-phere.com"],
    nativeCurrency: {
      name: "Xphere Testnet",
      symbol: "XPT",
      decimals: 18,
    },
    networkId: 1998991,
    vanityName: "Xphere Testnet",
  },
];

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

export const wagmiConfig = createConfig({
  chains: [...targetNetworks, mainnet],
  ssr: true,
  transports: {
    [xphere.id]: http(),
    [xphereTestnet.id]: http(),
    [mainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: false,
});
