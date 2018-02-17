import Link from 'next/link'
import { Divider, Button, Card } from 'semantic-ui-react'
import Layout from '../src/layouts'
import { Component } from 'react'
import Web3 from 'web3'
const TokenRegistryDef = require('../build/contracts/TokenRegistry.json')
const tokenRegulatorServiceDef = require('../build/contracts/TokenRegulatorService.json')

export default class Regulations extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokens: [],
      regulators: []
    }
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

  async componentDidMount () {
    await this.getTokenRegistrations()
  }

  render () {
    const { regulators } = this.state
    // console.log('********', JSON.stringify(regulators))

    let regulatorDetails = []
    for (let i = 0; i < regulators.length; i++) {
      regulatorDetails.push(this.getRegulatorInfo(regulators[i]))
    }

    // console.log(regulatorDetails)

    return (
      <Layout>
        <div className='flex flex-row justify-between items-center'>
          <h2>Regulator Services</h2>
          <Link href='/regulations/create' className='link near-black'><a>Create New</a></Link>
        </div>
        <Divider />
        <Card.Group>
          {regulatorDetails.map((regService, i) => (
            <Card key={i}>
              <Card.Content>
                <Card.Header>{regService.name}</Card.Header>
                <Card.Meta>
                  <span className='db'>
                    <label>Admin: </label>

                    <a href='#' className='link underline-hover'>{regService.admin.slice(0, 15)}...</a>
                  </span>
                  <span className='db'>
                    <label>Contract: </label>
                    <a href='#' className='link underline-hover'>{regService.address.slice(0, 15)}...</a>
                  </span>
                </Card.Meta>
                <Card.Description>{regService.description}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button className='w-100' basic>Regulated Tokens</Button>
              </Card.Content>
            </Card>
      ))}
        </Card.Group>
      </Layout>
    )
  }
}
