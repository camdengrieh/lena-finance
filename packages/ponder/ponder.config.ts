import { createConfig, loadBalance, rateLimit } from "ponder";
import { http, webSocket } from "viem";
import { LenaLockAbi } from "./abis/LenaLockAbi";

export default createConfig({
  networks: {
    sonic: {
      chainId: 146,
      transport: 
      loadBalance([
        http("https://base-sepolia-rpc.publicnode.com"),
        http("https://sepolia.base.org"),
        webSocket("wss://base-sepolia-rpc.publicnode.com"),
        rateLimit(http(process.env.PONDER_RPC_URL_84532), { requestsPerSecond: 5 }),
      ])
    }
  },
  contracts: {
    LenaLock: {
      network: "sonic",
      abi: LenaLockAbi,
      address: "0x848B2e4C7D0aA1391D145b3629a517EBE0EC70b9" as `0x${string}`,
      startBlock: 20344790,
    }
  }
});
