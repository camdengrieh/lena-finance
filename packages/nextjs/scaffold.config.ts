import * as chains from "viem/chains";

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

//Add custom network, unichainSepolia
export const sonic = {
  id: 146,
  name: "Sonic Mainnet",
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

export const xphere = {
  id: 20250217,
  name: "Xphere Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Xphere",
    symbol: "XP",
  },
  rpcUrls: {
    default: {
      http: ["https://en-bkk.x-phere.com"],
    },
    public: {
      http: ["https://en-bkk.x-phere.com"],
    },
  },
} as const satisfies chains.Chain;

export const xphereTestnet = {
  id: 1998991,
  name: "Xphere Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Xphere Testnet",
    symbol: "XPT",
  },
  rpcUrls: {
    default: {
      http: ["https://en-bkk.x-phere.com"],
    },
    public: {
      http: ["https://en-bkk.x-phere.com"],
    },
  },
} as const satisfies chains.Chain;

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [xphere],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
