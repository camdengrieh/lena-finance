"use client";

import { useState } from "react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { LockTypeSelector } from "~~/components/lock/LockTypeSelector";
import { V2LockForm } from "~~/components/lock/V2LockForm";
import { V3LockForm } from "~~/components/lock/V3LockForm";

const LockPage = () => {
  const { isConnected } = useAccount();
  const [lockType, setLockType] = useState<"v2" | "v3">("v3");

  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      {!isConnected ? (
        <div className="justify-items-center">
          <DynamicWidget />
        </div>
      ) : (
        <div className="bg-base-100 shadow-xl rounded-3xl p-6">
          <div className="flex flex-col gap-6 mb-6">
            <h1 className="text-3xl font-bold">Create a Lock</h1>
            <LockTypeSelector selectedType={lockType} onSelectType={setLockType} />
          </div>

          {/* Render appropriate form based on selected lock type */}
          {lockType === "v3" ? <V3LockForm /> : <V2LockForm />}
        </div>
      )}

      <div className="bg-base-100 shadow-xl rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-4">How it works</h2>
        <div className="space-y-4">
          <div className="alert alert-info">
            <div>
              <h3 className="font-bold">Step 1: Select Lock Type</h3>
              <p>Choose between V2 (LP tokens) or V3 (NFT positions) based on your liquidity type.</p>
            </div>
          </div>
          <div className="alert alert-info">
            <div>
              <h3 className="font-bold">Step 2: Configure Lock</h3>
              <p>Select your position/tokens and set the unlock date and other parameters.</p>
            </div>
          </div>
          <div className="alert alert-info">
            <div>
              <h3 className="font-bold">Step 3: Create Lock</h3>
              <p>Confirm the transaction to lock your assets until the specified unlock date.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockPage;
