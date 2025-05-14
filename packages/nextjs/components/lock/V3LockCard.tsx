import { useEffect, useState } from "react";
import { erc20Abi, formatEther, getAddress, parseAbi } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { LenaLockAbi } from "~~/abis/LenaLockAbi";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

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

export function V3LockCard({ lockId }: { lockId: string }) {
  const { address } = useAccount();
  const [extendDate, setExtendDate] = useState("");
  const [showExtendModal, setShowExtendModal] = useState(false);
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
    args: [BigInt(lockId)],
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
  const { writeContractAsync: withdraw } = useWriteContract();
  const { writeContractAsync: relock } = useWriteContract();
  const { writeContractAsync: transferOwnership } = useWriteContract();
  const { writeContractAsync: collectFees } = useWriteContract();
  const { writeContractAsync: setAdditionalCollectorContract } = useWriteContract();
  const { writeContractAsync: setCollectAddressContract } = useWriteContract();

  // Update position state when data is available
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

  // Handle withdraw
  const handleWithdraw = async () => {
    if (!lock || !address) return;
    try {
      await withdraw({
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

  // Handle relock (extend)
  const handleRelock = async () => {
    if (!lock || !extendDate) {
      notification.error("Please select a new unlock date");
      return;
    }

    try {
      const timestamp = BigInt(Math.floor(new Date(extendDate).getTime() / 1000));
      await relock({
        address: lenaLockAddress as `0x${string}`,
        abi: LenaLockAbi,
        functionName: "relock",
        args: [lock.lock_id, timestamp],
      });
      notification.success("Position relocked successfully");
      setExtendDate("");
      setShowExtendModal(false);
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

  if (isLoading || !lock) {
    return (
      <div className="card shadow-lg animate-pulse bg-base-200">
        <div className="card-body">
          <div className="h-6 bg-base-300 rounded-full w-3/4 mb-2"></div>
          <div className="h-4 bg-base-300 rounded-full w-1/2 mb-1"></div>
          <div className="h-4 bg-base-300 rounded-full w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg bg-base-100">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title">NFT Lock #{lock.lock_id.toString()}</h2>
          <span className="badge badge-accent">V3</span>
        </div>

        <div className="py-2">
          <div className="grid grid-cols-3 gap-1 text-sm">
            <span className="font-semibold">NFT ID:</span>
            <span className="col-span-2">#{lock.nft_id.toString()}</span>

            <span className="font-semibold">Position Manager:</span>
            <span className="col-span-2 truncate">
              <Address address={lock.nftPositionManager} />
            </span>

            <span className="font-semibold">Owner:</span>
            <span className="col-span-2">
              <Address address={lock.owner} />
            </span>

            <span className="font-semibold">Collect Address:</span>
            <span className="col-span-2">
              <Address address={lock.collectAddress} />
            </span>

            <span className="font-semibold">Additional Collector:</span>
            <span className="col-span-2">
              <Address address={lock.additionalCollector} />
            </span>

            <span className="font-semibold">Unlock Date:</span>
            <span className="col-span-2 flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {new Date(Number(lock.unlockDate) * 1000).toLocaleString()}
            </span>
          </div>
        </div>

        {position && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Position Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="font-semibold">Token Pair:</p>
                <p>
                  {token0Symbol} / {token1Symbol}
                </p>
              </div>
              <div>
                <p className="font-semibold">Fee Tier:</p>
                <p>{position.fee / 10000}%</p>
              </div>
              <div>
                <p className="font-semibold">Liquidity:</p>
                <p>{position.liquidity.toString()}</p>
              </div>
              <div>
                <p className="font-semibold">Tokens Owed:</p>
                <p>
                  {formatEther(position.tokensOwed0)} {token0Symbol} / {formatEther(position.tokensOwed1)}{" "}
                  {token1Symbol}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="card-actions flex-col gap-2 mt-4">
          {isOwner && !isLocked(lock.unlockDate) && (
            <button className="btn btn-primary w-full" onClick={handleWithdraw}>
              Withdraw Position
            </button>
          )}

          {isOwner && (
            <>
              <button className="btn btn-outline w-full" onClick={() => setShowExtendModal(true)}>
                Extend Lock
              </button>

              <div className="space-y-2">
                <AddressInput
                  value={transferAddress}
                  onChange={setTransferAddress}
                  placeholder="Enter new owner address"
                />
                <button className="btn btn-secondary w-full" onClick={handleTransferOwnership}>
                  Transfer Ownership
                </button>
              </div>

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
            </>
          )}

          {isCollector && (
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
          )}
        </div>
      </div>

      {/* Extend Lock Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Extend Lock Period</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">New Unlock Date</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full"
                value={extendDate}
                onChange={e => setExtendDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-ghost" onClick={() => setShowExtendModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleRelock} disabled={!extendDate}>
                Extend Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
