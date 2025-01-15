import { ponder } from "ponder:registry";
import { lock } from "ponder:schema";
import { UniswapV3PoolAbi } from "../abis/UniswapV3PoolAbi";

ponder.on("LenaLock:onLock", async ({ event, context }) => {
  const { network } = context;
  const { timestamp } = event.block;

  const {
    owner,
    lock_id,
    nftPositionManager,
    unlockDate,
    nft_id,
    poolAddress,
  } = event.args;

  const [token0, token1, liquidity] = await Promise.all([
    context.client.readContract({
      abi: UniswapV3PoolAbi,
      functionName: "token0",
      address: poolAddress,
      cache: "immutable",
    }),
    context.client.readContract({
      abi: UniswapV3PoolAbi,
      functionName: "token1",
      address: poolAddress,
      cache: "immutable",
    }),
    context.client.readContract({
      abi: UniswapV3PoolAbi,
      functionName: "liquidity",
      address: poolAddress,
      cache: "immutable",
    }),
  ]);

  await context.db.insert(lock).values({
    lockId: lock_id,
    owner,
    token0,
    token1,
    liquidity,
    poolAddress,
    nftId: nft_id,
    nftPositionManager,
    createdAt: timestamp,
    unlockDate,
    chainId: network.chainId,
  });
});

ponder.on("LenaLock:onRelock", async ({ event, context }) => {
  const { network } = context;
  const { lockId, unlockDate } = event.args;

  await context.db
    .update(lock, { chainId: network.chainId, lockId })
    .set({ unlockDate });
});

ponder.on(
  "LenaLock:onLockOwnershipTransferStarted",
  async ({ event, context }) => {
    const { network } = context;
    const { lockId, pendingOwner } = event.args;

    await context.db
      .update(lock, { chainId: network.chainId, lockId })
      .set({ pendingOwner });
  }
);
