import { ethers } from "ethers";
import { Seaport } from "@opensea/seaport-js";

const provider = new ethers.providers.Web3Provider(window.ethereum);
// console.log(provider);
const seaport = new Seaport(provider);
// console.log(seaport);

export { 
    provider,
    seaport
}