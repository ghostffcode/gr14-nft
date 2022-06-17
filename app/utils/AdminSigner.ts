import { ethers } from 'ethers'

const AdminSigner = () => {
  const signer = ethers.Wallet.fromMnemonic(process.env.SIGNER)

  return signer
}

export default AdminSigner
