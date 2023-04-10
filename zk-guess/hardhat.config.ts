import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";


// dynamically changes endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: false,
      }
    : {
        url: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli",
        zksync: true,
      };

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.5",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zkSyncTestnet",
  networks: {
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev", // URL of the zkSync network RPC
      ethNetwork: "goerli", // URL of the Ethereum Web3 RPC, or the identifier of the network (e.g. `mainnet` or `goerli`)
      zksync: true,
      // Verification endpoint for Goerli
      verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification',
    },
  },
  solidity: {
    version: "0.8.17",
  },
};

export default config;
