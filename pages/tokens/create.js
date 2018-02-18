import Layout from '../../src/layouts'
import RegulatedTokenForm from '../../src/components/forms/regulated-token'
import { Component } from 'react'
import Web3 from 'web3'
import Router from 'next/router'
const ServiceRegistryDef = require('../../build/contracts/ServiceRegistry.json')
const RegulatedTokenDef = require('../../build/contracts/RegulatedToken.json')
const TokenRegistryDef = require('../../build/contracts/TokenRegistry.json')
const tokenRegulatorServiceDef = require('../../build/contracts/TokenRegulatorService.json')

export default class Regulations extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokens: [],
      regulators: []
    }
  }

  async createServiceRegulatedToken (web3, instance, values, registryAddress) {
    let RegulatedTokenContract = web3.eth.contract(RegulatedTokenDef.abi)

    RegulatedTokenContract.new(registryAddress, values.name, values.symbol, { from: web3.eth.accounts[0], data: RegulatedTokenDef.bytecode, gas: 4000000 },
      async function (err, tokenInstance) {
        if (!err) {
          // NOTE: The callback will fire twice!
          // Once the contract has the transactionHash property set and once its deployed on an address.

          // e.g. check tx hash on the first call (transaction send)
          if (!tokenInstance.address) {
            console.log('Trx Hash:', tokenInstance.transactionHash) // The hash of the transaction, which deploys the contract
            // check address on the second call (contract deployed)
          } else {
            console.log('Token Address:', tokenInstance.address) // the contract address
            let tokenRegistry = await web3.eth.contract(TokenRegistryDef.abi).at('0x87bec500d7955d454401ef33caa585c59c8639ce')
            await tokenRegistry.register(tokenInstance.address, 0, { from: web3.eth.accounts[0] })
            console.log('All contracts deployed and registered.')

            Router.push('/tokens')
          }

          // Note that the returned "myContractReturned" === "myContract",
          // so the returned "myContractReturned" object will also get the address set.
        } else {
          console.error(err)
        }
      })
  }

  async createServiceRegistry (web3, instance, values) {
    let ServiceRegistryContract = web3.eth.contract(ServiceRegistryDef.abi)

    ServiceRegistryContract.new(values.regulatorService, { from: web3.eth.accounts[0], data: ServiceRegistryDef.bytecode, gas: 4000000 },
      function (err, registryInstance) {
        if (!err) {
          // NOTE: The callback will fire twice!
          // Once the contract has the transactionHash property set and once its deployed on an address.

          // e.g. check tx hash on the first call (transaction send)
          if (!registryInstance.address) {
            console.log('Trx Hash:', registryInstance.transactionHash) // The hash of the transaction, which deploys the contract
            // check address on the second call (contract deployed)
          } else {
            console.log('Service Registry Address:', registryInstance.address) // the contract address
            instance.createServiceRegulatedToken(web3, instance, values, registryInstance.address)
          }

          // Note that the returned "myContractReturned" === "myContract",
          // so the returned "myContractReturned" object will also get the address set.
        } else {
          console.error(err)
        }
      })
  }

  async createToken (values) {
    console.log('values', values)
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    await this.createServiceRegistry(web3, this, values)
  }

  getRegulatorInfo (regulatorAddress) {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    let regulator = web3.eth.contract(tokenRegulatorServiceDef.abi).at(regulatorAddress)
    let ret = {
      address: regulatorAddress,
      locked: regulator.getLocked(regulatorAddress),
      partialTransfers: regulator.getPartialTransfers(regulatorAddress),
      enforceAmlKyc: regulator.getEnforceAmlKyc(regulatorAddress),
      enforceGeography: regulator.getEnforceGeography(regulatorAddress),
      name: regulator.name(),
      description: regulator.description(),
      admin: regulator.admin()
    }
    return ret
  }

  async getTokenRegistrations () {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    let tokenRegistry = await web3.eth.contract(TokenRegistryDef.abi).at('0x87bec500d7955d454401ef33caa585c59c8639ce')

    let count = tokenRegistry.regulatorCount().toNumber()
    let regulators = []
    for (let i = 0; i < count; i++) {
      regulators.push(this.getRegulatorInfo(tokenRegistry.getRegulator(i)))
    }

    this.setState({
      regulators
    })
  }

  async componentDidMount () {
    await this.getTokenRegistrations()
  }

  render () {
    const { regulators } = this.state
    return (
      <Layout>
        <div className='center measure'>
          <RegulatedTokenForm
            createToken={this.createToken.bind(this)}
            regulators={regulators}
        />
        </div>
      </Layout>
    )
  }
}
