"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Abi } from "viem";
import { useAccount, useChainId, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { ArrowPathIcon, LockClosedIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { NetworkSelector } from "~~/components/lena/NetworkSelector";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";
import { notification } from "~~/utils/scaffold-eth";

interface Lock {
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

const MyLocksPage = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");
  const { address } = useAccount();
  const chainId = useChainId();
  const [searchQuery, setSearchQuery] = useState("");
  const [locks, setLocks] = useState<Lock[]>([]);
  const [extendDate, setExtendDate] = useState<string>("");
  const [transferAddress, setTransferAddress] = useState<string>("");
  const [selectedLockId, setSelectedLockId] = useState<string>("");

  const { data: LenaLockContract } = useScaffoldContract({
    contractName: "LenaLock",
  });

  const lenaLockContract = {
    address: LenaLockContract?.address,
    abi: LenaLockContract?.abi as Abi,
  } as const;

  // Contract write functions
  const { writeContractAsync: withdrawLock } = useWriteContract();
  const { writeContractAsync: relockPosition } = useWriteContract();
  const { writeContractAsync: transferOwnership } = useWriteContract();

  // Get number of locks
  const { data: numLocks } = useReadContract({
    ...lenaLockContract,
    functionName: "getNumUserLocks",
    args: [address],
  });

  // Get all locks in one call
  const { data: locksData, isFetching } = useReadContracts({
    contracts: Array.from({ length: Number(numLocks || 0) }, (_, i) => ({
      ...lenaLockContract,
      functionName: "getUserLockAtIndex",
      args: [address as string, BigInt(i)],
    })),
  });

  useEffect(() => {
    if (locksData) {
      setLocks(locksData.map(data => data.result) as Lock[]);
    }
  }, [locksData]);

  const filteredLocks = locks.filter(
    lock => lock.nft_id.toString().includes(searchQuery) || lock.lock_id.toString().includes(searchQuery),
  );

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  const isLocked = (unlockDate: bigint) => {
    return Number(unlockDate) * 1000 > Date.now();
  };

  const handleWithdraw = async (lockId: bigint) => {
    try {
      await withdrawLock({
        address: lenaLockContract.address as `0x${string}`,
        abi: lenaLockContract.abi,
        functionName: "withdraw",
        args: [lockId, address],
      });
      notification.success("Position withdrawn successfully");
    } catch (error) {
      console.error("Error withdrawing position:", error);
      notification.error("Failed to withdraw position");
    }
  };

  const handleRelock = async (lockId: bigint) => {
    if (!extendDate) {
      notification.error("Please select a new unlock date");
      return;
    }

    try {
      const newUnlockDate = BigInt(Math.floor(new Date(extendDate).getTime() / 1000));
      await relockPosition({
        address: lenaLockContract.address as `0x${string}`,
        abi: lenaLockContract.abi,
        functionName: "relock",
        args: [lockId, newUnlockDate],
      });
      notification.success("Position relocked successfully");
      setExtendDate("");
    } catch (error) {
      console.error("Error relocking position:", error);
      notification.error("Failed to relock position");
    }
  };

  const handleTransferOwnership = async (lockId: bigint) => {
    if (!transferAddress) {
      notification.error("Please enter a transfer address");
      return;
    }

    try {
      await transferOwnership({
        address: lenaLockContract.address as `0x${string}`,
        abi: lenaLockContract.abi,
        functionName: "transferLockOwnership",
        args: [lockId, transferAddress as `0x${string}`],
      });
      notification.success("Ownership transfer initiated");
      setTransferAddress("");
    } catch (error) {
      console.error("Error transferring ownership:", error);
      notification.error("Failed to transfer ownership");
    }
  };

  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <LockClosedIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">My Locked Positions</h1>
          </div>
          <NetworkSelector
            selectedNetwork={selectedNetwork}
            networks={scaffoldConfig.targetNetworks.map(n => n.name)}
            onChange={setSelectedNetwork}
          />
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by Lock ID or NFT ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input input-bordered w-full pl-10"
          />
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-60" />
        </div>

        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
            <p className="text-base-content opacity-60">Loading locks...</p>
          </div>
        ) : locks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base-content opacity-60">No locked positions found</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocks.map(lock => (
              <Link
                key={lock.lock_id.toString()}
                href={`/lock/${chainId}/${lock.lock_id.toString()}`}
                className="card bg-base-200 hover:bg-base-300 transition-all duration-200"
              >
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title">Lock #{lock.lock_id.toString()}</h3>
                    <div className={`badge ${isLocked(lock.unlockDate) ? "badge-primary" : "badge-success"}`}>
                      {isLocked(lock.unlockDate) ? "Locked" : "Unlocked"}
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <p>
                      <span className="opacity-70">NFT ID:</span> {lock.nft_id.toString()}
                    </p>
                    <p>
                      <span className="opacity-70">Unlock Date:</span> {formatDate(lock.unlockDate)}
                    </p>
                    <p className="truncate">
                      <span className="opacity-70">Collect Address:</span> {lock.collectAddress}
                    </p>
                    {lock.additionalCollector !== "0x0000000000000000000000000000000000000000" && (
                      <p className="truncate">
                        <span className="opacity-70">Additional Collector:</span> {lock.additionalCollector}
                      </p>
                    )}
                  </div>

                  {/* Action buttons for owner */}
                  {address === lock.owner && (
                    <div className="card-actions justify-end mt-4" onClick={e => e.preventDefault()}>
                      {!isLocked(lock.unlockDate) ? (
                        <>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              setSelectedLockId(lock.lock_id.toString());
                              const modal = document.getElementById("relock-modal") as HTMLDialogElement;
                              modal?.showModal();
                            }}
                          >
                            Relock
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleWithdraw(lock.lock_id)}>
                            Withdraw
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedLockId(lock.lock_id.toString());
                            const modal = document.getElementById("transfer-modal") as HTMLDialogElement;
                            modal?.showModal();
                          }}
                        >
                          Transfer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Relock Modal */}
      <dialog id="relock-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Extend Lock Period</h3>
          <div className="py-4">
            <input
              type="datetime-local"
              className="input input-bordered w-full"
              value={extendDate}
              onChange={e => setExtendDate(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Close</button>
            </form>
            <button className="btn btn-primary" onClick={() => handleRelock(BigInt(selectedLockId))}>
              Relock
            </button>
          </div>
        </div>
      </dialog>

      {/* Transfer Modal */}
      <dialog id="transfer-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Transfer Lock Ownership</h3>
          <div className="py-4">
            <input
              type="text"
              placeholder="Enter recipient address"
              className="input input-bordered w-full"
              value={transferAddress}
              onChange={e => setTransferAddress(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Close</button>
            </form>
            <button className="btn btn-primary" onClick={() => handleTransferOwnership(BigInt(selectedLockId))}>
              Transfer
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default MyLocksPage;
