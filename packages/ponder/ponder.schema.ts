import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  BuyEvent: p.createTable({
    id: p.string(),
    buyer: p.string(),
    amount: p.bigint(),
    tokenAddress: p.string(),
    tokenSale: p.string(),
    timestamp: p.bigint(),
    network: p.int(),
  }),
  SellEvent: p.createTable({
    id: p.string(),
    seller: p.string(),
    amount: p.bigint(),
    tokenAddress: p.string(),
    tokenSale: p.string(),
    timestamp: p.bigint(),
    network: p.int(),
  }),
  Token: p.createTable({
    id: p.string(),
    tokenAddress: p.string(),
    tokenSaleAddress: p.string(),
    timestamp: p.bigint(),
    lastUpdated: p.bigint().optional(),
    network: p.int(),
    creatorAddress: p.string(),
  }),
}));
