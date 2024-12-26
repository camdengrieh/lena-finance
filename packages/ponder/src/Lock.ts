import { ponder } from "ponder:registry";
import { locks } from "ponder:schema";

ponder.on("LenaLock:onLock", async ({ event, context }) => {
  const { network } = context;
  const { timestamp } = event.block;
  
  const { owner, lockId, token0, token1, liquidity, nftPositionManager, unlockDate, nftId, poolAddress } = event.args;

  await context.db.insert(locks).values({
    id: `${network.chainId}-${lockId}`,
    data: {
      lockId,
      owner,
      token0,
      token1,
      liquidity,
      poolAddress,
      nftId,
      nftPositionManager,
      createdAt: timestamp,
      unlockDate,
      network: network.chainId,
    },
  });
});


ponder.on("LenaLock:onRelock", async ({ event, context }) => {
  const { network } = context;
  const { lockId, unlockDate } = event.args;

  await context.db
      .update(locks, { id: `${network.chainId}-${lockId}`})
      .set({ unlockDate })
});

ponder.on("LenaLock:onLockOwnershipTransferStarted", async ({ event, context }) => {
  const { network } = context;
  const { lockId, pendingOwner } = event.args;

  await context.db
      .update(locks, { id: `${network.chainId}-${lockId}`})
      .set({ pendingOwner })
});