// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { HardhatContractType } from '../../../providers/ContractsProvider/types'
import AdminSigner from '../../../utils/AdminSigner'
import addresses from '../../../data/addresses.json'

const contracts: HardhatContractType = require('../../../contracts/hardhat_contracts.json')

// setup typed data
const domain = {
  name: 'GR14 NFT',
  version: '1.0.0',
  chainId: process.env.CHAINID,
  verifyingContract: contracts[process.env.CHAINID][process.env.CHAINNAME].contracts.GR14.address,
}

// The named list of all type definitions
const types = {
  Donor: [{ name: 'donor', type: 'address' }],
}

type Data = {
  signature?: string
  message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const address = req.query.address as string

  // validation
  if (!ethers.utils.isAddress(address)) {
    return res.status(400).json({ message: 'Invalid address' })
  }

  const formattedDonor = ethers.utils.getAddress(address)

  // check if address is part of the list
  const found = addresses.find((add) => ethers.utils.getAddress(add) === formattedDonor)

  if (!found || ethers.utils.getAddress(found) !== formattedDonor) {
    return res.status(400).json({ message: 'Not a donor' })
  }

  // load a wallet
  const signer = AdminSigner()

  // sign the address
  const signature = await signer._signTypedData(domain, types, { donor: formattedDonor })

  res.status(200).json({ signature, message: 'Yayyy 👻' })
}
