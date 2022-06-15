// deploy/00_deploy_your_contract.js

const { ethers } = require('hardhat')

const localChainId = '31337'

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()

  const blissAddress = '0xbF7877303B90297E7489AA1C067106331DfF7288'
  const owockiAddress = '0x00De4B13153673BCAE2616b67bf822500d325Fc3'

  await deploy('GR14', {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: chainId === localChainId ? 1 : 5,
  })

  // Getting a previously deployed contract
  const GR14 = await ethers.getContract('GR14', deployer)
  await GR14.transferOwnership(blissAddress)

  /*
    //const GR14 = await ethers.getContractAt('GR14', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const GR14 = await deploy("GR14", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const GR14 = await deploy("GR14", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  try {
    if (chainId !== localChainId) {
      await run('verify:verify', {
        address: GR14.address,
        contract: 'contracts/GR14.sol:GR14',
        constructorArguments: [],
      })
    }
  } catch (error) {
    console.error(error)
  }
}
module.exports.tags = ['GR14']
