/* global artifacts */
let RegulatedToken = artifacts.require('./RegulatedToken.sol')
let ServiceRegistry = artifacts.require('./ServiceRegistry.sol')
let TokenRegulatorService = artifacts.require('./TokenRegulatorService.sol')
let TokenRegistry = artifacts.require('./TokenRegistry')

module.exports = async function (deployer) {
  deployer.deploy(TokenRegulatorService).then(async () => {
    let regulator = await TokenRegulatorService.deployed()
    await regulator.setName('Accredited Investor Regulator')
    await regulator.setDescription('Allows only Accredited Investors to receive this token.')
    console.log('Regulator', regulator.address)

    let serviceRegistry = await ServiceRegistry.new(regulator.address)
    console.log('ServiceRegistry', serviceRegistry.address)

    let token = await RegulatedToken.new(serviceRegistry.address, 'RegToken', 'REG')
    console.log('RegulatedToken', token.address)

    let tokenRegistry = await TokenRegistry.new()
    console.log('TokenRegistry', tokenRegistry.address)

    await tokenRegistry.register(token.address, regulator.address)
  })
}
