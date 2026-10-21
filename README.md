# 🎰 Lottery DApp

A decentralized lottery application built using Ethereum smart contracts, Solidity, MetaMask, and React.js.

## 📌 Project Overview

Lottery DApp demonstrates how blockchain technology can support transparent, verifiable lottery logic. Users can connect their Ethereum wallet and interact with a smart contract deployed to a development network.

This project is intended for educational and test-network use.

## ✨ Features

- 🔗 Connect an Ethereum wallet using MetaMask
- 👛 Interact with a smart contract
- 🎟️ Enter a lottery on a supported test network
- 🔍 View lottery status and participants
- 🎲 Demonstrate contract-based winner selection
- 📜 Read transaction and contract information
- ⚠️ Display wallet and transaction errors

## 🛠️ Technologies Used

- Solidity
- Ethereum
- React.js
- JavaScript
- MetaMask
- Hardhat
- Ethers.js

## 📂 Project Structure

```text
Lottery-DApp/
├── contracts/
│   └── Lottery.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── Lottery.test.js
├── client/
│   ├── src/
│   └── package.json
├── hardhat.config.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Prerequisites

Install Node.js and npm. Set up MetaMask and configure an Ethereum development or test network.

### 2. Clone the Repository

```bash
git clone https://github.com/amoltathesoftwareengineer/Lottery-DApp.git
cd Lottery-DApp
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Compile Smart Contracts

```bash
npx hardhat compile
```

### 5. Run Tests

```bash
npx hardhat test
```

### 6. Deploy Locally

```bash
npx hardhat node
```

In a second terminal, run the deployment script:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Follow the project configuration to start the React frontend and connect it to the deployed contract.

## 🔐 Security Considerations

- Use test networks only during development.
- Never commit wallet seed phrases, private keys, or API secrets.
- Test access control, transaction handling, and winner selection thoroughly.
- Do not treat a simple pseudo-random selection method as secure for real-money lotteries.

## 🎯 Learning Objectives

- Understanding Ethereum smart contracts
- Writing and testing Solidity code
- Connecting a frontend to a blockchain
- Using MetaMask and Ethers.js
- Deploying contracts to a local development network

## 🔮 Future Enhancements

- Improved on-chain randomness using an appropriate verifiable randomness service
- Lottery round history
- Better transaction status feedback
- Automated smart contract testing
- Enhanced responsive interface

## 👨‍💻 Author

**Amol Tathe**

- GitHub: [@amoltathesoftwareengineer](https://github.com/amoltathesoftwareengineer)
- LinkedIn: [Amol Tathe](https://www.linkedin.com/in/amoltathesoftwareengineer/)

## 📄 License

No license has been specified yet.

