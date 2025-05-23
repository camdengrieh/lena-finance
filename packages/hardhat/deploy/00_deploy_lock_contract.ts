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

  // Get the bytecode for UniswapV2Locker
  // For UniswapV2Locker, we need:
  // 1. uniswapFactory address
  // 2. fee address (payable)
  const uniswapFactory = "0xE6e8DbD21B9f5994D94Ae68B2A2e5c431EF77338"; // Mainnet UniswapV2 Factory
  const feeAddress = "0x2c0fb49C3b47E2C854B92aC5A8Aac59cbC8272b6"; // Using the lpFee address

  const UniswapV2Locker = await ethers.getContractFactory("UniswapV2Locker");
  const bytecode =
    UniswapV2Locker.bytecode +
    ethers.AbiCoder.defaultAbiCoder().encode(["address", "address"], [uniswapFactory, feeAddress]).slice(2); // Remove '0x' prefix

  // Calculate deterministic address before deployment
  const factoryContract = await ethers.getContractAt("LenaLockFactory", factory.address);
  const salt = ethers.id("LENA_LOCK_V2"); // You can change this salt as needed
  const bytecodeHash = ethers.keccak256(bytecode);

  const predictedAddress = await factoryContract.computeAddress(salt, bytecodeHash);
  console.log("Predicted UniswapV2Locker address:", predictedAddress);

  // Deploy UniswapV2Locker using the factory
  const tx = await factoryContract.deploy(bytecode, salt);
  await tx.wait();

  // Verify the contract
  //await hre.run("verify:verify", {
  //address: predictedAddress,
  //constructorArguments: [uniswapFactory, feeAddress],
  //});
};

export default deployLenaLock;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployLenaLock.tags = ["V2", "V2Lock"];
