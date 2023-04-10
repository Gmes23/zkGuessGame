import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as ContractArtifact from "../artifacts-zk/contracts/zkGuessGame.sol/zkGuessGame.json";

const PRIVATE_KEY = "a65a356640b09b1a09ee12e589592bdae64b4cadc0165c09c4882480dec7b5ae";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const CONTRACT_ADDRESS = "0x22dae177e961F35A5a91e922dca0eB450c544f33";

if (!CONTRACT_ADDRESS) throw "⛔️ Contract address not provided";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to interact with contract ${CONTRACT_ADDRESS}`);

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // Initialise contract instance
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ContractArtifact.abi,
    signer
  );


  // send transaction to update the message
  const tx = await contract.play(23,
    {value: ethers.utils.parseEther("0.001"), 
    gasLimit: 1600000
  });

  console.log(`Transaction to change the message is ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(receipt)
}
