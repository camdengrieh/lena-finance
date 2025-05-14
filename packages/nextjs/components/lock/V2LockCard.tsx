import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export function V2LockCard({ token, lockIndex }: { token: string; lockIndex: number }) {
  const { address } = useAccount();

  // Get lock details
  const { data: lockInfo } = useScaffoldReadContract({
    contractName: "UniswapV2Locker",
    functionName: "getUserLockForTokenAtIndex",
    args: [address, token, lockIndex],
  });

  // Format date from Unix timestamp
  const formatDate = (timestamp: bigint) => {
    if (!timestamp) return "Unknown";
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  // Withdraw function - updated to use correct pattern
  const { writeContractAsync, isPending } = useScaffoldWriteContract("UniswapV2Locker");

  // Check if lock is withdrawable
  const isWithdrawable = lockInfo?.unlockDate < BigInt(Math.floor(Date.now() / 1000));

  const handleWithdraw = async () => {
    await writeContractAsync({
      functionName: "withdraw",
      args: [lockInfo?.lockID, lockInfo?.amount],
    });
  };

  if (!lockInfo) return <div className="card shadow-lg">Loading...</div>;

  return (
    <div className="card shadow-lg bg-base-100">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title">LP Lock #{lockInfo.lockID.toString()}</h2>
          <span className="badge badge-primary">V2</span>
        </div>

        <div className="py-2">
          <div className="grid grid-cols-3 gap-1 text-sm">
            <span className="font-semibold">Token:</span>
            <span className="col-span-2">
              <Address address={lockInfo.lpToken} />
            </span>

            <span className="font-semibold">Amount:</span>
            <span className="col-span-2">{formatEther(lockInfo.amount)} LP</span>

            <span className="font-semibold">Lock Date:</span>
            <span className="col-span-2">{formatDate(lockInfo.lockDate)}</span>

            <span className="font-semibold">Unlock Date:</span>
            <span className="col-span-2">{formatDate(lockInfo.unlockDate)}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-2">
          {isWithdrawable ? (
            <button className="btn btn-sm btn-primary" onClick={handleWithdraw} disabled={isPending}>
              {isPending ? "Withdrawing..." : "Withdraw"}
            </button>
          ) : (
            <button className="btn btn-sm btn-disabled">Locked until {formatDate(lockInfo.unlockDate)}</button>
          )}
        </div>
      </div>
    </div>
  );
}
