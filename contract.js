import { ethers } from "ethers";
import abi from "./contractABI.json";

const contractAddress = "0x69daD92D4A6EBdbc9d9589a3c396De820ba24D48";

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer)
    
  };