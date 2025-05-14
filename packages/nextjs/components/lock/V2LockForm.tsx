import { useState } from "react";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export function V2LockForm() {
  const { address } = useAccount();
  const [lpToken, setLpToken] = useState("");
  const [amount, setAmount] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [feeInEth, setFeeInEth] = useState(true);

  // Get LP token balance
  const { data: lpBalance } = useScaffoldReadContract({
    contractName: "UniswapV2Locker",
    functionName: "balanceOf",
    args: [address],
    address: lpToken || undefined, // Only query when lpToken is set
  });

  // Handle max button click
  const handleMaxClick = () => {
    if (lpBalance) {
      setAmount(formatEther(lpBalance));
    }
  };

  // Convert Unix timestamp for contract
  const getUnlockTimestamp = () => {
    if (!unlockDate) return 0;
    return Math.floor(new Date(unlockDate).getTime() / 1000);
  };

  // Write function - updated to use correct pattern
  const { writeContractAsync, isPending } = useScaffoldWriteContract("UniswapV2Locker");

  // Handle locking
  const handleLock = async () => {
    await writeContractAsync({
      functionName: "lockLPToken",
      args: [
        lpToken, // LP token address
        parseEther(amount) || 0n, // amount in wei
        BigInt(getUnlockTimestamp()), // unlock date in seconds
        "0x0000000000000000000000000000000000000000", // referral address (none)
        feeInEth, // fee in ETH instead of token
        address, // withdrawer (set to current user)
      ],
      value: feeInEth ? 1000000000000000000n : 0n, // 1 ETH if paying in ETH
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="label">
          <span className="label-text">LP Token Address</span>
        </label>
        <AddressInput value={lpToken} onChange={setLpToken} />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Amount to Lock</span>
          {lpToken && lpBalance && (
            <span className="label-text-alt">
              Balance: {formatEther(lpBalance)} LP
              <button className="btn btn-xs btn-primary ml-2" onClick={handleMaxClick}>
                MAX
              </button>
            </span>
          )}
        </label>
        <input
          type="number"
          className="input input-bordered w-full"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.0"
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Unlock Date</span>
        </label>
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          value={unlockDate}
          onChange={e => setUnlockDate(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Pay Fee in ETH</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={feeInEth}
            onChange={e => setFeeInEth(e.target.checked)}
          />
        </label>
      </div>

      <button className="btn btn-primary" onClick={handleLock} disabled={isPending}>
        {isPending ? "Creating Lock..." : "Create Lock"}
      </button>
    </div>
  );
}
