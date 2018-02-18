import Link from 'next/link'
import Layout from '../src/layouts'
import withInjectedWeb3 from '../src/components/hocs/withInjectedWeb3'
import { Component } from 'react'
import Web3 from 'web3'

class RegisterInvestor extends Component {
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
              <li>Registered Address: {this.props.account}</li>
              <li>Your account has been registered with the regulation services.</li>
              <li>You are eligible to trade tokens based on your personal details and geography.</li>
            </ul>
          </div>
        </div>
      </Layout>
    )
  }
}

export default withInjectedWeb3(RegisterInvestor)
