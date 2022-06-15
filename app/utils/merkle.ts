import { ethers } from "ethers";
import keccak256 from "keccak256";
import {MerkleTree} from "merkletreejs";

import addresses from '../data/addresses.json'

const merkle = () => {
  const formattedAddresses = Array.from(new Set(addresses.map((add) => {
    return keccak256(ethers.utils.getAddress(add.trim())).toString('hex');
  })));
  const count = formattedAddresses.length;
  const merkleTree = new MerkleTree(formattedAddresses, keccak256, { sortPairs: true })
  
  return {
    merkleTree,
    count
  };
}

export default merkle;