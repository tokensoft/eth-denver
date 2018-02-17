
import Layout from '../src/layouts'
import Head from '../src/components/head'
import { Component } from 'react'
import Web3 from 'web3'

const tokenRegulatorServiceDef = require('../build/contracts/TokenRegulatorService.json')
const ServiceRegistryDef = require('../build/contracts/ServiceRegistry.json')
const RegulatedTokenDef = require('../build/contracts/RegulatedToken.json')
const TokenRegistryDef = require('../build/contracts/TokenRegistry.json')

async function createServiceRegulatedToken (web3, instance, regulatorAddress, registryAddress) {
  let RegulatedTokenContract = web3.eth.contract(RegulatedTokenDef.abi)

  RegulatedTokenContract.new(registryAddress, 'RegToken', 'REG', { from: web3.eth.accounts[0], data: RegulatedTokenDef.bytecode, gas: 4000000 },
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
          await tokenRegistry.register(tokenInstance.address, regulatorAddress, { from: web3.eth.accounts[0] })
          console.log('All contracts deployed and registered.')
        }

        // Note that the returned "myContractReturned" === "myContract",
        // so the returned "myContractReturned" object will also get the address set.
      } else {
        console.error(err)
      }
    })
}

async function createServiceRegistry (web3, instance, regulatorAddress) {
  let ServiceRegistryContract = web3.eth.contract(ServiceRegistryDef.abi)

  ServiceRegistryContract.new(regulatorAddress, { from: web3.eth.accounts[0], data: ServiceRegistryDef.bytecode, gas: 4000000 },
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
          createServiceRegulatedToken(web3, instance, regulatorAddress, registryInstance.address)
        }

        // Note that the returned "myContractReturned" === "myContract",
        // so the returned "myContractReturned" object will also get the address set.
      } else {
        console.error(err)
      }
    })
}

async function createTokenRegulator (web3, instance) {
  let TokenRegulatorContract = web3.eth.contract(tokenRegulatorServiceDef.abi)

  TokenRegulatorContract.new({ from: web3.eth.accounts[0], data: tokenRegulatorServiceDef.bytecode, gas: 4000000 },
    async function (err, regulatorInstance) {
      if (!err) {
        // NOTE: The callback will fire twice!
        // Once the contract has the transactionHash property set and once its deployed on an address.

        // e.g. check tx hash on the first call (transaction send)
        if (!regulatorInstance.address) {
          console.log('Trx Hash:', regulatorInstance.transactionHash) // The hash of the transaction, which deploys the contract
          // check address on the second call (contract deployed)
        } else {
          console.log('Token Regulator Address:', regulatorInstance.address) // the contract address

          let regulator = await web3.eth.contract(tokenRegulatorServiceDef.abi).at(regulatorInstance.address)
          await regulator.setName('Regulator 1', { from: web3.eth.accounts[0] })
          await regulator.setDescription('Regulator 1 provides whitelising based on US location.', { from: web3.eth.accounts[0] })

          createServiceRegistry(web3, instance, regulatorInstance.address)
        }

        // Note that the returned "myContractReturned" === "myContract",
        // so the returned "myContractReturned" object will also get the address set.
      } else {
        console.error(err)
      }
    })
}

export default class CreateContracts extends Component {
  async createContracts () {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    await createTokenRegulator(web3, this)
  }

  render () {
    return (
      <Layout>
        <Head />
        <div className='absolute top-0 left-0 w-100 vh-100 flex flex-column justify-center align-center'>
          <div className='center flex flex-column flex-row-ns align-center justify-center-ns'>
            <div className='near-black tr-ns'>
              <button onClick={this.createContracts}>Create</button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
