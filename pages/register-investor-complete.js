import Link from 'next/link'
import Layout from '../src/layouts'
import { Component } from 'react'
import Web3 from 'web3'

export default class RegisterInvestor extends Component {
  constructor (props) {
    super(props)
    this.state = {
      address: ''
    }
  }

  async componentDidMount () {
    let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    this.setState({
      address: web3.eth.coinbase
    })
  }

  render () {
    return (
      <Layout>
        <div className='absolute top-0 left-0 w-100 vh-100 flex flex-column justify-center align-center'>
          <div className='center mb4 '>
            <h1 className='tc'>Thank You for Registering</h1>
            <ul>
              <li>Registered Address: {this.state.address}</li>
              <li>Your account has been registered with the regulation services.</li>
              <li>You are eligible to trade tokens based on your personal details and geography.</li>
            </ul>
          </div>
        </div>
      </Layout>
    )
  }
}
