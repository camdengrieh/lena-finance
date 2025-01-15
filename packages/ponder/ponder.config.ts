import { createConfig } from "ponder";
import { http } from "viem";
import { LenaLockAbi } from "./abis/LenaLockAbi";

export default createConfig({
  networks: {
    baseSepolia: {
      chainId: 84532,
      transport: http(process.env.PONDER_RPC_URL_84532)
    }
  },
  contracts: {
    LenaLock: {
      network: "baseSepolia",
      abi: LenaLockAbi,
      address: "0xC2FeF772f6c4131e96185F73505F9B44A94f1DC5" as `0x${string}`,
      startBlock: 20344790,
    }
  }
});
