import { ethers } from 'hardhat';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

interface DeploymentConfig {
  network: string;
  contractAddress: string;
  deployerAddress: string;
  gasUsed: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}

class BlockchainDeploymentService {
  private deploymentHistory: DeploymentConfig[] = [];
  private configPath = join(process.cwd(), 'deployed-contracts.json');

  constructor() {
    this.loadDeploymentHistory();
  }

  private loadDeploymentHistory() {
    try {
      const data = readFileSync(this.configPath, 'utf8');
      this.deploymentHistory = JSON.parse(data);
    } catch (error) {
      console.log('No previous deployment history found, starting fresh');
      this.deploymentHistory = [];
    }
  }

  private saveDeploymentHistory() {
    writeFileSync(this.configPath, JSON.stringify(this.deploymentHistory, null, 2));
  }

  async deployToBase(): Promise<DeploymentConfig> {
    try {
      console.log('Deploying OrderFi contracts to Base network...');
      
      // Switch to Base network
      const network = await ethers.provider.getNetwork();
      console.log(`Connected to network: ${network.name} (${network.chainId})`);

      // Get deployment account
      const [deployer] = await ethers.getSigners();
      console.log(`Deploying from account: ${deployer.address}`);

      // Deploy MimiRewards contract
      const MimiRewards = await ethers.getContractFactory('MimiRewards');
      const mimiRewards = await MimiRewards.deploy();
      await mimiRewards.waitForDeployment();

      const deploymentReceipt = await mimiRewards.deploymentTransaction()?.wait();
      
      const config: DeploymentConfig = {
        network: network.name,
        contractAddress: await mimiRewards.getAddress(),
        deployerAddress: deployer.address,
        gasUsed: deploymentReceipt?.gasUsed.toString() || '0',
        transactionHash: deploymentReceipt?.hash || '',
        blockNumber: deploymentReceipt?.blockNumber || 0,
        timestamp: Date.now()
      };

      this.deploymentHistory.push(config);
      this.saveDeploymentHistory();

      console.log(`✅ Contract deployed to: ${config.contractAddress}`);
      console.log(`   Transaction: ${config.transactionHash}`);
      console.log(`   Gas used: ${config.gasUsed}`);

      return config;
    } catch (error) {
      console.error('Base deployment failed:', error);
      throw new Error(`Base deployment failed: ${error.message}`);
    }
  }

  async deployToPolygon(): Promise<DeploymentConfig> {
    try {
      console.log('Deploying OrderFi contracts to Polygon network...');
      
      const network = await ethers.provider.getNetwork();
      const [deployer] = await ethers.getSigners();

      const MimiRewards = await ethers.getContractFactory('MimiRewards');
      const mimiRewards = await MimiRewards.deploy();
      await mimiRewards.waitForDeployment();

      const deploymentReceipt = await mimiRewards.deploymentTransaction()?.wait();
      
      const config: DeploymentConfig = {
        network: network.name,
        contractAddress: await mimiRewards.getAddress(),
        deployerAddress: deployer.address,
        gasUsed: deploymentReceipt?.gasUsed.toString() || '0',
        transactionHash: deploymentReceipt?.hash || '',
        blockNumber: deploymentReceipt?.blockNumber || 0,
        timestamp: Date.now()
      };

      this.deploymentHistory.push(config);
      this.saveDeploymentHistory();

      console.log(`✅ Polygon contract deployed to: ${config.contractAddress}`);
      return config;
    } catch (error) {
      console.error('Polygon deployment failed:', error);
      throw new Error(`Polygon deployment failed: ${error.message}`);
    }
  }

  async verifyContract(config: DeploymentConfig): Promise<boolean> {
    try {
      console.log(`Verifying contract on ${config.network}...`);
      
      // Verify contract source code on block explorer
      const verificationResult = await ethers.run('verify:verify', {
        address: config.contractAddress,
        constructorArguments: []
      });

      console.log(`✅ Contract verified: ${config.contractAddress}`);
      return true;
    } catch (error) {
      console.warn(`Contract verification failed: ${error.message}`);
      return false;
    }
  }

  getDeploymentHistory(): DeploymentConfig[] {
    return this.deploymentHistory;
  }

  getLatestDeployment(network?: string): DeploymentConfig | undefined {
    const filtered = network 
      ? this.deploymentHistory.filter(d => d.network === network)
      : this.deploymentHistory;
    
    return filtered.sort((a, b) => b.timestamp - a.timestamp)[0];
  }

  async estimateGasCosts(): Promise<{ base: string; polygon: string }> {
    try {
      const [deployer] = await ethers.getSigners();
      const MimiRewards = await ethers.getContractFactory('MimiRewards');
      
      const deploymentData = MimiRewards.getDeployTransaction();
      const gasEstimate = await ethers.provider.estimateGas(deploymentData);
      const gasPrice = await ethers.provider.getFeeData();

      const baseCost = gasEstimate * (gasPrice.gasPrice || BigInt(0));
      
      return {
        base: ethers.formatEther(baseCost),
        polygon: ethers.formatEther(baseCost / BigInt(10)) // Polygon is ~10x cheaper
      };
    } catch (error) {
      console.error('Gas estimation failed:', error);
      return { base: '0.01', polygon: '0.001' };
    }
  }
}

export const blockchainDeployment = new BlockchainDeploymentService();