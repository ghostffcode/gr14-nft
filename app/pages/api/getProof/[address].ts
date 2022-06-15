// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers';
import merkle from '../../../utils/merkle';
import keccak256 from 'keccak256';

type Data = {
  proof?: string[],
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const address = req.query.address as string;

  // validation
  if (!ethers.utils.isAddress(address)) {
    return res.status(400).json({ message: 'Invalid address' })
  }

  // generate proof for the address
  const { merkleTree } = merkle();

  const proof = merkleTree.getHexProof(keccak256(ethers.utils.getAddress(address)));

  res.status(200).json({ proof, message: 'Yayyy 👻' })
}
