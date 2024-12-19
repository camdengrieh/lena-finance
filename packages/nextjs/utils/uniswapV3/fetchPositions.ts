import { ChainWithAttributes } from "../scaffold-eth";
import INONFUNGIBLE_POSITION_MANAGER from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { Abi, erc20Abi, http } from "viem";
import { createConfig } from "wagmi";
import { readContract } from "wagmi/actions";

export interface PositionInfo {
  tokenId: bigint;
  token0: string;
  token1: string;
  fee: bigint;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  pairSymbol?: string;
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
}): Promise<{ positions: PositionInfo[] }> => {
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
    const positionFormatted: PositionInfo = {
      tokenId: tokenId as bigint,
      token0: (positionInfo as any[])[2] as string,
      token1: (positionInfo as any[])[3] as string,
      fee: (positionInfo as any[])[4] as bigint,
      tickLower: (positionInfo as any[])[5] as number,
      tickUpper: (positionInfo as any[])[6] as number,
      liquidity: (positionInfo as any[])[7] as bigint,
      feeGrowthInside0LastX128: (positionInfo as any[])[8] as bigint,
      feeGrowthInside1LastX128: (positionInfo as any[])[9] as bigint,
      tokensOwed0: (positionInfo as any[])[10] as bigint,
      tokensOwed1: (positionInfo as any[])[11] as bigint,
    };

    const tokenSymbol1 = await readContract(config, {
      abi: erc20Abi,
      address: positionFormatted.token0,
      functionName: "symbol",
    });

    const tokenSymbol2 = await readContract(config, {
      abi: erc20Abi,
      address: positionFormatted.token1,
      functionName: "symbol",
    });

    positionFormatted.pairSymbol = `${tokenSymbol1} / ${tokenSymbol2}`;

    allPositionInfo.push(positionFormatted);
  }

  return { positions: allPositionInfo };
};
