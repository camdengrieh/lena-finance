import { useEffect, useState } from "react";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { PositionInfo, fetchPositions } from "~~/utils/uniswapV3/fetchPositions";

export const useFetchPositions = ({
  address,
  targetNetwork,
}: {
  address: string;
  targetNetwork: ChainWithAttributes;
}) => {
  const [positions, setPositions] = useState<PositionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPositions = async () => {
      setIsLoading(true);
      try {
        const { positions } = await fetchPositions({ address, targetNetwork });
        setPositions(positions as PositionInfo[]);
      } catch (error) {
        console.error("Error fetching positions:", error);
        setPositions([]);
      } finally {
        setIsLoading(false);
      }
    };

    getPositions();
  }, [address, targetNetwork]);

  return { positions, isLoading };
};
