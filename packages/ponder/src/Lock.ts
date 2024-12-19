import { ponder } from "@/generated";

ponder.on("TokenFactory:TokenCreated", async ({ event, context }) => {
  const { Token } = context.db;
  const { network } = context;
  const { timestamp } = event.block;
  
  const { tokenAddress, tokenSaleAddress, creatorAddress } = event.args;

  await Token.create({
    id: tokenAddress,
    data: {
      tokenAddress,
      tokenSaleAddress,
      timestamp,
      lastUpdated: timestamp,
      network: network.chainId,
      creatorAddress,
    },
  });
});