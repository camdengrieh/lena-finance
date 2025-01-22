import { onchainTable, primaryKey } from "ponder";
import { zeroAddress } from "viem";

export const lock = onchainTable("lock", (t) => ({
    lockId: t.bigint().notNull(),
    nftPositionManager: t.hex().notNull(),
    nftId: t.bigint().notNull(),
    owner: t.hex().notNull(),
    unlockDate: t.bigint().notNull(),
    poolAddress: t.hex().notNull(),
    pendingOwner: t.hex().default(zeroAddress).notNull(),
    // Position struct fields
    token0: t.hex().notNull(),
    token1: t.hex().notNull(),
    token0Symbol: t.text().notNull(),
    token1Symbol: t.text().notNull(),
    liquidity: t.bigint().notNull(),
    createdAt: t.bigint().notNull(),
    chainId: t.integer().notNull(),
  }),
  (table) => ({ pk: primaryKey({ columns: [table.lockId, table.chainId] }) })
);
