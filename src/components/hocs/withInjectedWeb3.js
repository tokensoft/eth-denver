import { Component } from 'react'
import { promisify } from 'bluebird'
import Web3 from 'web3'

const withInjectedWeb3 = WrappedComponent => {
  return class extends Component {
    state = {
      web3: undefined,
      account: undefined,
      balance: undefined
    }

    async componentDidMount () {
      try {
        if (typeof web3 !== 'undefined') {
          const _web3 = new Web3(web3.currentProvider)
          const [ account ] = await promisify(_web3.eth.getAccounts)()
          const balanceWei = await promisify(_web3.eth.getBalance)(account)
          const balance = _web3.fromWei(balanceWei, 'ether').toNumber()
          this.setState({
            web3: _web3,
            account,
            balance
          })
        }
      } catch (err) {
        console.log(err)
        window.alert('Please install or unlock MetaMask')
      }
    }

    render () {
      return (
        <WrappedComponent {...this.state} />
      )
    }
  }
}

export default withInjectedWeb3
