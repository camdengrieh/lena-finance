import INONFUNGIBLE_POSITION_MANAGER from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */

const externalContracts = {
  unichainSepolia: {
    NonfungiblePositionManager: {
      address: 0xb7f724d6dddfd008eff5cc2834edde5f9ef0d075,
      abi: INONFUNGIBLE_POSITION_MANAGER,
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
