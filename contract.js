import { ethers } from "ethers";
import abi from "./contractABI.json";

const contractAddress = "0x48fBCa50f1E434F019F178FEdd7cDB771FCFf993";

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
  
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, abi, signer)
    
  };