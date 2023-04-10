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

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("zkGuessCoin");

  // Create ERC20 token parameters
  /* NOTE : zkSync uses a fixed-point arithmetic system with 18 decimal places, which is similar to Ethereum's native token system (ERC20) but with 18 decimal places instead of the usual 18. When you deposit tokens to zkSync, they are multiplied by 10^18, and the resulting number is represented as an integer on zkSync. So our initial supply - 2 decimal points due to our decimalUnits
  */
  const initialSupply = ethers.utils.parseEther('1');
  const tokenName = 'zkGuessCoin';
  const tokenSymbol = 'zkGC';
  const decimalUnits = 2;
  const preMintAmount = ethers.utils.parseEther('.01');

  const tokenSettings = [initialSupply, tokenName, tokenSymbol, decimalUnits, preMintAmount];

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact,tokenSettings);
  console.log(`Running deploy script for the zkGuessCoin contract`);
  // ⚠️ OPTIONAL: You can skip this block if your account already has funds in L2
  // Deposit funds to L2
  // const depositHandle = await deployer.zkWallet.deposit({
  //   to: deployer.zkWallet.address,
  //   token: utils.ETH_ADDRESS,
  //   amount: deploymentFee.mul(2),
  // });
  // // Wait until the deposit is processed on zkSync
  // await depositHandle.wait();

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const tokenContract = await deployer.deploy(artifact, tokenSettings);

  //obtain the Constructor Arguments
  console.log(
    "constructor args:" + tokenContract.interface.encodeDeploy(tokenSettings)
  );

  // Show the contract info.
  const contractAddress = tokenContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
