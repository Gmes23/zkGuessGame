const { ethers } = require("ethers");
const gameContract = require('./zkGuessGame.json');

const CONTRACT_ADDRESS = "0x37FF9F9887632E753DB43cBDC1B87650A54802fe";

const provider = new ethers.providers.JsonRpcProvider("https://testnet.era.zksync.dev");

async function playGame(guessNumber) {
  const privateKeyPlayer = "a65a356640b09b1a09ee12e589592bdae64b4cadc0165c09c4882480dec7b5ae";
  const wallet = new ethers.Wallet(privateKeyPlayer, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, gameContract.abi, wallet);

  const transaction = await contract.play(guessNumber, {
    value: ethers.utils.parseEther("0.001"),
    gasLimit: 100000,
  });
  contract.on("Winner", (winnerAddress, prize, tokens) => {
    console.log(`Winner: ${winnerAddress}`);
    console.log(`Prize: ${prize}`);
    console.log(`Tokens: ${tokens}`);
  });

  // Listen for the Loser event
  contract.on("Loser", (loser, amount) => {
    console.log(`Address ${loser} lost ${amount} ETH!`);
  });

  const signedTransaction = await wallet.signTransaction(transaction);

  const submittedTransaction = await provider.sendTransaction(signedTransaction);

  const receipt = await submittedTransaction.wait();

  console.log("start of receipt: ", receipt.transactionHash, )

  if (receipt.status === 1) {
    console.log("Transaction has: ", receipt.transactionHash);
  } else {
    console.log("Something went wrong please try again.");
  }
}

const guessNumber = 2;

playGame(guessNumber).then(() => {
  console.log("Transaction submitted successfully!");
}).catch((error) => {
  console.error(error);
});

async function changeSecretNumber(secretNumber) {
  //Private key of Owner of contract, only owner can change the number
  const privateKeyOwner = "e9f4eb2701907519e006716d3a248108f479ff42af880f626f62c4005975e0e7";
  const wallet = new ethers.Wallet(privateKeyOwner, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, gameContract.abi, wallet);

  const transaction = await contract.changeSecretNumber(secretNumber);

  const signedTransaction = await wallet.signTransaction(transaction);

  const submittedTransaction = await provider.sendTransaction(signedTransaction);

  const receipt = await submittedTransaction.wait();

  console.log("start of receipt for change secret Number: ", receipt.transactionHash, )

  if (receipt.status === 1) {
    console.log("Transaction has: ", receipt.transactionHash);
  } else {
    console.log("Something went wrong please try again.");
  }

}
