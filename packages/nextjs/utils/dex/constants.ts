// DEX Position Manager Contract Addresses by Chain ID
export const POSITION_MANAGER_ADDRESSES: Record<number, Record<string, string>> = {
  146: {
    // Sonic
    sushiswap: "0xf807Aca27B1550Fe778fD4E7013BB57480b17fAc",
    spookyswap: "0xf807Aca27B1550Fe778fD4E7013BB57480b17fAc",
  },
  1: {
    // Ethereum
    "uniswap-v3": "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
    "pancakeswap-v3": "0x46A15B0b27311cedF172AB29E4f4766fbE7F4364",
    "sushiswap-v3": "0x2214A42d8e2A1d20635c2cb0664422c528B6A432",
  },
};

export const getPositionManagerAddress = (chainId: number, dex: string): string => {
  const address = POSITION_MANAGER_ADDRESSES[chainId]?.[dex];
  if (!address) {
    throw new Error(`No position manager address found for ${dex} on chain ${chainId}`);
  }
  return address;
};
