"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { UnlockProgress } from "../../../components/locks/UnlockProgress";
import { useRecentLocks } from "../../../hooks/locks/useRecentLocks";
import { formatEther } from "viem";
import { useChainId } from "wagmi";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const LockOverviewPage = () => {
  const chainId = useChainId();
  const { data: locks, loading } = useRecentLocks(chainId);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "all", // all, v2, v3
    status: "all", // all, active, completed
  });

  // Filter and search logic
  const filteredLocks = useMemo(() => {
    return locks.filter(lock => {
      const matchesSearch =
        searchTerm === "" ||
        lock.token0Symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lock.token1Symbol.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filters.type === "all" ||
        (filters.type === "v2" && Number(lock.nftId) === 0) ||
        (filters.type === "v3" && Number(lock.nftId) > 0);

      const now = Math.floor(Date.now() / 1000);
      const isCompleted = Number(lock.unlockDate) <= now;
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && !isCompleted) ||
        (filters.status === "completed" && isCompleted);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [locks, searchTerm, filters]);

  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by token symbol..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-base-content opacity-50" />
          </div>

          <div className="flex gap-4">
            <select
              className="select select-bordered"
              value={filters.type}
              onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="v2">V2 Only</option>
              <option value="v3">V3 Only</option>
            </select>

            <select
              className="select select-bordered"
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Token Pair</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Progress</th>
                <th>Unlock Date</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredLocks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No locks found
                  </td>
                </tr>
              ) : (
                filteredLocks.map(lock => (
                  <Link key={lock.lockId.toString()} href={`/lock/${lock.lockId.toString()}`}>
                    <tr className="hover cursor-pointer">
                      <td>{`${lock.token0Symbol} / ${lock.token1Symbol}`}</td>
                      <td>{Number(lock.nftId) > 0 ? "V3" : "V2"}</td>
                      <td>{Number(formatEther(lock.liquidity)).toFixed(3)} LP</td>
                      <td>
                        <UnlockProgress unlockDate={lock.unlockDate} createdAt={lock.createdAt} />
                      </td>
                      <td>{new Date(Number(lock.unlockDate) * 1000).toLocaleString()}</td>
                      <td>{new Date(Number(lock.createdAt) * 1000).toLocaleString()}</td>
                    </tr>
                  </Link>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LockOverviewPage;
