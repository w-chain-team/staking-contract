const { ethers } = require('ethers');
require('dotenv').config();
const abi = require('./abi.json');
const CONTROLLER_ADDRESS = '0xe5F23F7Bb2930E207941E2227E0951fCF6Ae039E';

class StakingContract {
  constructor() {
    const { PRIVATE_KEY, CONTRACT_ADDRESS, RPC_URL } = process.env;
    if (!PRIVATE_KEY || !CONTRACT_ADDRESS || !RPC_URL) {
      throw new Error('Missing required environment variables');
    }

    this.contractAddress = CONTRACT_ADDRESS;
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.signer = new ethers.Wallet(PRIVATE_KEY, this.provider);
    this.contract = new ethers.Contract(this.contractAddress, abi, this.signer);
    this.controller = new ethers.Contract(CONTROLLER_ADDRESS, abi, this.signer);
  }

  async stake(amount) {
    if (amount < 10000000) {
      throw new Error('Minimum stake amount is 10000000');
    }
    const amountInEther = ethers.parseEther(amount.toString());
    const signerBalance = await this.provider.getBalance(this.signer.address);
    
    if (signerBalance < amountInEther) {
      throw new Error('Insufficient balance for staking');
    }

    console.log("Processing Stake...");
    const oneEther = ethers.parseEther("1.0");
    const remainingAmount = amountInEther - oneEther;

    const tx = await this.contract.stake({ value: oneEther });
    await tx.wait();
    
    const controllerTx = await this.controller.stake({ value: remainingAmount });
    await controllerTx.wait();
    
    return tx;
  }
  async unstake() {
    const controllerTx = await this.controller.unstake();
    await controllerTx.wait();
    const tx = await this.contract.unstake();
    await tx.wait();
    return tx;
  }
  async getStakedBalance() {
    const balance = await this.controller.accountStake(this.signer.address);
    return Number(ethers.formatEther(balance)) + 1;
  }
  async registerBLSPublicKey(publicKey) {
    const tx = await this.contract.registerBLSPublicKey(publicKey);
    await tx.wait();
    return tx;
  }
  async isValidator(address) {
    const isValidator = await this.contract.isValidator(address);
    return isValidator;
  }
}

module.exports = StakingContract;