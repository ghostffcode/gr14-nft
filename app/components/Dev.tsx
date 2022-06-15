import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC } from 'react'
import { useBalance, useAccount, useProvider } from 'wagmi'
import { utils, ethers } from 'ethers'
import Transactor from '../utils/Transactor'

// const zero = ethers.BigNumber.from('0')

const Header: FC = () => {
  const { data: user } = useAccount()
  const provider = useProvider()
  // const { data: balance } = useBalance({ addressOrName: user?.address })
  const tx = Transactor(provider)

  const faucetTopUp = async () => {
    tx({
      to: user?.address,
      value: utils.parseEther('0.1'),
    })
  }

  return (
    <div className="fixed bottom-2 right-2">
      <button onClick={faucetTopUp}>Get 0.1 ETH</button>
    </div>
  )
}

export default Header
