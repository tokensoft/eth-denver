import Link from 'next/link'
import { Divider, Button, Card } from 'semantic-ui-react'
import Layout from '../src/layouts'
import { Component } from 'react'
import { promisify } from 'bluebird'
import Web3 from 'web3'
import Modal from '../src/components/modal'
import SendTokensForm from '../src/components/forms/send-tokens'
const TokenRegistryDef = require('../build/contracts/TokenRegistry.json')
const ServiceRegistryDef = require('../build/contracts/ServiceRegistry.json')
const RegulatedTokenDef = require('../build/contracts/RegulatedToken.json')
const RegulatorServiceDef = require('../build/contracts/RegulatorService.json')

const delay = ms => new Promise(res => setTimeout(res, ms))

const getRegulationErrorMessage = (code) => {
  switch (code) {
    case (1): return 'Token is locked'
    case (2): return 'Token can not trade partial amounts'
    case (3): return 'Sender is not allowed to send the token'
    case (4): return 'Receiver is not allowed to receive the token'
    case (5): return 'Receiver is not allowed to receive the token due to AML/KYC'
    case (6): return 'Receiver is not allowed to receive the token due to Geography'
    default:  return 'Unknown Error'
  }
}

export default class Tokens extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tokens: [],
      regulators: [],
      showTokenModal: false,
      modalToken: undefined,
      showSuccessModal: false,
      showFailureModal: false,
      errorMessage: undefined
    }
  }

  getTokenInfo (tokenAddress) {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    let token = web3.eth.contract(RegulatedTokenDef.abi).at(tokenAddress)
    let ret = {
      address: tokenAddress,
      name: token.name(),
      symbol: token.symbol(),
      decimals: token.decimals().toNumber()
    }
    return ret
  }

  async getTokenRegistrations () {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
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

  async transferToken ({ to, from, injectedWeb3: web3, token, amount }) {
    const tokenInstance = web3.eth.contract(RegulatedTokenDef.abi).at(token.address)
    const tokenName = await promisify(tokenInstance.name)()
    const serviceRegistryAddress = await promisify(tokenInstance.registry)()
    const registryInstance = web3.eth.contract(ServiceRegistryDef.abi).at(serviceRegistryAddress)
    const regulatorServiceAddress = await promisify(registryInstance.service)()
    const regulatorServiceInstance = web3.eth.contract(RegulatorServiceDef.abi).at(regulatorServiceAddress)

    const regulationErrorBN = await promisify(regulatorServiceInstance.check.call)(
      token.address,
      from,
      from,
      to,
      amount
    )


    const regulationError = regulationErrorBN.toNumber()
    console.log({regulationError})
    if (regulationError == 0) {
      try {
        const txHash = await promisify(tokenInstance.transfer)(to, amount, { from, gas: 200000 })
        await delay(1500)
        this.openSuccessModal(token)
        console.log({ txHash })
      } catch (err) {
        console.error(err)
        this.openFailureModal(getRegulationErrorMessage())
      }
    } else {
      await delay(1000)
      this.openFailureModal(getRegulationErrorMessage(regulationError))
    }
  }

  async componentDidMount () {
    await this.getTokenRegistrations()
  }

  openTokenModal (token) {
    this.setState({
      showTokenModal: true,
      showSuccessModal: false,
      showFailureModal: false,
      modalToken: token,
      errorMessage: undefined
    })
  }

  closeTokenModal = () => {
    this.setState({
      showTokenModal: false,
      showSuccessModal: false,
      showFailureModal: false,
      modalToken: undefined,
      errorMessage: undefined
    })
  }

  openSuccessModal = (token) => {
    this.setState({
      showTokenModal: false,
      showSuccessModal: true,
      showFailureModal: false,
      modalToken: token,
      errorMessage: undefined
    })
  }

  openFailureModal = (errorMessage) => {
    this.setState({
      showTokenModal: false,
      showSuccessModal: false,
      showFailureModal: true,
      modalToken: undefined,
      errorMessage: errorMessage
    })
  }


  render () {
    const { tokens } = this.state

    let tokenDetails = []
    for (let i = 0; i < tokens.length; i++) {
      tokenDetails.push(this.getTokenInfo(tokens[i]))
    }

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
                <Card.Meta>
                  <span className='db'>
                    <label>Name: </label>
                    {token.name}
                  </span>
                </Card.Meta>
                <Card.Meta>
                  <span className='db'>
                    <label>Decimals: </label>
                    {token.decimals}
                  </span>
                </Card.Meta>

              </Card.Content>
              <Card.Content extra>
                <Button onClick={() => this.openTokenModal(token)} className='w-100' basic>Send Tokens</Button>
              </Card.Content>
            </Card>
      ))}
        </Card.Group>
        { this.state.showTokenModal &&
          <Modal onClose={this.closeTokenModal}>
            <SendTokensForm
              token={this.state.modalToken || {}}
              transferToken={this.transferToken.bind(this)}
            />
          </Modal>
        }
        { this.state.showSuccessModal &&
          <Modal onClose={this.closeTokenModal}>
            <h2 className='tc'>Send {this.state.modalToken && this.state.modalToken.symbol}</h2>
            <p>Success!</p>
          </Modal>
        }
        { this.state.showFailureModal &&
          <Modal onClose={this.closeTokenModal}>
            <h2 className='tc'>Send {this.state.modalToken && this.state.modalToken.symbol}</h2>
            <h4 className='mb0'>Failure</h4>
            <Divider />
            <p>{this.state.errorMessage}</p>
          </Modal>
        }
      </Layout>
    )
  }
}
