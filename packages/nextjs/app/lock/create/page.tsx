"use client";

import { useEffect, useMemo, useState } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { erc721Abi, formatEther, getAddress } from "viem";
import { useAccount, useChainId, useReadContract, useSimulateContract, useWriteContract } from "wagmi";
import { ArrowLeftIcon, ArrowPathIcon, LockClosedIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { LenaLockAbi } from "~~/abis/LenaLockAbi";
import { NetworkSelector } from "~~/components/lena/NetworkSelector";
import { AddressInput } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useFetchPositions } from "~~/hooks/scaffold-eth/useFetchPositions";
import scaffoldConfig from "~~/scaffold.config";
import { getPositionManagerAddress } from "~~/utils/dex/constants";
import { notification } from "~~/utils/scaffold-eth";
import { PositionInfo } from "~~/utils/uniswapV3/fetchPositions";

const LockPage = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");
  const { address, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [owner, setOwner] = useState(address);
  const [collectAddress, setCollectAddress] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [isEditingCollect, setIsEditingCollect] = useState(false);
  const [selectedDex, setSelectedDex] = useState("uniswap-v3");
  const [selectedFee, setSelectedFee] = useState("DEFAULT");
  const [positionManagerAddress, setPositionManagerAddress] = useState<string>("");

  const lenaLockAddress = "0x848B2e4C7D0aA1391D145b3629a517EBE0EC70b9";

  const chainId = useChainId();

  useEffect(() => {
    if (isConnected) {
      setSelectedNetwork(targetNetwork.name);
    } else {
      setSelectedNetwork("all");
    }
  }, [isConnected, targetNetwork.name]);

  useEffect(() => {
    if (address) {
      setOwner(address);
      setCollectAddress(address);
    }
  }, [address]);

  const { positions, isLoading }: { positions: PositionInfo[]; isLoading: boolean } = useFetchPositions({
    address: address || "0x0000000000000000000000000000000000000001",
    targetNetwork,
    selectedDex,
  });

  useEffect(() => {
    if (chainId && selectedDex) {
      try {
        const address = getPositionManagerAddress(chainId, selectedDex);
        setPositionManagerAddress(address);
      } catch (error) {
        console.warn(`No position manager found for chain ${chainId} and dex ${selectedDex}`, error);
        setPositionManagerAddress(""); // Reset to empty string if not found
      }
    }
  }, [chainId, selectedDex]);

  // Show warning if no position manager is available
  const isPositionManagerAvailable = Boolean(positionManagerAddress);

  const { data: approvedAddress, isFetching: fetchingAllowance } = useReadContract({
    address: positionManagerAddress,
    abi: erc721Abi,
    functionName: "getApproved",
    args: [selectedPosition?.tokenId],
  });

  const targetNetworks = scaffoldConfig.targetNetworks;
  const networks = ["all", ...targetNetworks.map(network => network.name)]; // Extract names

  // Lock Position
  const { writeContractAsync: lockPosition, isPending: isLocking } = useWriteContract({});
  // Set lock params with validation and debug
  const lockParams = useMemo(() => {
    if (!selectedPosition?.tokenId || !positionManagerAddress || !address || !unlockDate) {
      console.log("Missing required params:", {
        tokenId: selectedPosition?.tokenId,
        positionManagerAddress,
        address,
        unlockDate,
      });
      return null;
    }

    const params = {
      nftPositionManager: positionManagerAddress as `0x${string}`,
      nft_id: BigInt(selectedPosition.tokenId),
      dustRecipient: getAddress(address) as `0x${string}`,
      owner: getAddress(owner || address) as `0x${string}`,
      additionalCollector: "0x0000000000000000000000000000000000000000",
      collectAddress: getAddress(collectAddress || address) as `0x${string}`,
      unlockDate: BigInt(Math.floor(new Date(unlockDate).getTime() / 1000)),
      feeName: selectedFee,
      r: [] as `0x${string}`[],
    };

    console.log("Lock params:", params);
    return params;
  }, [selectedPosition, positionManagerAddress, address, owner, collectAddress, unlockDate, selectedFee]);

  // Simulate contract call with debug
  const {
    data: simulateData,
    isError: isSimulateError,
    error,
  } = useSimulateContract({
    address: lenaLockAddress as `0x${string}`,
    abi: LenaLockAbi,
    functionName: "lockAndConvert",
    args: lockParams ? [lockParams] : undefined, // Note: Double array as it's a struct
    query: {
      enabled: Boolean(lockParams),
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Simulation error:", error);
    }
  }, [error]);

  // Add supported DEXes by chain
  const supportedDexesByChain = {
    146: [
      // Sonic chain ID
      { id: "sushiswap", name: "SushiSwap V3" },
      { id: "spookyswap", name: "Spookyswap" },
    ],
    1: [
      // Ethereum mainnet
      { id: "uniswap-v3", name: "Uniswap V3" },
      { id: "pancakeswap-v3", name: "PancakeSwap V3" },
      { id: "sushiswap-v3", name: "SushiSwap V3" },
    ],
  } as const;

  const supportedDexes = supportedDexesByChain[chainId as keyof typeof supportedDexesByChain] || [];

  // Add fee options
  const feeOptions = [
    { id: "DEFAULT", name: "Default", description: "0.5% LP Fee, 2% Collect Fee", lpFee: "0.5%", collectFee: "2%" },
    {
      id: "LVP",
      name: "Large Volume Provider",
      description: "0.8% LP Fee, 1% Collect Fee",
      lpFee: "0.8%",
      collectFee: "1%",
    },
    {
      id: "LLP",
      name: "Large Liquidity Provider",
      description: "0.3% LP Fee, 3.5% Collect Fee",
      lpFee: "0.3%",
      collectFee: "3.5%",
    },
  ];

  // Add approval state
  const { writeContractAsync: approvePosition } = useWriteContract();
  const needsApproval = approvedAddress !== lenaLockAddress;

  const handleApprove = async () => {
    if (!selectedPosition?.tokenId || !positionManagerAddress) return;

    try {
      await approvePosition({
        address: positionManagerAddress as `0x${string}`,
        abi: erc721Abi,
        functionName: "approve",
        args: [lenaLockAddress, BigInt(selectedPosition.tokenId)],
      });
      notification.success("Position approved for locking");
    } catch (error) {
      console.error("Error approving position:", error);
      notification.error("Error approving position");
    }
  };

  const handleLock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockParams || !selectedPosition?.tokenId || isSimulateError || !simulateData) {
      notification.error("Cannot proceed with lock - simulation failed");
      console.error("Lock error:", error);
      return;
    }

    try {
      await lockPosition({
        ...simulateData.request,
        address: lenaLockAddress as `0x${string}`,
      });
      notification.success("Position locked successfully");
    } catch (error) {
      notification.error("Error locking position");
      console.error(error);
    }
  };

  const handlePositionSelect = (position: PositionInfo) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPosition(position);
      setIsTransitioning(false);
    }, 300);
  };

  const filteredPositions = positions?.filter(position =>
    position.pairSymbol?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      {!isConnected ? (
        <div className="justify-items-center">
          <DynamicWidget />
        </div>
      ) : (
        <div className="bg-base-100 shadow-xl rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <LockClosedIcon className="h-8 w-8 text-primary-content" />
                <h1 className="text-3xl font-bold">Lock V3 DEX Position</h1>
              </div>
              <select
                className="select select-bordered w-full max-w-xs"
                value={selectedDex}
                onChange={e => setSelectedDex(e.target.value)}
              >
                {supportedDexes.map(dex => (
                  <option key={dex.id} value={dex.id}>
                    {dex.name}
                  </option>
                ))}
              </select>
            </div>
            <NetworkSelector selectedNetwork={selectedNetwork} networks={networks} onChange={setSelectedNetwork} />
          </div>

          {!isPositionManagerAvailable && (
            <div className="alert alert-warning mb-4">
              <div>
                <h3 className="font-bold">Unsupported Network/DEX Combination</h3>
                <p>
                  The selected DEX is not available on this network. Please switch networks or select a different DEX.
                </p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className={`flex items-center gap-4 mb-4 ${selectedPosition ? "justify-center" : ""}`}>
              {selectedPosition && (
                <button
                  onClick={() => setSelectedPosition(null)}
                  className="absolute left-12 flex items-center gap-2 text-primary-content hover:opacity-80 transition-opacity"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Back to positions
                </button>
              )}
              <h2 className="text-xl font-semibold">{selectedPosition ? "Selected Position" : "Your Positions"}</h2>
            </div>

            {!selectedPosition && (
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search by pair symbol..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-10"
                />
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content opacity-60" />
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <ArrowPathIcon className="h-8 w-8 animate-spin text-primary-content" />
                <p className="text-base-content opacity-60">Loading positions...</p>
              </div>
            ) : (
              <div
                className={`grid gap-4 transition-all duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"} ${
                  selectedPosition ? "grid-cols-2 max-w-4xl mx-auto" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {filteredPositions?.map((position: PositionInfo) =>
                  selectedPosition ? (
                    selectedPosition.tokenId === position.tokenId && (
                      <>
                        <div key={position.tokenId} className="card bg-base-200 transition-all duration-300">
                          <div className="card-body">
                            <h3 className="card-title">{position.pairSymbol}</h3>
                            <p>Fee Tier: {Number(position.fee) / 10000}%</p>
                            <p>Liquidity: {formatEther(position.liquidity)}</p>
                          </div>
                        </div>
                        <div className="card bg-base-200 transition-all duration-300">
                          <div className="card-body">
                            <h3 className="card-title">Lock Overview</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="opacity-70">Owner:</span>
                                <span className="font-mono">
                                  {owner?.slice(0, 6)}...{owner?.slice(-4)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-70">Collect Address:</span>
                                <span className="font-mono">
                                  {collectAddress
                                    ? `${collectAddress.slice(0, 6)}...${collectAddress.slice(-4)}`
                                    : "Not set"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="opacity-70">Unlock Date:</span>
                                <span>{unlockDate ? new Date(unlockDate).toLocaleDateString() : "Not set"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )
                  ) : (
                    <div
                      key={position.tokenId}
                      className="card bg-base-200 cursor-pointer hover:bg-base-300 transition-all duration-300 hover:scale-105"
                      onClick={() => handlePositionSelect(position)}
                    >
                      <div className="card-body">
                        <h3 className="card-title">{position.pairSymbol}</h3>
                        <p>Fee Tier: {Number(position.fee) / 10000}%</p>
                        <p>Liquidity: {formatEther(position.liquidity)}</p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            {!selectedPosition && filteredPositions?.length === 0 && searchQuery && (
              <div className="text-center py-4 text-base-content opacity-60">
                No positions found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {selectedPosition && (
            <form onSubmit={handleLock} className="flex flex-col gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Owner Address</span>
                </label>
                <div className="relative">
                  {isEditingOwner ? (
                    <AddressInput
                      value={owner as string}
                      onChange={setOwner}
                      placeholder="Address that will own the locked position"
                    />
                  ) : (
                    <div className="flex items-center justify-between input input-bordered bg-base-200">
                      <span className="font-mono">
                        {owner?.slice(0, 6)}...{owner?.slice(-4)}
                      </span>
                      <button type="button" onClick={() => setIsEditingOwner(true)} className="btn btn-xs btn-ghost">
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Collect Address (optional)</span>
                </label>
                <div className="relative">
                  {isEditingCollect ? (
                    <AddressInput
                      value={collectAddress}
                      onChange={setCollectAddress}
                      placeholder="Address that will collect fees"
                    />
                  ) : (
                    <div className="flex items-center justify-between input input-bordered bg-base-200">
                      <span className="font-mono">
                        {collectAddress ? `${collectAddress.slice(0, 6)}...${collectAddress.slice(-4)}` : "Not set"}
                      </span>
                      <button type="button" onClick={() => setIsEditingCollect(true)} className="btn btn-xs btn-ghost">
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Unlock Date</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered"
                  value={unlockDate}
                  onChange={e => setUnlockDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fee Structure</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedFee}
                  onChange={e => setSelectedFee(e.target.value)}
                >
                  {feeOptions.map(fee => (
                    <option key={fee.id} value={fee.id}>
                      {fee.name}
                    </option>
                  ))}
                </select>

                {/* Fee explanation */}
                <div className="mt-4 space-y-4">
                  <div className="bg-base-200 p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Selected Fee Structure</h3>
                    {feeOptions.find(fee => fee.id === selectedFee) && (
                      <>
                        <p className="text-sm opacity-70 mb-2">
                          {feeOptions.find(fee => fee.id === selectedFee)?.description}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs opacity-70">LP Fee</p>
                            <p className="font-semibold">{feeOptions.find(fee => fee.id === selectedFee)?.lpFee}</p>
                            <p className="text-xs opacity-70 mt-1">Taken from initial liquidity</p>
                          </div>
                          <div>
                            <p className="text-xs opacity-70">Collect Fee</p>
                            <p className="font-semibold">
                              {feeOptions.find(fee => fee.id === selectedFee)?.collectFee}
                            </p>
                            <p className="text-xs opacity-70 mt-1">Taken when collecting rewards</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="alert alert-info">
                    <div>
                      <h3 className="font-bold">Understanding Fees</h3>
                      <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                        <li>LP Fee: One-time fee taken from the initial liquidity when locking</li>
                        <li>Collect Fee: Ongoing fee taken each time rewards are collected</li>
                        <li>Choose based on your expected trading volume and collection frequency</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {needsApproval ? (
                <button type="button" className="btn btn-primary" onClick={handleApprove} disabled={fetchingAllowance}>
                  {fetchingAllowance ? (
                    <>
                      <ArrowPathIcon className="h-6 w-6 animate-spin" /> Checking Approval...
                    </>
                  ) : (
                    <>Approve Position</>
                  )}
                </button>
              ) : (
                <button type="submit" className={`btn btn-primary ${isLocking ? "loading" : ""}`} disabled={isLocking}>
                  {isLocking ? (
                    <>
                      <ArrowPathIcon className="h-6 w-6 animate-spin" /> Locking Position...
                    </>
                  ) : (
                    "Lock Position"
                  )}
                </button>
              )}

              <div className="text-sm text-center opacity-70">
                {fetchingAllowance
                  ? "Checking approval status..."
                  : needsApproval
                    ? "Position needs approval before locking"
                    : "Position is approved for locking"}
              </div>
            </form>
          )}
        </div>
      )}

      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="space-y-4">
          <div className="alert alert-info">
            <div>
              <h3 className="font-bold">Step 1: Approve NFT</h3>
              <p>First, approve the Lena Lock contract to manage your Uniswap V3 NFT position.</p>
            </div>
          </div>
          <div className="alert alert-info">
            <div>
              <h3 className="font-bold">Step 2: Lock Position</h3>
              <p>Enter your NFT position ID and set the unlock date. The position will be locked until this date.</p>
            </div>
          </div>
          <div className="alert alert-info">
            <div>
              <h3 className="font-bold">Step 3: Collect Fees</h3>
              <p>You can still collect fees while your position is locked using the collect address.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockPage;
