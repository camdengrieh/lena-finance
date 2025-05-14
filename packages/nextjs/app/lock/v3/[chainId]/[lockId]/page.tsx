"use client";

import { useParams } from "next/navigation";
import { V3LockCard } from "~~/components/lock/V3LockCard";

const LockDetailsPage = () => {
  const params = useParams();

  return (
    <div className="flex flex-col gap-6 py-8 px-4 sm:px-6 lg:px-8">
      <V3LockCard lockId={params.lockId as string} />
    </div>
  );
};

export default LockDetailsPage;
