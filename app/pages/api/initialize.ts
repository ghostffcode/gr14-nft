// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import axios from 'axios'
import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
// import addresses from '../../data/addresses.json'
import { HardhatContractType } from '../../providers/ContractsProvider/types'

const contracts: HardhatContractType = require('../../contracts/hardhat_contracts.json')

type Data = {
  signerAddress: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // setup typed data
  // const domain = {
  //   name: 'GR14 NFT',
  //   version: '1.0.0',
  //   chainId: 1,
  //   verifyingContract: contracts[process.env.CHAINID][process.env.CHAINNAME].contracts.GR14.address,
  // }

  // // The named list of all type definitions
  // const types = {
  //   Donor: [{ name: 'donor', type: 'address' }],
  // }

  // load all addresses
  // const { data } = await axios.get('https://gitcoin.co/grants/v1/api/export_addresses/round13.json')
  // const { addresses } = data

  // load a wallet
  const signer = ethers.Wallet.createRandom()
  const signerAddress = signer.address

  // const signedResults: Record<string, string> = {}

  // // sign all addresses and store in JSON file
  // await Promise.all(
  //   addresses.map(async (donorArr: string[]) => {
  //     const donor = donorArr[0]

  //     if (ethers.utils.isAddress(donor)) {
  //       const formattedDonor = ethers.utils.getAddress(donor)
  //       const signature = await signer._signTypedData(domain, types, { donor: formattedDonor })

  //       signedResults[formattedDonor] = signature
  //     }
  //   })
  // )

  // write signed result back to file

  res.status(200).json({ signerAddress })
}
