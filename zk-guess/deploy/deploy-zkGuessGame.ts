import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();
// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// An example of a deploy script that will deploy and call the zkGame
export default async function (hre: HardhatRuntimeEnvironment) {
    // Initialize the wallet.
    const wallet = new Wallet(PRIVATE_KEY);

    // Create deployer object and load the artifact of the contract you want to deploy.
    const deployer = new Deployer(hre, wallet);
    const artifact = await deployer.loadArtifact("zkGuessGame");

    // Mint some tokens to the guessing game contract
    //   const token = await ethers.getContractAt('MyToken',        erc20Token.address) as IERC20;
    //await token.transfer(guessingGame.address, parseEther('10000'));

    //console.log('10000 tokens minted to guessing game contract.');

    //Choose the secret number for the game and token address
    const secretNumber = 12;
    const tokenAddress = "0x8B6faF65e3104Fb471326636F60Fcf4657B88922";
    const contractSettings = [secretNumber, tokenAddress];

    const deploymentFee = await deployer.estimateDeployFee(artifact, contractSettings);

    const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
    console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

    const zkGuessPlayContract = await deployer.deploy(artifact, contractSettings);

    const contractAddress = zkGuessPlayContract.address;
    console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}