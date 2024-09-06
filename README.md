# MovieVoting Smart Contract

This project contains a Solidity smart contract for creating movie voting sessions on the Ethereum blockchain. Users can create sessions, vote for movies, and get the winning movie.

# Features

Deploy the contract on Ethereum (Sepolia network) using Remix.
Create a movie voting session.
Cast votes for movies in an active session.
Automatically calculate and declare the winning movie after voting ends.

# Prerequisites

Before getting started, ensure you have the following:

- MetaMask: A browser extension wallet to manage your Ethereum accounts. Install MetaMask
- Sepolia Test ETH: Obtain test ETH from a Sepolia faucet.
  -Remix IDE: An online Solidity IDE. Access Remix
- Git: To clone the repository. Install Git

# Installation

1. Clone the Repository

```shell
git clone https://github.com/yourusername/movie-voting.git
cd movie-voting
```

2. Install dependencies
   If you plan to run tests or make modifications using Hardhat:

```shell
npm install
```

# Running Tests (Optional)

If you want to run the test suite using Hardhat:

```shell
npm install
```

# Deploying to Sepolia Using Remix

Follow these steps to deploy the MovieVoting contract on the Sepolia testnet using Remix:

1. Prepare MetaMask for Sepolia
   Add Sepolia Network to MetaMask:
   If Sepolia isn't already added to your MetaMask, follow these steps:
   Open MetaMask and click on the network dropdown at the top.
   Select "Add Network".
   Enter the following details:

Network Name Sepolia
New RPC URL https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID (Replace with your Infura project ID or use another RPC provider)
Chain ID 11155111
Currency Symbol ETH
Block Explorer URL https://sepolia.etherscan.io
Click "Save".

Obtain Sepolia ETH:
Use a Sepolia faucet to request test ETH. Ensure your MetaMask is connected to the Sepolia network.

2. Access Remix IDE
   Open Remix IDE in your web browser.

3. Import the MovieVoting Contract
   Create a New File:
   In Remix, click on the "File Explorer" icon.
   Click the "+" button to create a new file.
   Name it MovieVoting.sol.
   Paste the Contract Code:

Open your local MovieVoting.sol file and copy its contents. Paste the code into the newly created MovieVoting.sol file in Remix.

4. Compile the Contract
   Click on the "Solidity Compiler" tab (🔧 icon) on the left sidebar.
   Select the appropriate Solidity version (e.g., 0.8.18) that matches your contract.
   Click "Compile MovieVoting.sol".

5. Deploy the Contract
   Navigate to the "Deploy & Run Transactions" tab (🛰️ icon) on the left sidebar.

Environment Setup:
Set the "Environment" to "Injected Web3". This connects Remix to your MetaMask wallet.
Ensure MetaMask is connected to the Sepolia network.

Select the Contract:
In the "Contract" dropdown, select MovieVoting.

Deploy:
Click the "Deploy" button.
MetaMask will prompt you to confirm the transaction. Review the details and confirm.
Wait for the transaction to be mined. Once completed, the deployed contract will appear under "Deployed Contracts".

6. Verify the Contract on Etherscan (Optional)
   Verifying your contract makes the source code publicly available on Etherscan.
   Get Etherscan API Key:
   Sign up for an Etherscan API key if you don't have one.

Verify via Remix:
After deployment, click on the deployed contract in Remix.
Click the "Verify and Publish" button.
Enter the required details:
Compiler Type: Solidity (Single file)
Compiler Version: Match the version you used to compile (0.8.18)
Optimization: Enable or disable based on your compilation settings.
Etherscan API Key: Enter your API key.
Click "Verify".

Confirmation:
Once verified, your contract's source code will be available on Sepolia Etherscan.

# Using the Contract

After deployment, you can interact with the contract directly from Remix or through any Ethereum wallet/application that can communicate with smart contracts.

# Creating a Voting Session

Select the deployed MovieVoting contract in Remix.
Call the createVotingSession function with the desired movie names and duration.

# Casting a Vote

Call the vote function with the session ID and the chosen movie name.

# Ending a Voting Session

Call the endVoting function with the session ID to conclude voting and declare the winner.

# License

This project is licensed under the MIT License.
