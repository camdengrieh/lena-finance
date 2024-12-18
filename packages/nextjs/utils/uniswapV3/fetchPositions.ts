import { ChainWithAttributes } from "../scaffold-eth";
import INONFUNGIBLE_POSITION_MANAGER from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { Abi, http } from "viem";
import { createConfig } from "wagmi";
import { readContract } from "wagmi/actions";

interface PositionInfo {
  tokenId: bigint;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  token0: string;
  token1: string;
  fee: number;
}

//TODO: Fetch address form ChainID key
const uniPositionManagerContractConfig = {
  abi: INONFUNGIBLE_POSITION_MANAGER.abi as Abi,
  address: "0xb7f724d6dddfd008eff5cc2834edde5f9ef0d075",
};

export const fetchPositions = async ({
  address,
  targetNetwork,
}: {
  address: string;
  targetNetwork: ChainWithAttributes;
}): Promise<PositionInfo[]> => {
  //TODO: Fetch to display from all chains or a selected chain
  const config = createConfig({
    chains: [targetNetwork],
    transports: {
      [targetNetwork.id]: http(),
    },
  });

  const totalPositions = await readContract(config, {
    ...uniPositionManagerContractConfig,
    functionName: "balanceOf",
    args: [address],
  });
  const positionIds = [];

  for (let i = 0; i < Number(totalPositions); i++) {
    const tokenId = await readContract(config, {
      ...uniPositionManagerContractConfig,
      functionName: "tokenOfOwnerByIndex",
      args: [address, i],
    });
    positionIds.push(tokenId);
  }

  const allPositionInfo: PositionInfo[] = [];

  for (const tokenId of positionIds) {
    const positionInfo = await readContract(config, {
      ...uniPositionManagerContractConfig,
      functionName: "positions",
      args: [tokenId],
    });

    allPositionInfo.push(positionInfo as PositionInfo);
  }

  return allPositionInfo;
};
