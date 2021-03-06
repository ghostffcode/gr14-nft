import { FC, useState } from 'react'
import { useAccount, useSigner } from 'wagmi'
import { useContractReader } from 'eth-hooks/useContractReader'
import { useContracts } from '../providers/ContractsProvider/ContractProvider'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import axios from 'axios'
import Transactor from '../utils/Transactor'

const Init: FC = () => {
  const [uri, setURI] = useState<string>('')

  // const { data: user } = useAccount();
  const contracts = useContracts()
  const { data: signer } = useSigner()

  const { data: admin } = useAccount()
  const tx = Transactor(signer)
  const owner = useContractReader(contracts.readContracts, 'GR14', 'owner')
  const intialized = useContractReader(contracts.readContracts, 'GR14', 'initialized')

  const isOwner = admin?.address === owner

  const handleInitialize = async (e: any) => {
    e.preventDefault()

    // calculate proof from server
    const { data } = await axios.get(`/api/getRoot`)
    const { merkleRoot } = data

    const res = await tx(contracts.writeContracts.GR14.initialize(merkleRoot, uri))

    console.log(res)
  }

  if (!isOwner) {
    return (
      <div className="flex flex-1 flex-col w-full mt-64 items-center justify-center">
        <div id="notOwner" className="text-center">
          <div>This is an Admin only view.</div>
          <div>If you are the admin, connect your wallet to get started.</div>
          <div>
            Else, go back to{' '}
            <Link href="/">
              <a className="inline-flex text-blue-700">home</a>
            </Link>
            .
          </div>
        </div>
      </div>
    )
  }

  if (intialized) {
    return (
      <div className="flex flex-1 flex-col w-full mt-64 items-center justify-center">
        <div id="initialized" className="text-center">
          <div>Claims are already active, nothing more to do here.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col w-full items-center justify-center">
      <div className="max-w-xl w-full mx-auto">
        <form className="w-full" onSubmit={handleInitialize}>
          <div className="mb-4">
            <label>
              <div className="mb-2">Base URL for all NFT assets: *</div>
              <input
                type="url"
                placeholder="https://..."
                className="w-full h-10 p-2 border-2 border-gray-400 focus:border-gray-600 outline-none placeholder:italic rounded focus:shadow bg-white"
                value={uri}
                onChange={(e) => setURI(e.target.value)}
              />
            </label>
          </div>

          <div className="text-center mt-3">
            <button
              type="submit"
              className="bg-gray-600 hover:bg-gray-400 focus:bg-gray-400 py-2 px-6 rounded text-white focus:shadow"
              onClick={handleInitialize}
            >
              Initialize
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Init
