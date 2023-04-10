// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./zkGuessCoin.sol";

contract zkGuessGame{
    address public owner;
    uint256 public secretNumber;
    uint256 public contractBalance;
    zkGuessCoin public token;

    event Winner(address winner, uint256 amount, uint256 tokens);
    event Loser(address loser, uint256 amount);

    constructor(uint256 _secretNumber, zkGuessCoin _token) {
        owner = msg.sender;
        secretNumber = _secretNumber;
        token = _token;
    }

    function play(uint256 _guess) external payable {
        require(msg.value == 0.001 ether, "You need to pay 0.001 ETH to play");

        if (_guess == secretNumber) {
            uint256 prize = contractBalance * 80 / 100;
            uint256 tokens = 10000;
            contractBalance -= prize;
            (bool success, ) = address(token).call(abi.encodeWithSignature("transfer(address,uint256)", msg.sender, tokens));
            require(success, "Token transfer failed");
            payable(msg.sender).call{value: prize, gas: gasleft() - 2000}("");
            emit Winner(msg.sender, prize, tokens);
        } else {
            contractBalance += msg.value;
            emit Loser(msg.sender, msg.value);
        }
    }

    function changeSecretNumber(uint256 _newSecretNumber) external {
        require(msg.sender == owner, "Only the owner can change the secret number");
        secretNumber = _newSecretNumber;
    }

    function withdraw() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        payable(msg.sender).transfer(address(this).balance);
    }
}
