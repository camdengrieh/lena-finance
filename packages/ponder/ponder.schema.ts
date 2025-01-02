import { onchainTable } from "ponder";
import { zeroAddress } from "viem";

export const locks = onchainTable("locks", (t) => ({
    id: t.text().primaryKey(),
    lockId: t.bigint(),
    nftPositionManager: t.hex(),
    nftId: t.bigint(),
    owner: t.hex(),
    unlockDate: t.bigint(),
    poolAddress: t.hex(),
    pendingOwner: t.hex().default(zeroAddress),
    // Position struct fields
    token0: t.hex(),
    token1: t.hex(),
    liquidity: t.bigint(),
    createdAt: t.bigint(),
    network: t.integer(),
  })
);
