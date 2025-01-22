"use client";

import { useState } from "react";
import Link from "next/link";
import { UnlockProgress } from "../../components/locks/UnlockProgress";
import { useRecentLocks } from "../../hooks/locks/useRecentLocks";
import { formatEther } from "viem";
import { useChainId } from "wagmi";
import { LockClosedIcon, MagnifyingGlassIcon, PlusIcon, ViewfinderCircleIcon } from "@heroicons/react/24/outline";

const LockLandingPage = () => {
  const [activeTab, setActiveTab] = useState<"recent" | "upcoming">("recent");
  const chainId = useChainId();
  const { data: recentLocks, loading } = useRecentLocks(chainId);

  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <ViewfinderCircleIcon className="h-8 w-8 text-base-content" />
          <div className="tabs tabs-bordered">
            <button
              className={`tab ${activeTab === "recent" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("recent")}
            >
              Recent Locks
            </button>
            <button
              className={`tab ${activeTab === "upcoming" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Unlocks
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "recent" ? (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Token Pair</th>
                  <th>Amount</th>
                  <th>Unlock Date</th>
                  <th>Lock Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="hover">
                    <td>Loading...</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                ) : (
                  recentLocks.map(lock => (
                    <tr key={lock.lockId.toString()} className="hover">
                      <td>{`${lock.token0Symbol} / ${lock.token1Symbol}`}</td>
                      <td>{Number(formatEther(lock.liquidity)).toFixed(3)} LP</td>
                      <td>{new Date(Number(lock.unlockDate) * 1000).toLocaleString()}</td>
                      <td>{new Date(Number(lock.createdAt) * 1000).toLocaleString()}</td>
                      <UnlockProgress unlockDate={lock.unlockDate} createdAt={lock.createdAt} />
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Token Pair</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Time Remaining</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="hover">
                    <td>Loading...</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                ) : (
                  recentLocks.map(lock => (
                    <Link key={lock.lockId.toString()} href={`/lock/${lock.lockId.toString()}`}>
                      <tr className="hover">
                        <td>{`${lock.token0.slice(0, 6)}...${lock.token0.slice(-4)} / ${lock.token1.slice(0, 6)}...${lock.token1.slice(-4)}`}</td>
                        <td>{Number(lock.nftId) > 0 ? "V3" : "V2"}</td>
                        <td>{formatEther(lock.liquidity)} LP</td>
                        <td>
                          <UnlockProgress unlockDate={lock.unlockDate} createdAt={lock.createdAt} />
                        </td>
                        <td>{new Date(Number(lock.createdAt) * 1000).toLocaleDateString()}</td>
                      </tr>
                    </Link>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <LockClosedIcon className="h-8 w-8 text-base-content" />
          <h1 className="text-3xl font-bold">Uniswap Locks</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/lock/create"
            className="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer"
          >
            <div className="card-body flex flex-row items-center gap-4">
              <PlusIcon className="h-8 w-8 text-base-content" />
              <div>
                <h2 className="card-title">Create V3 Lock</h2>
                <p className="opacity-70">Lock a new Uniswap V3 position</p>
              </div>
            </div>
          </Link>

          <Link
            href="/lock/create-v2"
            className="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer"
          >
            <div className="card-body flex flex-row items-center gap-4">
              <PlusIcon className="h-8 w-8 text-base-content" />
              <div>
                <h2 className="card-title">Create V2 Lock</h2>
                <p className="opacity-70">Lock a new Uniswap V2 LP position</p>
              </div>
            </div>
          </Link>

          <Link
            href="/lock/my-locks"
            className="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer"
          >
            <div className="card-body flex flex-row items-center gap-4">
              <ViewfinderCircleIcon className="h-8 w-8 text-base-content" />
              <div>
                <h2 className="card-title">My Locks</h2>
                <p className="opacity-70">View and manage your locked positions</p>
              </div>
            </div>
          </Link>

          <Link
            href="/lock/overview"
            className="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer"
          >
            <div className="card-body flex flex-row items-center gap-4">
              <MagnifyingGlassIcon className="h-8 w-8 text-base-content" />
              <div>
                <h2 className="card-title">Explore Locks</h2>
                <p className="opacity-70">Browse all locked positions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-4">About Position Locking</h2>
        <div className="prose max-w-none">
          <p>
            Position locking allows you to temporarily lock your Uniswap V2 and V3 positions while still collecting
            fees. This can be useful for:
          </p>
          <ul>
            <li>Ensuring long-term liquidity provision</li>
            <li>Preventing accidental position modifications</li>
            <li>Demonstrating commitment to a project</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LockLandingPage;
