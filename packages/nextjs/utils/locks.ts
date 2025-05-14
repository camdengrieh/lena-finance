import { formatEther } from "viem";

export enum LockType {
  V2 = "v2",
  V3 = "v3",
}

// Helper to determine lock type from data structure
export function determineLockType(lockData: any): LockType {
  // V2 locks have lpToken property
  if (lockData && "lpToken" in lockData) {
    return LockType.V2;
  }

  // V3 locks have nftPositionManager property
  if (lockData && "nftPositionManager" in lockData) {
    return LockType.V3;
  }

  // Default to V3 if can't determine
  return LockType.V3;
}

// Format functions for different lock types
export function formatLockAmount(lockData: any, lockType: LockType): string {
  if (lockType === LockType.V2) {
    return `${formatEther(lockData.amount)} LP`;
  } else {
    // V3 logic
    return `NFT #${lockData.nft_id}`;
  }
}
