import React, { useState, useEffect} from "react";
import { ethers, BigNumber } from "ethers";
import MyContract from './zkGuessGame.json';
import Web3 from "web3";
import logo from './logo.svg';
import './App.css';

const CONTRACT_ADDRESS = "0x37FF9F9887632E753DB43cBDC1B87650A54802fe";


function App() {
    const [account, setAccount] = useState("");
    const [contractBalance, setContractBalance] = useState("");
    const [secretNumber, setSecretNumber] = useState("");
    const [guessNumber, setGuessNumber] = useState("");
    const [messageMM, setMessageMM] = useState("");
    const [balance, setBalance] = useState("");
    const [message, setMessage] = useState("");

    const connectToMetamask = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
    };
    // 0.00036
    //  .000272

    useEffect(() => {
        console.log(guessNumber, "guessNumer")
        async function loadBlockchainData() {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.enable();
                    // Get the current account address
                    const accounts = await web3.eth.getAccounts();
                    setAccount(accounts[0]);
                    // Get the current account balance
                    const balance = await web3.eth.getBalance(accounts[0]);
                    setBalance(web3.utils.fromWei(balance, "ether"));

                    // Instantiate the contract
                    const contract = new web3.eth.Contract(MyContract.abi, CONTRACT_ADDRESS);

                    // Get the contract balance
                    const contractBalance = await contract.methods.contractBalance().call();
                    const stringToBigNumberInWei = ethers.utils.parseUnits(contractBalance, "wei");
                    const ethValue = ethers.utils.formatEther(stringToBigNumberInWei);
                    const ethString = ethValue.toString()
                    console.log(typeof(ethString))
                    setContractBalance(ethString);
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.error("Please install MetaMask to use this dApp");
            }
        }
        loadBlockchainData();
    }, []);


    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, MyContract.abi, provider);


    useEffect(() => {
        if (window.ethereum) {
            connectToMetamask();
            contract.on('Winner', (winnerAddress, amountWon, tokens) => {
                if (winnerAddress === account) {
                    const ethValue = ethers.utils.formatEther(amountWon);
                    const ethString = ethValue.toString()
                    setMessage(`Congratulations! You won ${ethString} Eth and 100 zkGC tokens`);
                }
            });
            contract.on('Loser', (loserAddress, amountLost) => {
                if (loserAddress === account) {
                    setMessage(`Sorry, you lost 0.001 ETH.`);
                }
            });
        } else {
            console.error('Please install MetaMask to use this dApp');
        }
        return () => {
            contract.removeAllListeners('Winner');
            contract.removeAllListeners('Loser');
        };
    }, [account, contract]);


    async function playGame(e) {
        e.preventDefault();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, MyContract.abi, signer);

        const transaction = await contract.play(guessNumber, {
            value: ethers.utils.parseEther("0.001"),
            // gasLimit: 1000000,
        });
        console.log("transaction: ", transaction);
        const submittedTransaction = await signer.sendTransaction(transaction);

        const receipt = await submittedTransaction.wait();
        console.log("start of receipt: ", receipt)
        if (receipt.status === 1) {
            const txHash = receipt.transactionHash;
            console.log("Transaction hash: ", txHash);
            // setMessage("Congratulations, you won!");
        } else {
            // setMessage("Sorry, you lost.");
        }
    }

    return (
        <div>
            <div className="uk-section-default tm-section-texture">
                <div uk-sticky="media: 960" className="uk-navbar-container tm-navbar-container uk-navbar-transparent uk-sticky uk-sticky-fixed" style={{ position: "fixed", top: "0px", width: "1186px", fontFamily: "Inter", fontWeight: "600" }}>
                    <div className="uk-container uk-container-expand">
                        <nav className="uk-navbar uk-navbar-center">
                            <div className="uk-navbar-center">
                                <ul className="uk-navbar-nav uk-visible@m">
                                    <li>
                                        <a> Guess The Number </a>
                                    </li>
                                    <li>
                                        <a href="#">zkSync</a>
                                    </li>
                                    <li>
                                        <a href="docs/introduction">Solidity</a>
                                    </li>
                                </ul>
                                <div className="uk-navbar-item uk-visible@m">
                                    <button href="/"
                                        style={{ borderRadius: "500px", borderRadius: "10px", border: "1px solid #000000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} className="uk-button uk-button-default tm-button-default uk-icon ">
                                        <img style={{ height: "19px", width: "19px", display: "-webkit-inline-box", marginRight: "5px" }} />
                                        {account ? (<button>{account} </button>) : (<button onClick={connectToMetamask}>Connect to Metamask</button>)}
                                    </button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
                <div uk-height-viewport="offset-top: true; offset-bottom: true" className="uk-section uk-section-small uk-flex uk-flex-middle uk-text-center" style={{ minHeight: "calc((100vh - 80px) - 102.5px)" }}>
                    <div
                        className="uk-width-1-1"
                        style={{
                            position: "absolute",
                            top: "150px"
                        }}
                    >
                        <div className="uk-container">
                            <h1 className="uk-text-lead text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Guess The Number </h1>
                            <p className="uk-text-center">
                                <div className="bg-white p-4 rounded-lg flex items-center">
                                    <p className="text-lg font-bold text-blue-500"
                                    style={{ borderRadius: "500px", borderRadius: "10px", textOverflow: "initial", paddingLeft: "13vw", paddingRight: "13vw", marginBottom: "2vh"}}
                                    >
                                   Simply pick a number you believe is the secret number 1-100, including the 1 and 100. Click the "Play" button to submit your guess and pay 0.001 ETH.
                                   Wait for the transaction to be confirmed.
                                   If you guessed correctly, you will receive 80% of the contract value plus 100 of our ERC20 tokens. If you guessed incorrectly, your ETH value will be added to the contract.
                                    </p>
                                </div>
                            </p>
                            <div className="uk-card uk-card-default uk-card-body uk-width-1-2@m" style={{ borderRadius: "32px", display: "inline-block" }}>
                                <form onSubmit={playGame}>
                                    <fieldset className="uk-fieldset">
                                        <legend className="uk-legend">Guess The Number</legend>
                                        <div className="uk-margin">
                                            <div className="uk-column-1-2">
                                                <p> Balance: </p>
                                                <p> {balance} ETH</p>
                                            </div>
                                            <div className="uk-column-1-2">
                                                <p> Contract Balance: </p>
                                                <p>  {contractBalance} Total ETH</p>
                                            </div>
                                            <div
                                                className="flex justify-center"
                                                style={{ marginTop: "30px", marginBottom: "10px" }}
                                            >
                                                <input
                                                    type="number"
                                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:shadow-md"
                                                    placeholder="Enter your guess number"
                                                    value={guessNumber}
                                                    onChange={e => setGuessNumber(parseInt(e.target.value)) }
                                                />
                                            </div>
                                        </div>
                                        <div
                                            uk-grid=""
                                            className="uk-child-width-auto uk-grid-medium uk-flex-inline uk-flex-center uk-grid"
                                        >
                                        </div>
                                        {message && (
                                            <div className="uk-margin-bottom">
                                            <p>{message}</p>
                                            <button
                                                type="button"
                                                className="uk-button uk-button-default"
                                                onClick={() => {
                                                    setMessage();
                                                    setGuessNumber();
                                                }}
                                            >
                                                Play Again
                                            </button>
                                        </div>
                                    )}
                                    {!message && (
                                        <button
                                            type="submit"
                                            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                                <svg
                                                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                ></svg>
                                            </span>
                                            Play
                                        </button>
                                    )}
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
