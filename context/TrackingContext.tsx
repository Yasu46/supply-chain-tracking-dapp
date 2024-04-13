'use client';
import React, { useState, useEffect, ReactNode } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers"; 

// INTERNAL IMPORT
import tracking from "@/context/Tracking.json";
const ContractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ContractABI = tracking.abi;

interface ShipmentItems {
  receiver: string;
  pickupTime: string;
  distance: string;
  price: string;
}

interface Shipment {
  sender: string;
  receiver: string;
  price: ethers.BigNumber;
  pickupTime: ethers.BigNumber;
  deliveryTime: ethers.BigNumber;
  distance: ethers.BigNumber;
  isPaid: boolean;
  status: number;
}

interface CompleteShipmentParams {
  receiver: string;
  index: number;
}

interface GetProductParams {
  receiver: string;
  index: number;
}

// ---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider: ethers.Signer | ethers.providers.Provider) =>
  new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);

export const TrackingContext = React.createContext({});

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  //STATE VARIABLE
  const DappName = "Product Tracking Dapp";
  const [currentUser, setCurrentUser] = useState("");

  const createShipment = async (items: ShipmentItems) => {
    const { receiver, pickupTime, distance, price } = items;
    
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
            
      const createItem = await contract.createShipment(
        receiver,
        new Date(pickupTime).getTime(),
        distance,
        ethers.utils.parseUnits(price, 18),
        {
          value: ethers.utils.parseUnits(price, 18),
        }
      );
      await createItem.wait();
    } catch (error) {
      console.error("Some want wrong", error);
    }
  }

  const getAllShipments = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);

      const shipments = await contract.getAllTransactions();
      const allShipments = shipments.map((shipment: Shipment) => ({
        sender: shipment.sender,
        receiver: shipment.receiver,
        price: ethers.utils.formatEther(shipment.price.toString()),
        pickupTime: shipment.pickupTime.toNumber(),
        deliveryTime: shipment.deliveryTime.toNumber(),
        distance: shipment.distance.toNumber(),
        isPaid: shipment.isPaid,
        status: shipment.status,
      }));

      return allShipments;
    } catch (error) {
      console.error("error want, getting shipment", error);
    }
  }

  const getShipmentCount = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipmentsCount = await contract.getShipmentCount(accounts[0]);
      
      return shipmentsCount.toNumber();
    } catch (error) {
      console.error("error want, getting shipment", error);
    }
  }

  const completeShipment = async (completeShip: CompleteShipmentParams) => {
    const { receiver, index } = completeShip;
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const transaction = await contract.completeShipment(
        accounts[0],
        receiver,
        index,
        {
          gasLimit: 300000,
        }
      );

      transaction.wait();
    } catch (error) {
      console.error("wrong completeShipment", error);
    }
  }

  const getShipment = async (index: number) => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const provider = new ethers.providers.JsonRpcProvider();
      const contract = fetchContract(provider);
      const shipment = await contract.getShipment(accounts[0], index * 1);      
      
      const SingleShipment = {
        sender: shipment[0],
        receiver: shipment[1],
        pickupTime: shipment[2].toNumber(),
        deliveryTime: shipment[3].toNumber(),
        distance: shipment[4].toNumber(),
        price: ethers.utils.formatEther(shipment[5].toString()),
        status: shipment[6],
        isPaid: shipment[7],
      };
      return SingleShipment;
    } catch (error) {
      console.error("Sorry no shipment", error);
    }
  }

  const startShipment = async (getProduct: GetProductParams) => {
    const { receiver, index } = getProduct;

    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      const shipment = await contract.startShipment(
        accounts[0],
        receiver,
        index * 1
      );

      shipment.wait();
    } catch (error) {
      console.error("Sorry no shipment", error);
    };
  };
  //---CHECK WALLET CONNECTED
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";
      
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      
      if (accounts.length) {
        setCurrentUser(accounts[0]);
      } else {
        return "No account";
      }
    } catch (error) {
      return "Not connected";
    };
  }

  //---CONNECT WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return "Install MetaMask";

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentUser(accounts[0]);      
    } catch (error) {
      return `Failed to connect wallet: ${error}`;
    };
  }

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  return (
    <TrackingContext.Provider
      value={{ 
        connectWallet,
        createShipment,
        getAllShipments,
        completeShipment,
        getShipment,
        startShipment,
        getShipmentCount,
        DappName,
        currentUser,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};