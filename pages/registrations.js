
/* global web3 */
import Layout from '../src/layouts'
import Head from '../src/components/head'
import { Component } from 'react'
import Web3 from 'web3'
const TokenRegistryDef = require('../build/contracts/TokenRegistry.json')
const RegulatedTokenDef = require('../build/contracts/RegulatedToken.json')
const tokenRegulatorServiceDef = require('../build/contracts/TokenRegulatorService.json')

function getTokenInfo (tokenAddress) {
  let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  let token = web3.eth.contract(RegulatedTokenDef.abi).at(tokenAddress)
  let ret = {
    address: tokenAddress,
    name: token.name(),
    symbol: token.symbol(),
    decimals: token.decimals()
  }
  return ret
}

function getRegulatorInfo (regulatorAddress) {
  let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
  let regulator = web3.eth.contract(tokenRegulatorServiceDef.abi).at(regulatorAddress)
  let ret = {
    address: regulatorAddress,
    locked: regulator.getLocked(regulatorAddress),
    partialTransfers: regulator.getPartialTransfers(regulatorAddress),
    enforceAmlKyc: regulator.getEnforceAmlKyc(regulatorAddress),
    enforceGeography: regulator.getEnforceGeography(regulatorAddress),
    name: regulator.name(),
    description: regulator.description()
  }
  return ret
}

export default class Registrations extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokens: [],
      regulators: []
    }
  }

  async getTokenRegistrations () {
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

    this.setState({
      tokens,
      regulators
    })
  }

  render () {
    const {
      tokens,
      regulators
    } = this.state

    return (
      <Layout>
        <Head />
        <div className='absolute top-0 left-0 w-100 vh-100 flex flex-column justify-center align-center'>
          <div className='center flex flex-column flex-row-ns align-center justify-center-ns'>
            <div className='near-black tr-ns'>
              <button onClick={this.getTokenRegistrations.bind(this)}> Get </button>
            </div>
          </div>
          {tokens.map((token, i) =>
            <div key={'t' + i}>
              {JSON.stringify(getTokenInfo(token))}
            </div>
            )}
          {regulators.map((regulator, i) =>
            <div key={'r' + i}>
              {JSON.stringify(getRegulatorInfo(regulator))}
            </div>
            )}
        </div>
      </Layout>
    )
  }
}
