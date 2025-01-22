import { LockEvent } from "../../types/lock";
import { gql, useQuery } from "@apollo/client";

const LocksQuery = gql`
  query GetLocks($chainId: Int!) {
    locks(orderBy: "createdAt", orderDirection: "desc", where: { chainId: $chainId }) {
      items {
        lockId
        nftPositionManager
        nftId
        owner
        unlockDate
        poolAddress
        pendingOwner
        token0
        token1
        token0Symbol
        token1Symbol
        liquidity
        createdAt
        chainId
      }
    }
  }
`;

interface UseRecentLocksResult {
  data: LockEvent[];
  loading: boolean;
  error: any;
}

export const useRecentLocks = (chainId: number): UseRecentLocksResult => {
  const { data, loading, error } = useQuery(LocksQuery, {
    variables: { chainId: chainId ? chainId : undefined },
    pollInterval: 1000,
  });

  const recentLocks: LockEvent[] = data?.locks?.items || [];

  return { data: recentLocks, loading, error };
};
