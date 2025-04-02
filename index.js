const { ethers } = require('ethers');
require('dotenv').config();
const abi = require('./abi.json');

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

    const tx = await this.contract.stake({ value: amountInEther });
    await tx.wait();
    
    return tx;
  }
  async unstake() {
    const tx = await this.contract.unstake();
    await tx.wait();
    return tx;
  }
  async getStakedBalance() {
    const balance = await this.contract.accountStake(this.signer.address);
    return ethers.formatEther(balance);
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