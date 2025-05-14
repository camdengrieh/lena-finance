import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployLenaLock: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` or `yarn account:import` to import your
    existing PK which will fill DEPLOYER_PRIVATE_KEY_ENCRYPTED in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get owner address from env or use deployer as fallback
  const owner = process.env.LENA_LOCK_OWNER || deployer;
  console.log("Using owner address:", owner);

  // First deploy the factory
  const factory = await deploy("LenaLockFactory", {
    from: deployer,
    args: [],
    log: true,
  });

  // Get the bytecode for LenaLock
  const autoCollectAddress = "0xf5E6B7206e7DEbc4e2558fA7667ECa2C84aBF7Fa";
  const revenueFeeCollection = "0xE6a6f5ea01e7F7afF1E800C8AbF64ab6ab59B996";
  const lpFee = "0xFb8180fDdf4F8df3967B821db8dc92D080DB0912";

  const LenaLock = await ethers.getContractFactory("LenaLock");
  const bytecode =
    LenaLock.bytecode +
    ethers.AbiCoder.defaultAbiCoder()
      .encode(["address", "address", "address", "address"], [owner, autoCollectAddress, lpFee, revenueFeeCollection])
      .slice(2); // Remove '0x' prefix

  // Calculate deterministic address before deployment
  const factoryContract = await ethers.getContractAt("LenaLockFactory", factory.address);
  const salt = ethers.id("LENA_LOCK_V1"); // You can change this salt as needed
  const bytecodeHash = ethers.keccak256(bytecode);

  const predictedAddress = await factoryContract.computeAddress(salt, bytecodeHash);
  console.log("Predicted LenaLock address:", predictedAddress);

  // Deploy LenaLock using the factory
  const tx = await factoryContract.deploy(bytecode, salt);
  await tx.wait();

  // Verify the contract
  await hre.run("verify:verify", {
    address: predictedAddress,
    constructorArguments: [owner, autoCollectAddress, lpFee, revenueFeeCollection],
  });
};

export default deployLenaLock;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployLenaLock.tags = ["LenaLock", "LenaLockFactory"];
