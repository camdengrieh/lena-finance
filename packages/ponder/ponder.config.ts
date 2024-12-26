import { createConfig } from "ponder";
import { http } from "viem";
import deployedContracts from "./contracts/deployedContracts";
import scaffoldConfig from "./scaffold.config";

const targetNetworks = scaffoldConfig.targetNetworks;

const networks = Object.fromEntries(
  targetNetworks.map((network) => [
    network.name,
    {
      chainId: network.id,
      transport: http(process.env[`PONDER_RPC_URL_${network.id}`]),
    },
  ])
);

const contracts = Object.fromEntries(
  targetNetworks.flatMap((network) => {
    const networkContracts = deployedContracts[network.id];
    // if the network is not in the deployedContracts, return an empty array
    if (!networkContracts) {
      return [];
    }
    return Object.keys(networkContracts).map((contractName) => [
      `${contractName}`,
      {
        network: network.name,
        abi: networkContracts[contractName].abi,
        address: networkContracts[contractName].address,
        startBlock: networkContracts[contractName].startBlock || 14675730,
      },
    ]);
  })
);

export default createConfig({
  networks,
  contracts,
});
