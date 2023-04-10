# Guessing Game on zkSync Testnet
This project is a simple guessing number game built on the zkSync Testnet using TypeScript, Hardhat, Solidity, and React.

### Contract Details
#### ERC-20 Token Contract
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
`transfer()` is a function that transfers Ether from one account to another in Solidity. However, on the zkSync network, using `transfer()` is discouraged due to its high gas cost.
As stated by zksync "any smart contract that uses transfer() or send() is taking a hard dependency on gas costs, because these functions forward a hardcoded amount of 2300 gas.
1) fallback() function can consume more than 2300 gas, 
2) opcode gas pricing can change in future version of Ethereum, and your contract will break." 

Instead it's best to follow the [consensys](https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/) recommendation and stop using `transfer()` and `send()` altogethor in your code and switch to using the `call()` method as shown in the zkGuessGame smart contract.
```typescript
  (bool success, ) = address(token).call(abi.encodeWithSignature("transfer(address,uint256)", msg.sender, tokens));
  require(success, "Token transfer failed");
  payable(msg.sender).call{value: prize, gas: gasleft() - 2000}("");
  emit Winner
```
In our `play()` function in the smart contract when a player wins tokens and eth are transfer, ignoring the token transfer for now, we look at the payable execution
```ts
  payable(msg.sender).call{value: prize, gas: gasleft() - 2000}(""):
```
This sends the prize amount in Ether to the winner's address using the call function, which allows the contract to send Ether to an address. The payable keyword is used to indicate that the function can receive Ether. The prize variable is the amount of Ether to be transferred, and `msg.sender` is the winner's address. The `gasleft()` function is used to determine how much gas is left in the transaction, and the `gas: gasleft() - 2000` part of the code ensures that enough gas is left for the function to complete successfully. Finally, the empty string `("")` is passed as a parameter to the call function. This function has a much lower gas cost and ensures that our transactions goes thru, if you are worried about re-entry consensys has a great article that goes more in depth [here](https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/)

```typescript
 (bool success, ) = address(token).call(abi.encodeWithSignature("transfer(address,uint256)", msg.sender, tokens));
    require(success, "Token transfer failed");
```
In this part of the function when the player wins this transfers tokens from the game contract to the winner's address. `address(token)` is the address of the token contract, and transfer is the function that transfers tokens. The call function is used to execute this function on the token contract, with the arguments encoded as per the `abi.encodeWithSignature` function, verification of the smart contract is needed for this to work. The result of this call is a tuple, where the first element is a boolean indicating whether the call succeeded or not.

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







