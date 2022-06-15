// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import merkle from '../../utils/merkle';

type Data = {
  merkleRoot: string,
  count: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { merkleTree, count } = merkle();
  
  const merkleRoot = '0x' + merkleTree.getRoot().toString('hex');

  res.status(200).json({ merkleRoot, count })
}
