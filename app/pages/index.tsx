import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useContractReader } from 'eth-hooks/useContractReader'
import { useAccount, useSigner } from 'wagmi'
import type { NextPage } from 'next'
import { useContracts } from '../providers/ContractsProvider/ContractProvider'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { utils } from 'ethers'
import Transactor from '../utils/Transactor'

const Home: NextPage = () => {
  const [proof, setProof] = useState<[]>([])
  const [loading, setLoading] = useState<Boolean>(true)
  const { data: user } = useAccount()
  const contracts = useContracts()
  const { data: signer } = useSigner()

  const tx = Transactor(signer)

  const intialized = useContractReader(contracts.readContracts, 'GR14', 'initialized')
  const hasClaimed = useContractReader(contracts.readContracts, 'GR14', 'hasClaimed', [user?.address])

  const validateClaimStatus = useCallback(async () => {
    if (utils.isAddress(user?.address as string)) {
      const { data } = await axios.get(`/api/getProof/${user?.address}`)
      setProof(data.proof)
    } else {
      setProof([])
    }

    setLoading(false)
  }, [user?.address])

  const handleClaim = async () => {
    const res = await tx(contracts.writeContracts.GR14.claim(proof))

    console.log(res)
  }

  useEffect(() => {
    validateClaimStatus()
  }, [user?.address, validateClaimStatus])

  const renderInitializedView = () => {
    if (proof.length > 0) {
      return (
        <div>
          {/* <div>You are eligible for this drop:</div> */}
          <button
            className="bg-gray-600 hover:bg-gray-400 focus:bg-gray-400 py-2 px-6 rounded text-white focus:shadow mt-6"
            onClick={handleClaim}
          >
            Claim Now
          </button>
        </div>
      )
    } else {
      return <div>Sadly you are not eligible for this drop.</div>
    }
  }

  return (
    <section className="w-full flex flex-1 flex-col text-center items-center">
      <h1 className="text-center font-bold text-3xl">Welcome to GR14 Donors NFT Claim</h1>

      {loading ? (
        <div className="mt-20">Loading...</div>
      ) : (
        <div className="mt-20 w-full max-w-xl">
          <div className="flex flex-1 flex-col md:flex-row justify-between mb-3">
            <div>
              <span className="font-bold">Claims Open:</span>
              <span className="ml-3">{intialized ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="font-bold">Eligible:</span>
              <span className="ml-3">{proof.length > 0 ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="font-bold">Claimed:</span>
              <span className="ml-3">{hasClaimed ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="mt-8">
            {intialized
              ? renderInitializedView()
              : 'Claims are not open yet, check again later. If you are the owner {owner}, you can initialized the project'}
          </div>
        </div>
      )}
    </section>
  )
}

export default Home
