// import Link from 'next/link'
import Layout from '../../src/layouts'
import RegulatorServiceForm from '../../src/components/forms/regulator-service.js'
import { Component } from 'react'
import Web3 from 'web3'
import Router from 'next/router'

const tokenRegulatorServiceDef = require('../../build/contracts/TokenRegulatorService.json')
const TokenRegistryDef = require('../../build/contracts/TokenRegistry.json')

export default class Regulations extends Component {
  async createTokenRegulator (web3, values) {
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
            await regulator.setName(values.name, { from: web3.eth.accounts[0] })
            await regulator.setDescription(values.description, { from: web3.eth.accounts[0] })

            let tokenRegistry = await web3.eth.contract(TokenRegistryDef.abi).at('0x87bec500d7955d454401ef33caa585c59c8639ce')
            await tokenRegistry.register(0, regulator.address, { from: web3.eth.accounts[0] })

            Router.push('/regulations')
          }

          // Note that the returned "myContractReturned" === "myContract",
          // so the returned "myContractReturned" object will also get the address set.
        } else {
          console.error(err)
        }
      })
  }

  async createRegistration (values) {
    console.log('values', values)
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    await this.createTokenRegulator(web3, values)
  }

  render () {
    return (
      <Layout>
        <div className='center measure'>
          <RegulatorServiceForm
            createRegistration={this.createRegistration.bind(this)}
          />
        </div>
      </Layout>
    )
  }
}
