import { ponder } from "@/generated";

ponder.on("TokenReader:TokensBought", async ({ event, context }) => {
  const { BuyEvent, Token } = context.db;
  const { timestamp } = event.block;
  const { tokenSale } = event.args;
  const tokenReader = context.contracts.TokenReader;

  if (!tokenReader) {
    return;
  }
  const tokenAddress = await context.client.readContract({
    ...tokenReader,
    functionName: "getTokenOfTokenSale",
    args: [tokenSale],
  });

  await BuyEvent.create({
    id: event.log.id,
    data: {
      buyer: event.args.buyer,
      amount: event.args.amount,
      tokenSale,
      tokenAddress,
      timestamp,
      network: context.network.chainId,
    },
  });

  //find the token and update the lastUpdated field if it exists
  const token = await Token.findUnique({
      id: tokenAddress,
  });

  if (token === null) {

  const creatorAddress = await context.client.readContract({
    ...tokenReader,
    functionName: "getCreatorAddress",
    args: [tokenAddress],
  });

    await Token.create({
      id: tokenAddress,
      data: {
        timestamp,
        tokenAddress,
        tokenSaleAddress: tokenSale,
        lastUpdated: timestamp,
        network: context.network.chainId,
        creatorAddress
      },
    });
  }
  else {
    await Token.update({
      id: tokenAddress,
    data: {
      lastUpdated: timestamp,
      },
    });
    
  }
});

ponder.on("TokenReader:TokensSold", async ({ event, context }) => {
  const { SellEvent, Token } = context.db;
  const { timestamp } = event.block;
  const { tokenSale } = event.args;
  const tokenReader = context.contracts.TokenReader;

  if (!tokenReader) {
    return;
  }
  const tokenAddress = await context.client.readContract({
    ...tokenReader,
    functionName: "getTokenOfTokenSale",
    args: [tokenSale],
  });

  await SellEvent.create({
    id: event.log.id,
    data: {
      seller: event.args.seller,
      amount: event.args.amount,
      tokenSale,
      tokenAddress,
      timestamp,
      network: context.network.chainId,
    },
  });

  //find the token and update the lastUpdated field if it exists
  const token = await Token.findUnique({
    id: tokenAddress,
});

if (token === null) {

  const creatorAddress = await context.client.readContract({
    ...tokenReader,
    functionName: "getTokenCreator",
    args: [tokenAddress],
  });

  await Token.create({
    id: tokenAddress,
    data: {
      timestamp,
      tokenAddress,
      tokenSaleAddress: tokenSale,
      lastUpdated: timestamp,
      network: context.network.chainId,
      creatorAddress
    },
  });
}
else {
  await Token.update({
    id: tokenAddress,
  data: {
    lastUpdated: timestamp,
    },
  });
  
}
});
