/* eslint-disable @next/next/no-img-element */
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useContractReader } from 'eth-hooks/useContractReader'
import { useAccount, useBlockNumber, useSigner } from 'wagmi'
import type { NextPage } from 'next'
import { useContracts } from '../providers/ContractsProvider/ContractProvider'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Contract, utils } from 'ethers'
// import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import Transactor from '../utils/Transactor'

// const web3 = createAlchemyWeb3('https://eth-rinkeby.alchemyapi.io/nft/v2/demo')

const Home: NextPage = () => {
  const [signature, setSignature] = useState<string>('')
  const [nft, setNft] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Boolean>(true)
  const { data: user } = useAccount()
  const contracts = useContracts()
  const { data: signer } = useSigner()
  const { data: blockNumber } = useBlockNumber()

  const tx = Transactor(signer)

  const owner: string = useContractReader(contracts.readContracts, 'GR14', 'owner') || ''
  const approvedSigner: string = useContractReader(contracts.readContracts, 'GR14', 'approvedSigner') || ''
  const hasClaimed = useContractReader(contracts.readContracts, 'GR14', 'hasClaimed', [user?.address])
  const initialized = approvedSigner.length > 0 && approvedSigner !== '0x0000000000000000000000000000000000000000'

  const fetchClaimSignature = useCallback(async () => {
    let res = ''

    try {
      if (utils.isAddress(user?.address as string)) {
        const { data } = await axios.get(`/api/sign/${user?.address}`)
        res = data.signature || ''
      } else {
        res = ''
      }
    } catch (error) {
      console.log(error)
    }

    console.log({ res })

    setSignature(res)
    setLoading(false)
  }, [user?.address])

  const handleClaim = async () => {
    const res = await tx(contracts.writeContracts.GR14.claim(signature))

    console.log(res)
  }

  useEffect(() => {
    fetchClaimSignature()
  }, [user?.address, fetchClaimSignature])

  const fetchNFT = async (contract: Contract, address: string) => {
    // console.log(contracts.readContracts.GR14?.address)

    // const nfts = await web3.alchemy.getNfts({
    //   owner: user?.address as string,
    //   contractAddresses: [contracts.readContracts.GR14?.address],
    // })

    // console.log({ nfts })

    const filter = contract.filters.Transfer(null, address)
    const nfts = await contract.queryFilter(filter)

    if (nfts.length > 0) {
      const tokenId = nfts[0].args?.tokenId as string

      if (tokenId) {
        const metaData = await contract.tokenURI(tokenId)
        const { data } = await axios.get(metaData.replace('ipfs://', 'https://ipfs.io/ipfs/'))

        const update = { [address]: data.image.replace('ipfs://', 'https://ipfs.io/ipfs/') }

        setNft({ ...nft, ...update })
      }
    }
  }

  useEffect(() => {
    if (contracts.readContracts.GR14 && user?.address) {
      fetchNFT(contracts.readContracts.GR14, user?.address)
    }
  }, [blockNumber, contracts.readContracts.GR14, user?.address])

  const renderInitializedView = () => {
    if (signature.length > 0) {
      if (user?.address && nft[user?.address] && nft[user?.address].length > 0) {
        return (
          <>
            <div className="mt-20">Youe claimed NFT</div>
            <div className="my-8 flex flex-1 flex-col items-center justify-center">
              <div>
                <img src={nft[user?.address]} alt="your NFT" className="w-full max-w-sm" />
              </div>
            </div>
          </>
        )
      } else {
        return (
          <div>
            {/* <div>You are eligible for this drop:</div> */}
            <button
              className="bg-gray-600 hover:bg-gray-400 focus:bg-gray-400 disabled:bg-gray-300 py-2 px-6 rounded text-white focus:shadow mt-6"
              onClick={handleClaim}
            >
              Claim Now
            </button>
          </div>
        )
      }
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
              <span className="ml-3">{initialized ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="font-bold">Eligible:</span>
              <span className="ml-3">{signature.length > 0 ? 'Yes' : 'No'}</span>
            </div>
            <div>
              <span className="font-bold">Claimed:</span>
              <span className="ml-3">{hasClaimed ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="mt-20">
            {initialized ? (
              renderInitializedView()
            ) : (
              <>
                Claims are not open yet, check again later. If you are the owner {owner}, you can initialized the
                project
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default Home
