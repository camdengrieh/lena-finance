import { useEffect, useState } from "react";
import { PositionInfo, fetchPositions } from "~~/utils/dex/fetchPositions";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

export const useFetchPositions = ({
  address,
  targetNetwork,
  selectedDex,
}: {
  address: string;
  targetNetwork: ChainWithAttributes;
  selectedDex: string;
}) => {
  const [positions, setPositions] = useState<PositionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPositions = async () => {
      setIsLoading(true);
      try {
        const { positions } = await fetchPositions({ address, targetNetwork, selectedDex });
        setPositions(positions as PositionInfo[]);
      } catch (error) {
        console.error("Error fetching positions:", error);
        setPositions([]);
      } finally {
        setIsLoading(false);
      }
    };

    getPositions();
  }, [address, targetNetwork, selectedDex]);

  return { positions, isLoading };
};
