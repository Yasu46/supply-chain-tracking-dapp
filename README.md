## Introduction
This is a Decentralized application of the supply chain implemented by Solidity, Hardhat, and Next.js.
It uses blockchain technology for traceability, where the sender can record the condition of the product on the blockchain, and the delivery status can be monitored through the app.

## Getting Started

First, set up the environment

```bash
git clone git@github.com:Yasu46/supply-chain-tracking-dapp.git
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

In another terminal, run this command to start a local Ethereum network
```bash
npx hardhat node
```
This will create a local Ethereum network for development purposes and generate accounts for development and testing.
Once you run this, you can get 20 accounts.

Open one another terminal, then run this command to deploy your smart contract on the local Ethereum network.
```bash
npx hardhat run --network localhost scripts/deploy.ts
```
You can see the address of the contract in your terminal, Copy and paste it to ContractAddress in TrackingContext.ts

## How to use this dapp

1. Connect account to MetaMask
2. Add tracking information to store shipment data in a blockchain
3. Get tracking data by Get Shipment
4. Start tracking to change tracking status by contract
5. After complete delivery, do comp shipment to change tracking status by contract
