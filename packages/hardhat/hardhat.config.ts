import * as dotenv from "dotenv";
dotenv.config();
import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { task } from "hardhat/config";
import generateTsAbis from "./scripts/generateTsAbis";
//import "@matterlabs/hardhat-zksync";

// If not set, it uses the hardhat account 0 private key.
// You can generate a random account with `yarn generate` or `yarn account:import` to import your existing PK
const deployerPrivateKey =
  process.env.__RUNTIME_DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
// If not set, it uses our block explorers default API keys.
//const etherscanApiKey = process.env.ETHERSCAN_MAINNET_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";
const etherscanOptimisticApiKey = process.env.ETHERSCAN_OPTIMISTIC_API_KEY || "RM62RDISS1RH448ZY379NX625ASG1N633R";
const basescanApiKey = process.env.BASESCAN_API_KEY || "ZZZEIPMT1MNJ8526VV2Y744CA7TNZR64G6";
const sonicApiKey = process.env.SONIC_API_KEY || "ZZZEIPMT1MNJ8526VV2Y744CA7TNZR64G6";

// If not set, it uses ours Alchemy's default API key.
// You can get your own at https://dashboard.alchemyapi.io
const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            // https://docs.soliditylang.org/en/latest/using-the-compiler.html#optimizer-options
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: "sonic",
  namedAccounts: {
    deployer: {
      // By default, it will take the first Hardhat account as the deployer
      default: 0,
    },
  },
  networks: {
    // View the networks that are pre-configured.
    // If the network you are looking for is not here you can add new network settings
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    unichainSepolia: {
      url: "https://sepolia.unichain.org",
      accounts: [deployerPrivateKey],
    },
    sonic: {
      url: "https://sonic.drpc.org",
      accounts: [deployerPrivateKey],
      verify: {
        etherscan: {
          apiUrl: "https://api.sonicscan.org",
          apiKey: sonicApiKey,
        },
      },
    },
    optimism: {
      url: `https://opt-mainnet.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      verify: {
        etherscan: {
          apiUrl: "https://api-optimistic.etherscan.io",
          apiKey: etherscanOptimisticApiKey,
        },
      },
    },
    optimismSepolia: {
      url: `https://opt-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      verify: {
        etherscan: {
          apiUrl: "https://api-sepolia-optimistic.etherscan.io",
          apiKey: etherscanOptimisticApiKey,
        },
      },
    },
    base: {
      url: "https://mainnet.base.org",
      accounts: [deployerPrivateKey],
      verify: {
        etherscan: {
          apiUrl: "https://api.basescan.org",
          apiKey: basescanApiKey,
        },
      },
    },
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [deployerPrivateKey],
      verify: {
        etherscan: {
          apiUrl: "https://api-sepolia.basescan.org",
          apiKey: basescanApiKey,
        },
      },
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
    scroll: {
      url: "https://rpc.scroll.io",
      accounts: [deployerPrivateKey],
    },
  },
  etherscan: {
    apiKey: `${sonicApiKey}`,
    customChains: [
      {
        network: "sophonTestnet",
        chainId: 531050104,
        urls: {
          apiURL: "https://api-testnet.sophscan.xyz/api",
          browserURL: "https://testnet.sophscan.xyz",
        },
      },
      {
        network: "sophonMainnet",
        chainId: 50104,
        urls: {
          apiURL: "https://api.sophscan.xyz/api",
          browserURL: "https://sophscan.xyz",
        },
      },
      {
        network: "sonic",
        chainId: 146,
        urls: {
          apiURL: "https://api.sonicscan.org/api",
          browserURL: "https://sonicscan.org",
        },
      },
    ],
  },

  // configuration for etherscan-verify from hardhat-deploy plugin
  // verify: {
  //   etherscan: {
  //     apiKey: `${etherscanApiKey}`,
  //   },
  // },
  sourcify: {
    enabled: false,
  },
};

// Extend the deploy task
task("deploy").setAction(async (args, hre, runSuper) => {
  // Run the original deploy task
  await runSuper(args);
  // Force run the generateTsAbis script
  await generateTsAbis(hre);
});

export default config;
