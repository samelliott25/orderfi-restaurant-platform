import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployMimiRewards: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying MimiRewards contract...");
  
  const mimiRewards = await deploy("MimiRewards", {
    from: deployer,
    args: [], // Constructor arguments
    log: true,
    waitConfirmations: 1,
  });

  console.log(`MimiRewards deployed to: ${mimiRewards.address}`);
  
  // Verify contract on explorer if not on local network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
    
    try {
      await hre.run("verify:verify", {
        address: mimiRewards.address,
        constructorArguments: [],
      });
      console.log("Contract verified on block explorer");
    } catch (error) {
      console.log("Verification failed:", error);
    }
  }
};

deployMimiRewards.tags = ["MimiRewards", "all"];

export default deployMimiRewards;