"use client";

import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { ArrowPathIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { AddressInput } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";
import { useFetchPositions } from "~~/hooks/scaffold-eth/useFetchPositions";
import scaffoldConfig from "~~/scaffold.config";
import { notification } from "~~/utils/scaffold-eth";

const LockPage = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("all");
  const { address, isConnected } = useAccount();
  const { targetNetwork } = useTargetNetwork();
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [owner, setOwner] = useState("");
  const [collectAddress, setCollectAddress] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [feeName, setFeeName] = useState("DEFAULT");

  useEffect(() => {
    if (isConnected) {
      setSelectedNetwork(targetNetwork.name);
    } else {
      setSelectedNetwork("all");
    }
  }, [isConnected, targetNetwork.name]);

  const { positions } = useFetchPositions({
    address: address || "",
    targetNetwork,
  });

  const targetNetworks = scaffoldConfig.targetNetworks;
  const networks = ["all", ...targetNetworks.map(network => network.name)]; // Extract names

  // Lock Position
  const { writeContractAsync: lockPosition, isPending: isLocking } = useWriteContract({});

  const handleLock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosition) return;

    try {
      const params = {
        nftPositionManager: "0xb7f724d6dddfd008eff5cc2834edde5f9ef0d075",
        nft_id: selectedPosition.tokenId,
        owner: owner || address,
        additionalCollector: "0x0000000000000000000000000000000000000000",
        collectAddress: collectAddress || address,
        unlockDate: BigInt(new Date(unlockDate).getTime() / 1000),
        feeName,
        dustRecipient: address,
        r: [],
      };

      await lockPosition({
        args: [params],
        abi: [],
        functionName: "",
        address: "",
      });
    } catch (error) {
      notification.error("Error locking position");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <LockClosedIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Lock Uniswap V3 Position</h1>
        </div>

        <select
          value={selectedNetwork}
          onChange={e => setSelectedNetwork(e.target.value)}
          className="px-4 py-2 rounded bg-base-200"
        >
          {networks.map(network => (
            <option key={network} value={network}>
              {network.charAt(0).toUpperCase() + network.slice(1)}
            </option>
          ))}
        </select>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {positions.map((position: any) => (
              <div
                key={position.tokenId.toString()}
                className={`card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors ${
                  selectedPosition?.tokenId === position.tokenId ? "border-2 border-primary" : ""
                }`}
                onClick={() => setSelectedPosition(position)}
              >
                <div className="card-body">
                  <h3 className="card-title">Position #{position.tokenId.toString()}</h3>
                  <p>Token0: {position.token0}</p>
                  <p>Token1: {position.token1}</p>
                  <p>Fee Tier: {position.fee / 10000}%</p>
                  <p>Liquidity: {position.liquidity.toString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedPosition && (
          <form onSubmit={handleLock} className="flex flex-col gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Owner Address (optional)</span>
              </label>
              <AddressInput value={owner} onChange={setOwner} placeholder="Address that will own the locked position" />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Collect Address (optional)</span>
              </label>
              <AddressInput
                value={collectAddress}
                onChange={setCollectAddress}
                placeholder="Address that will collect fees"
              />
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
                min={new Date().toISOString().split(".")[0]}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Fee Type</span>
              </label>
              <select
                className="select select-bordered"
                value={feeName}
                onChange={e => setFeeName(e.target.value)}
                required
              >
                <option value="DEFAULT">Default</option>
                <option value="LVP">LVP (Lower Fee)</option>
                <option value="LLP">LLP (Higher Fee)</option>
              </select>
            </div>

            <button type="submit" className={`btn btn-primary ${isLocking ? "loading" : ""}`} disabled={isLocking}>
              {isLocking ? (
                <>
                  <ArrowPathIcon className="h-6 w-6 animate-spin" /> Locking Position...
                </>
              ) : (
                "Lock Position"
              )}
            </button>
          </form>
        )}
      </div>

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
