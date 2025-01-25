import { Chain, http } from "viem";
import { mainnet, sonic } from "viem/chains";
import { createConfig } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";

const { targetNetworks } = scaffoldConfig;

export const customEvmNetworks = [
  {
    blockExplorerUrls: ["https://sonicscan.org/"],
    chainId: 146,
    name: "Sonic Mainnet",
    iconUrls: ["https://sonicscan.org/assets/sonic/images/svg/logos/chain-light.svg?v=25.1.3.1"],
    rpcUrls: ["https://rpc.soniclabs.com"],
    nativeCurrency: {
      name: "Sonic",
      symbol: "S",
      decimals: 18,
    },
    networkId: 146,
    vanityName: "Sonic",
  },
];

// We always want to have mainnet enabled (ENS resolution, ETH price, etc). But only once.
export const enabledChains = targetNetworks.find((network: Chain) => network.id === 1)
  ? targetNetworks
  : ([...targetNetworks, mainnet] as const);

export const wagmiConfig = createConfig({
  chains: [sonic, mainnet],
  ssr: true,
  transports: {
    [sonic.id]: http(),
    [mainnet.id]: http(),
  },
  multiInjectedProviderDiscovery: false,
});
