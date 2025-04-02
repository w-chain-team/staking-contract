#!/usr/bin/env node

const StakingContract = require('./index');

const printUsage = () => {
  console.log('Usage: node cli.js <command> [arguments]');
  console.log('\nCommands:');
  console.log('  stake <amount>            - Stake the specified amount (minimum 10000000)');
  console.log('  unstake <amount>          - Unstake the specified amount');
  console.log('  getStakedBalance         - Get your staked balance');
  console.log('  registerBLSPublicKey <key> - Register BLS public key');
  console.log('  isValidator <address>     - Check if address is a validator');
};

const main = async () => {
  try {
    const [command, ...args] = process.argv.slice(2);
    
    if (!command) {
      printUsage();
      process.exit(1);
    }

    const contract = new StakingContract();

    switch (command.toLowerCase()) {
      case 'stake':
        if (!args[0] || Number(args[0]) < 10000000) {
          console.error('Error: Amount must be at least 10000000');
          process.exit(1);
        }
        const stakeTx = await contract.stake(args[0]);
        console.log('Stake transaction:', stakeTx.hash);
        break;

      case 'unstake':
        const unstakeTx = await contract.unstake();
        console.log('Unstake transaction:', unstakeTx.hash);
        break;

      case 'getstakedbalance':
        const balance = await contract.getStakedBalance();
        console.log('Staked balance:', balance);
        break;

      case 'registerblspublickey':
        if (!args[0]) {
          console.error('Error: Public key required');
          process.exit(1);
        }
        const registerTx = await contract.registerBLSPublicKey(args[0]);
        console.log('Register transaction:', registerTx.hash);
        break;

      case 'isvalidator':
        if (!args[0]) {
          console.error('Error: Address required');
          process.exit(1);
        }
        const isValidator = await contract.isValidator(args[0]);
        console.log('Is validator:', isValidator);
        break;

      default:
        console.error('Error: Unknown command');
        printUsage();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

main();