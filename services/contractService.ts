// services/contractService.ts
import { ethers } from "ethers";
import contractABI from "../resources/abi.json";

const contractAddress = "0xb43ba661483f4c19e0a45243c621ac4e0b618f3e";

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