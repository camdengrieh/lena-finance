"use client";

import Link from "next/link";
import { LockClosedIcon, PlusIcon, ViewfinderCircleIcon } from "@heroicons/react/24/outline";

const LockLandingPage = () => {
  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <LockClosedIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Uniswap V3 Position Locks</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/lock/create"
            className="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer"
          >
            <div className="card-body flex flex-row items-center gap-4">
              <PlusIcon className="h-8 w-8 text-primary" />
              <div>
                <h2 className="card-title">Create Lock</h2>
                <p className="opacity-70">Lock a new Uniswap V3 position</p>
              </div>
            </div>
          </Link>

          <Link
            href="/lock/my-locks"
            className="card bg-base-200 hover:bg-base-300 transition-all duration-300 cursor-pointer"
          >
            <div className="card-body flex flex-row items-center gap-4">
              <ViewfinderCircleIcon className="h-8 w-8 text-primary" />
              <div>
                <h2 className="card-title">My Locks</h2>
                <p className="opacity-70">View and manage your locked positions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-4">About Position Locking</h2>
        <div className="prose max-w-none">
          <p>
            Position locking allows you to temporarily lock your Uniswap V3 positions while still collecting fees. This
            can be useful for:
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
