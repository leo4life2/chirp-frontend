// services/contractService.ts
import { ethers } from "ethers";
import contractABI from "../resources/abi.json";

const contractAddress = "0x0ac1D6B0c62F35D4eaB7a29C3752aE3b303b1fcd";

export const postPeep = async (cid: string, signer: ethers.Signer) => {
    const chirpContract = new ethers.Contract(contractAddress, contractABI, signer);
    await chirpContract.postPeep?.(cid);
};

export const likePeep = async (peepIndex: Number, signer: ethers.Signer) => {
    const chirpContract = new ethers.Contract(contractAddress, contractABI, signer);
    await chirpContract.likePeep?.(peepIndex);
};

export const commentPeep = async (peepIndex: Number, cid: string, signer: ethers.Signer) => {
    const chirpContract = new ethers.Contract(contractAddress, contractABI, signer);
    await chirpContract.commentOnPeep?.(peepIndex, cid);
};