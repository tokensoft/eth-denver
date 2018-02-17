import Link from 'next/link'
import { Divider, Button, Card } from 'semantic-ui-react'
import Layout from '../src/layouts'
import { Component } from 'react'
import Web3 from 'web3'
const TokenRegistryDef = require('../build/contracts/TokenRegistry.json')
const RegulatedTokenDef = require('../build/contracts/RegulatedToken.json')

export default class Tokens extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokens: [],
      regulators: []
    }
  }

  getTokenInfo (tokenAddress) {
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
    const { tokens } = this.state

    let tokenDetails = []
    for (let i = 0; i < tokens.length; i++) {
      tokenDetails.push(this.getTokenInfo(tokens[i]))
    }

    // console.log(tokenDetails)

    return (
      <Layout>
        <div className='flex flex-row justify-between items-center'>
          <h2>Regulated Tokens</h2>
          <Link href='/tokens/create' className='link near-black'><a>Create New</a></Link>
        </div>
        <Divider />
        <Card.Group>
          {tokenDetails.map((token, i) => (
            <Card key={i}>
              <Card.Content>
                <Card.Header>{token.symbol}</Card.Header>
                <Card.Meta>
                  <span className='db'>
                    <label>Contract: </label>
                    <a href='#' className='link underline-hover'>{token.address.slice(0, 10)}...</a>
                  </span>
                </Card.Meta>
                <Card.Description>{token.name}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button className='w-100' basic>Regulator Service</Button>
              </Card.Content>
            </Card>
      ))}
        </Card.Group>
      </Layout>
    )
  }
}
