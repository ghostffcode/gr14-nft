// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import addresses from '../../data/addresses.json'

type Data = {
  addresses: string[],
  count: number
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  res.status(200).json({ addresses, count: addresses.length })
}
