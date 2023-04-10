const { ethers } = require("ethers");
const { Wallet } = require('zksync');
const { Provider, Contract } = require("zksync-web3");
const erc20Contract = require('./zkGuessCoin.json')
const contractGame = require('./zkGuessGAme.json')

// Game contract address
const CONTRACT_ADDRESS = "0x37FF9F9887632E753DB43cBDC1B87650A54802fe";

const provider = new Provider("https://testnet.era.zksync.dev");

// Token Address 
const erc20Address = "0x8B6faF65e3104Fb471326636F60Fcf4657B88922";

// Owner Address of token and game 
const userAddress = '0x8C37fC554038E78Fe9d5358EfA17543E069cD930';
const privateKey = 'e9f4eb2701907519e006716d3a248108f479ff42af880f626f62c4005975e0e7';


async function checkUserBalanceERC20() {
    
    // Create a new ethers wallet with the private key
    const wallet = new ethers.Wallet(privateKey, provider);
    
    
    // Create a new contract instance for the ERC20 token
    const erc20 = new ethers.Contract(erc20Address, erc20Contract.abi, wallet);
    
    // Check the balance of the user account before the transfer
    const balanceBefore = await erc20.balanceOf(userAddress);
    console.log(`User balance before transfer: ${ethers.utils.formatUnits(balanceBefore)}`);

    // Approve the transfer of tokens to the smart contract
    const amount = ethers.utils.parseUnits('10000');
    const approved = await erc20.approve(CONTRACT_ADDRESS, amount);
    console.log('Approved transfer:', approved.hash);


    // Wait for the transaction to be confirmed on zkSync
    await approved.wait();

    // Transfer the approved tokens to the GuessTheNumber contract
    const transfer = await erc20.transfer(CONTRACT_ADDRESS, amount);
    console.log('Transferred tokens:', transfer.hash);

    // Wait for the transaction to be confirmed on the blockchain
    await transfer.wait();

    // Check the balance of the user account after the transfer
    const balanceAfter = await erc20.balanceOf(userAddress);
    console.log(`User balance after transfer: ${ethers.utils.formatUnits(balanceAfter)}`);

}
checkUserBalanceERC20()

