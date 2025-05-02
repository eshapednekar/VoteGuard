import { ethers } from "ethers";
import abi from "./contractABI.json";

const contractAddress = "0xfD1Dda485D613Ecf0109EFfc0Ef0E236f05EeC0e";

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer)
    
  };