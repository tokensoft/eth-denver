/* global web3 */
// import Link from 'next/link'
import Layout from '../src/layouts'
import RegisterInvestorForm from '../src/components/forms/register-investor.js'
import { Component } from 'react'
import Web3 from 'web3'
import Router from 'next/router'
const sigUtil = require('eth-sig-util')

const tokenRegulatorServiceDef = require('../build/contracts/TokenRegulatorService.json')
const ServiceRegistryDef = require('../build/contracts/ServiceRegistry.json')
const RegulatedTokenDef = require('../build/contracts/RegulatedToken.json')
const TokenRegistryDef = require('../build/contracts/TokenRegistry.json')

const PERM_NONE = 0x0
const PERM_SEND = 0x1
const PERM_RECEIVE = 0x2
const PERM_TRANSFER = PERM_SEND | PERM_RECEIVE
const PERM_RECEIVE_AML_KYC = 0x4
const PERM_RECEIVE_GEOGRAPHY = 0x8

async function getTokenRegistrations () {
  let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  console.log(web3.eth.coinbase)
  let tokenRegistry = await web3.eth.contract(TokenRegistryDef.abi).at('0x87bec500d7955d454401ef33caa585c59c8639ce')

  let count = tokenRegistry.tokenCount().toNumber()
  let tokens = []
  for (let i = 0; i < count; i++) {
    tokens.push(tokenRegistry.getToken(i))
  }

  count = tokenRegistry.regulatorCount().toNumber()
  let regulators = []
  for (let i = 0; i < count; i++) {
    regulators.push(tokenRegistry.getRegulator(i))
  }

  return {
    tokens,
    regulators
  }
}

async function registerAddress (userAddress, values) {
  let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  let registrations = await getTokenRegistrations()

  // Iterate over the tokens and add this user address
  for (let i = 0; i < registrations.tokens.length; i++) {
    let currentTokenAddress = registrations.tokens[i]

    // Iterate over the registrations
    for (let j = 0; j < registrations.regulators.length; j++) {
      let currentRegulatorAddress = registrations.regulators[j]
      let regulator = await web3.eth.contract(tokenRegulatorServiceDef.abi).at(currentRegulatorAddress)
      let permissions = PERM_TRANSFER | PERM_RECEIVE_AML_KYC
      if (values.country === 'US') {
        permissions = permissions | PERM_RECEIVE_GEOGRAPHY
      }
      await regulator.setPermission(currentTokenAddress, userAddress, permissions, { from: web3.eth.coinbase })
      console.log('--------------------------')
      console.log('userAddress', userAddress)
      console.log('currentTokenAddress', currentTokenAddress)
      console.log('currentRegulatorAddress', currentRegulatorAddress)
      console.log('permissions', permissions)
    }
  }

  Router.push('/register-investor-complete')
}

function signMsg (values) {
  let web3Client = new Web3(web3.currentProvider)
  console.log(web3Client.eth.coinbase)

  const msgParams = [
    {
      type: 'string',      // Any valid solidity type
      name: 'Message',     // Any string label you want
      value: 'Please sign this message: ' + Math.floor(Math.random() * Math.floor(1000000))  // The value to sign
    }]

  web3.currentProvider.sendAsync({
    method: 'eth_signTypedData',
    params: [msgParams, web3Client.eth.coinbase],
    from: web3Client.eth.coinbase
  }, function (err, result) {
    if (err) return console.error(err)
    if (result.error) {
      return console.error(result.error.message)
    }
    const recovered = sigUtil.recoverTypedSignature({
      data: msgParams,
      sig: result.result
    })
    if (recovered === web3Client.eth.coinbase) {
      console.log('Success')
      registerAddress(web3Client.eth.coinbase, values)
    } else {
      console.log('Failed')
    }
  })
}

export default class RegisterInvestor extends Component {
  registerInvestor (values) {
    signMsg(values)
  }

  render () {
    return (
      <Layout>
        <div className='center measure'>
          <RegisterInvestorForm
            registerInvestor={this.registerInvestor.bind(this)}
          />
        </div>
      </Layout>
    )
  }
}
