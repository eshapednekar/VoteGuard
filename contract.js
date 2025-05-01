import { ethers } from "ethers";
import abi from "./contractABI.json";

const contractAddress = "0x48fBCa50f1E434F019F178FEdd7cDB771FCFf993";

export const getContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected");
  
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
  
    return contract;
  };