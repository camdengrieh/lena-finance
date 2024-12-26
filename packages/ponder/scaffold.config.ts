import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
};

//Add custom network, unichainSepolia
const unichainSepolia = {
  id: 1301,
  name: "Unichain Sepolia",
  network: "unichainSepolia",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.unichain.org"],
    },
    public: {
      http: ["https://sepolia.unichain.org"],
    },
  },
} as const satisfies chains.Chain;

//Add custom network, Sonic (Formally Fantom)
const sonic = {
  id: 146,
  name: "Sonic Mainnet",
  network: "Sonic Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Sonic",
    symbol: "S",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.soniclabs.com"],
    },
    public: {
      http: ["https://rpc.soniclabs.com"],
    },
  },
} as const satisfies chains.Chain;



const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [
    unichainSepolia,
    sonic
  ],

} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
