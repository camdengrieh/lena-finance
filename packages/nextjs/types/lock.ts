export interface LockEvent {
  lockId: bigint;
  nftPositionManager: string;
  nftId: bigint;
  owner: string;
  unlockDate: bigint;
  poolAddress: string;
  pendingOwner: string;
  token0: string;
  token1: string;
  token0Symbol: string;
  token1Symbol: string;
  liquidity: bigint;
  createdAt: bigint;
  chainId: number;
}
