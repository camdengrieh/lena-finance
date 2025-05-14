"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ChartBarIcon, LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="min-h-screen">
      <div className="flex items-center flex-col pt-10">
        {/* Hero Section */}
        <div className="hero py-8">
          <div className="hero-content text-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in-down">Secure Your Liquidity with Lena Finance</h1>
              <p className="py-6 text-lg opacity-80">
                The most trusted liquidity locking platform for DeFi projects. Protect your investors and build trust in
                your community.
              </p>
              {connectedAddress && (
                <div className="flex justify-center items-center gap-2 mb-6">
                  <span className="text-sm opacity-70">Connected as:</span>
                  <Address address={connectedAddress} />
                </div>
              )}
              <div className="flex gap-4 justify-center">
                <Link href="/lock/create" className="btn btn-primary btn-lg animate-pulse-slow">
                  Lock Liquidity
                </Link>
                <Link href="/explore" className="btn btn-outline btn-lg">
                  View Locks
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-16 w-full max-w-7xl">
          <div className="card bg-base-100/70 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="card-body items-center text-center">
              <LockClosedIcon className="h-12 w-12 text-base-content mb-4" />
              <h2 className="card-title">Secure Locking</h2>
              <p>Time-locked liquidity with automated release mechanisms and full transparency.</p>
            </div>
          </div>

          <div className="card bg-base-100/70 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="card-body items-center text-center">
              <ShieldCheckIcon className="h-12 w-12 text-base-content mb-4" />
              <h2 className="card-title">Trusted Platform</h2>
              <p>Join thousands of projects that trust Lena Finance for their liquidity management.</p>
            </div>
          </div>

          <div className="card bg-base-100/70 backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300">
            <div className="card-body items-center text-center">
              <ChartBarIcon className="h-12 w-12 text-base-content mb-4" />
              <h2 className="card-title">Analytics</h2>
              <p>Comprehensive dashboard to track your locked liquidity and upcoming releases.</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="w-full bg-base-100/70 backdrop-blur-sm py-12">
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full max-w-4xl mx-auto">
            <div className="stat">
              <div className="stat-title">Total Value Locked</div>
              <div className="stat-value">$10.2M</div>
              <div className="stat-desc">↗︎ 400 (22%)</div>
            </div>
            <div className="stat">
              <div className="stat-title">Active Locks</div>
              <div className="stat-value">4,200</div>
              <div className="stat-desc">↗︎ 90 (14%)</div>
            </div>
            <div className="stat">
              <div className="stat-title">Trusted Projects</div>
              <div className="stat-value">1.2K</div>
              <div className="stat-desc">↗︎ 150 (28%)</div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
