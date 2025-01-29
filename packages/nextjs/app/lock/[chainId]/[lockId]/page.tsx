"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { erc20Abi, formatEther, getAddress, parseAbi } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { LenaLockAbi } from "~~/abis/LenaLockAbi";
import { AddressInput } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export interface Lock {
  lock_id: bigint;
  nftPositionManager: string;
  pool: string;
  nft_id: bigint;
  owner: string;
  pendingOwner: string;
  additionalCollector: string;
  collectAddress: string;
  unlockDate: bigint;
  ucf: bigint;
}

interface Position {
  nonce: bigint;
  operator: string;
  token0: string;
  token1: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
}

const LockDetailsPage = () => {
  const params = useParams();
  const { address } = useAccount();
  const [newUnlockDate, setNewUnlockDate] = useState("");
  const [collectAmount, setCollectAmount] = useState({ amount0Max: "", amount1Max: "" });
  const [transferAddress, setTransferAddress] = useState("");
  const [additionalCollector, setAdditionalCollector] = useState("");
  const [collectAddress, setCollectAddress] = useState("");
  const [position, setPosition] = useState<Position | null>(null);

  const lenaLockAddress = "0x848B2e4C7D0aA1391D145b3629a517EBE0EC70b9";

  // Read lock data
  const { data: lock, isLoading } = useReadContract({
    address: lenaLockAddress,
    abi: LenaLockAbi,
    functionName: "getLock",
    args: [BigInt(params.lockId as string)],
  });

  // Read position data
  const { data: positionData } = useReadContract({
    address: lock?.nftPositionManager,
    abi: parseAbi([
      "function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)",
    ]),
    functionName: "positions",
    args: [lock?.nft_id as bigint],
    query: {
      enabled: Boolean(lock?.nft_id),
    },
  });

  // Read token symbols
  const { data: token0Symbol } = useReadContract({
    address: position?.token0,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const { data: token1Symbol } = useReadContract({
    address: position?.token1,
    abi: erc20Abi,
    functionName: "symbol",
  });

  // Contract write functions
  const { writeContractAsync: withdrawLock } = useWriteContract();
  const { writeContractAsync: relockPosition } = useWriteContract();
  const { writeContractAsync: transferOwnership } = useWriteContract();
  const { writeContractAsync: collectFees } = useWriteContract();
  const { writeContractAsync: setAdditionalCollectorContract } = useWriteContract();
  const { writeContractAsync: setCollectAddressContract } = useWriteContract();

  useEffect(() => {
    if (positionData) {
      setPosition({
        nonce: positionData[0],
        operator: positionData[1],
        token0: positionData[2],
        token1: positionData[3],
        fee: positionData[4],
        tickLower: positionData[5],
        tickUpper: positionData[6],
        liquidity: positionData[7],
        feeGrowthInside0LastX128: positionData[8],
        feeGrowthInside1LastX128: positionData[9],
        tokensOwed0: positionData[10],
        tokensOwed1: positionData[11],
      });
    }
  }, [positionData]);

  const isLocked = (unlockDate: bigint) => {
    return Number(unlockDate) * 1000 > Date.now();
  };

  const isOwner = address && lock?.owner === address;
  const isCollector = address && (lock?.owner === address || lock?.additionalCollector === address);

  const handleWithdraw = async () => {
    if (!lock || !address) return;
    try {
      await withdrawLock({
        address: lenaLockAddress as `0x${string}`,
        abi: LenaLockAbi,
        functionName: "withdraw",
        args: [lock.lock_id, address],
      });
      notification.success("Position withdrawn successfully");
    } catch (error) {
      console.error("Error withdrawing position:", error);
      notification.error("Failed to withdraw position");
    }
  };

  const handleRelock = async () => {
    if (!lock || !newUnlockDate) return;
    try {
      const timestamp = BigInt(Math.floor(new Date(newUnlockDate).getTime() / 1000));
      await relockPosition({
        address: lenaLockAddress as `0x${string}`,
        abi: LenaLockAbi,
        functionName: "relock",
        args: [lock.lock_id, timestamp],
      });
      notification.success("Position relocked successfully");
      setNewUnlockDate("");
    } catch (error) {
      console.error("Error relocking position:", error);
      notification.error("Failed to relock position");
    }
  };

  const handleCollectFees = async () => {
    if (!lock || !address) return;
    try {
      await collectFees({
        address: lenaLockAddress as `0x${string}`,
        abi: LenaLockAbi,
        functionName: "collect",
        args: [lock.lock_id, address, BigInt(collectAmount.amount0Max || "0"), BigInt(collectAmount.amount1Max || "0")],
      });
      notification.success("Fees collected successfully");
      setCollectAmount({ amount0Max: "", amount1Max: "" });
    } catch (error) {
      console.error("Error collecting fees:", error);
      notification.error("Failed to collect fees");
    }
  };

  const handleTransferOwnership = async () => {
    if (!lock || !transferAddress) return;
    try {
      await transferOwnership({
        address: lenaLockAddress as `0x${string}`,
        abi: LenaLockAbi,
        functionName: "transferLockOwnership",
        args: [lock.lock_id, getAddress(transferAddress)],
      });
      notification.success("Ownership transfer initiated");
      setTransferAddress("");
    } catch (error) {
      console.error("Error transferring ownership:", error);
      notification.error("Failed to transfer ownership");
    }
  };

  const handleSetAdditionalCollector = async () => {
    if (!lock || !additionalCollector) return;
    try {
      await setAdditionalCollectorContract({
        address: lenaLockAddress as `0x${string}`,
        abi: LenaLockAbi,
        functionName: "setAdditionalCollector",
        args: [lock.lock_id, getAddress(additionalCollector)],
      });
      notification.success("Additional collector set successfully");
      setAdditionalCollector("");
    } catch (error) {
      console.error("Error setting additional collector:", error);
      notification.error("Failed to set additional collector");
    }
  };

  const handleSetCollectAddress = async () => {
    if (!lock || !collectAddress) return;
    try {
      await setCollectAddressContract({
        address: lenaLockAddress as `0x${string}`,
        abi: LenaLockAbi,
        functionName: "setCollectAddress",
        args: [lock.lock_id, getAddress(collectAddress)],
      });
      notification.success("Collect address set successfully");
      setCollectAddress("");
    } catch (error) {
      console.error("Error setting collect address:", error);
      notification.error("Failed to set collect address");
    }
  };

  // Add this function to handle modal opening
  const openRelockModal = () => {
    const modal = document.getElementById("relock-modal") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  if (isLoading || !lock) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ArrowPathIcon className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <h1 className="text-3xl font-bold mb-6">Lock #{lock.lock_id.toString()}</h1>

        {/* Lock Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Lock Details</h3>
              <p>NFT ID: {lock.nft_id.toString()}</p>
              <p>Pool: {lock.pool}</p>
              <p>Status: {isLocked(lock.unlockDate) ? "Locked" : "Unlocked"}</p>
              <div className="flex items-center gap-2">
                <p>Unlock Date: {new Date(Number(lock.unlockDate) * 1000).toLocaleString()}</p>
                {isOwner && (
                  <button className="btn btn-xs btn-primary" onClick={openRelockModal}>
                    Extend Lock
                  </button>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Ownership</h3>
              <p>Owner: {lock.owner}</p>
              {lock.pendingOwner !== "0x0000000000000000000000000000000000000000" && (
                <p>Pending Owner: {lock.pendingOwner}</p>
              )}
              <p>Additional Collector: {lock.additionalCollector}</p>
              <p>Collect Address: {lock.collectAddress}</p>
            </div>
          </div>

          {/* Position Details */}
          {position && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Position Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Token Information</h3>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <tbody>
                          <tr>
                            <td className="font-semibold">Token Pair</td>
                            <td>
                              <span className="tooltip tooltip-info" data-tip={position.token0}>
                                {token0Symbol}
                              </span>
                              {" / "}
                              <span className="tooltip tooltip-info" data-tip={position.token1}>
                                {token1Symbol}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold">Fee Tier</td>
                            <td>{position.fee / 10000}%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Position Metrics</h3>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <tbody>
                          <tr>
                            <td className="font-semibold">Liquidity</td>
                            <td>{position.liquidity.toString()}</td>
                          </tr>
                          <tr>
                            <td className="font-semibold">Tick Range</td>
                            <td>
                              {position.tickLower} to {position.tickUpper}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-semibold">Tokens Owed</td>
                            <td>
                              {formatEther(position.tokensOwed0)} {token0Symbol} / {formatEther(position.tokensOwed1)}{" "}
                              {token1Symbol}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-6">
            {isOwner && (
              <>
                {/* Withdraw/Relock Section */}
                {!isLocked(lock.unlockDate) ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Unlock Actions</h3>
                    <button className="btn btn-primary w-full" onClick={handleWithdraw}>
                      Withdraw Position
                    </button>
                    <div className="space-y-2">
                      <input
                        type="datetime-local"
                        className="input input-bordered w-full"
                        value={newUnlockDate}
                        onChange={e => setNewUnlockDate(e.target.value)}
                      />
                      <button className="btn btn-secondary w-full" onClick={handleRelock}>
                        Relock Position
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Transfer Ownership</h3>
                    <AddressInput
                      value={transferAddress}
                      onChange={setTransferAddress}
                      placeholder="Enter new owner address"
                    />
                    <button className="btn btn-primary w-full" onClick={handleTransferOwnership}>
                      Transfer Ownership
                    </button>
                  </div>
                )}

                {/* Collector Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Collector Settings</h3>
                  <div className="space-y-2">
                    <AddressInput
                      value={additionalCollector}
                      onChange={setAdditionalCollector}
                      placeholder="Additional collector address"
                    />
                    <button className="btn btn-secondary w-full" onClick={handleSetAdditionalCollector}>
                      Set Additional Collector
                    </button>
                  </div>
                  <div className="space-y-2">
                    <AddressInput value={collectAddress} onChange={setCollectAddress} placeholder="Collect address" />
                    <button className="btn btn-secondary w-full" onClick={handleSetCollectAddress}>
                      Set Collect Address
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Collect Fees Section */}
            {isCollector && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Collect Fees</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Amount 0 Max"
                    value={collectAmount.amount0Max}
                    onChange={e => setCollectAmount(prev => ({ ...prev, amount0Max: e.target.value }))}
                  />
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Amount 1 Max"
                    value={collectAmount.amount1Max}
                    onChange={e => setCollectAmount(prev => ({ ...prev, amount1Max: e.target.value }))}
                  />
                  <button className="btn btn-primary w-full" onClick={handleCollectFees}>
                    Collect Fees
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Relock Modal */}
      <dialog id="relock-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Extend Lock Period</h3>
          <p className="text-sm opacity-70 mb-4">
            Current unlock date: {new Date(Number(lock.unlockDate) * 1000).toLocaleString()}
          </p>
          <div className="form-control">
            <label className="label">
              <span className="label-text">New Unlock Date</span>
            </label>
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={newUnlockDate}
              onChange={e => setNewUnlockDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button className="btn btn-primary" onClick={handleRelock} disabled={!newUnlockDate}>
              Extend Lock
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default LockDetailsPage;
