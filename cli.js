#!/usr/bin/env node

const StakingContract = require('./index');

const printUsage = () => {
  console.log('Usage: node cli.js <command> [arguments]');
  console.log('\nCommands:');
  console.log('  stake <amount>             - Stake the specified amount');
  console.log('  unstake                    - Unstake all staked token at once');
  console.log('  getStakedBalance           - Get your staked balance');
  console.log('  registerBLSPublicKey <key> - Register BLS public key');
  console.log('  isValidator <address>      - Check if address is a validator');
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
        console.log('Staking ', args[0], ' WCO...');
        console.log('Minimum Staked required to activate Validator Node is 10M WCO');
        const stakeTx = await contract.stake(args[0]);
        console.log('Stake transaction:', stakeTx.hash);
        console.log('Fetching Staked WCO for this account...');
        const newBalance = await contract.getStakedBalance();
        console.log('Staked balance:', newBalance);
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