import type { NextApiRequest, NextApiResponse } from 'next'
import AdminSigner from '../../utils/AdminSigner'

type Data = {
  address: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // load a wallet
  const signer = AdminSigner()

  res.status(200).json({ address: signer.address })
}
