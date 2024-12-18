import { useEffect, useState } from "react";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { fetchPositions } from "~~/utils/uniswapV3/fetchPositions";

export const useFetchPositions = ({
  address,
  targetNetwork,
}: {
  address: string;
  targetNetwork: ChainWithAttributes;
}) => {
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    const getPositions = async () => {
      const positions = await fetchPositions({ address, targetNetwork });
      setPositions(positions);
    };

    getPositions();
  }, [address, targetNetwork]);

  return { positions };
};
