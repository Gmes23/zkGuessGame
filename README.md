# Guessing Game on zkSync Testnet
This project is a simple guessing number game built on the zkSync Testnet using TypeScript, Hardhat, Solidity, and React.

### Contract Details
ERC-20 Token Contract
There are two smart contracts, the token contract and the game contract.The ERC-20 token contract can be minted, and some tokens are pre-minted in the constructor. It can be found at address `0x8B6faF65e3104Fb471326636F60Fcf4657B88922`[https://goerli.explorer.zksync.io/address/0x8B6faF65e3104Fb471326636F60Fcf4657B88922#transactions]

#### Guessing Game Contract
The guessing game contract stores a secret number. Players can guess the secret number by paying 0.001 ETH. If a player guesses the number correctly, they receive 80% of the contract value plus 100 ERC20 tokens. If they do not guess the correct number, the ETH value is added to the contract. The deploying account owns the contract, and only the owner can change the secret number. The game contract can be found at `https://goerli.explorer.zksync.io/address/0x37FF9F9887632E753DB43cBDC1B87650A54802fe`[https://goerli.explorer.zksync.io/address/0x37FF9F9887632E753DB43cBDC1B87650A54802fe] with current secret number being 1. This can be change in the `playGame.ts` script

#### Events
```solidity
Winner(address winner, uint256 amount): emitted when there is a winner.
Loser(address loser, uint256 amount): emitted when the user loses.
```

## Project structure

- `/zkcoin-guessergame`: front end, users connect to metamask and interact with the smart contracts in the ui.
- `/zk-guess`: smart contracts, deployment and contract interaction scripts.
- `/test`: test files
- `hardhat.config.ts`: configuration file.


### Deployment
To deploy make sure to `npm install` or `yarn install` in both the zkcoin-guessergame folder and zkguess foler
- run `npm start` on the zkcoin-guessergame folder to launch the front end

This project is hooked up to use the two zksync contracts needed, both are already launch on testnet along with two disposable wallets, so it should run right out the box.

If you wish to launch your own smart contracts.
- Run `yarn hardhat compile`  on the zk-guess folder to compile the contracts. 
- Run `yarn hardhat deploy-zksync --script deploy-zkGuessCoin.ts` will execute the deployment for the ERC20 token and console.log constructor arguments, which can later be use to verify the smart contract, this is needed for the game contract in order for the token transfer using the call method to work
- Run `yarn hardhat deploy zksync --script deploy-zkGuessGame.ts` for the game contract each contract should log  their respective address on success
- Both contracts are deployed to zkSync Testnet and should run on your [http://localhost:3000](http://localhost:3000)

### Frontend
The frontend is built using React. The UI is a single page to play the guessing game with a form to enter the guessed number.

### How to Play
To play the guessing number game:

Simply pick a number you believe is the secret number 1-100, including the 1 and 100. Click the "Play" button to submit your guess and pay 0.001 ETH.
Wait for the transaction to be confirmed.
If you guessed correctly, you will receive 80% of the contract value plus 100 of our ERC20 tokens. If you guessed incorrectly, your ETH value will be added to the contract.

### Why You Shouldn't Use transfer() in Smart Contracts and special Notes about zkSync
`transfer()` is a function that transfers Ether from one account to another in Solidity. However, on the zkSync network, using `transfer()` is discouraged due to its high gas cost. This is because zkSync uses a Layer 2 scaling solution that relies on off-chain computation to minimize the amount of data that needs to be stored on-chain. As a result, every on-chain transaction requires significant computation, which translates to higher gas costs.

Instead it best to follow the [consensys](https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/) recommendation and stop using `transfer()` and `send()` altogethor in your code and switch to using `call()` method as shown in the zkGuessGame smart contract instead: This function has a much lower gas cost and ensures that transactions are fast and efficient, if you are worried about re-entry consensys has a great article that goes more in depth [here](https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/)

### Resources
To learn more about the technologies used in this project, check out the following resources:


- **[zkSync](https://era.zksync.io/docs/dev/)**
- **[Solidity](https://docs.soliditylang.org/en/latest/)**
- **[Solidity learn by example](https://solidity-by-example.org/)**
- **[Hardhat](https://hardhat.org/docs)**
- **[TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)**
- **[React](https://react.dev/learn)**

#### Acknowledgments 
This project was created using the [zksync-cli](https://era.zksync.io/docs/api/tools/zksync-cli/) tool.







