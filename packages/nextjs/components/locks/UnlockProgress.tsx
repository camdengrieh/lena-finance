interface UnlockProgressProps {
  unlockDate: bigint;
  createdAt: bigint;
}

export const UnlockProgress = ({ unlockDate, createdAt }: UnlockProgressProps) => {
  const now = Math.floor(Date.now() / 1000);
  const start = Number(createdAt);
  const end = Number(unlockDate);

  // Calculate progress percentage
  const total = end - start;
  const elapsed = now - start;
  const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);

  return (
    <div
      className="ml-2 radial-progress bg-primary text-primary-content border-primary border-4"
      style={{ "--value": progress, "--size": "1.5rem", "--thickness": "2px" } as React.CSSProperties}
      role="progressbar"
    ></div>
  );
};
