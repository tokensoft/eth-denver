
/* global web3 */
import Layout from '../src/layouts'
import Head from '../src/components/head'
import { Component } from 'react'
import Web3 from 'web3'
const sigUtil = require('eth-sig-util')

function signMsg (msgParams, from) {
  web3.currentProvider.sendAsync({
    method: 'eth_signTypedData',
    params: [msgParams, from],
    from: from
  }, function (err, result) {
    if (err) return console.error(err)
    if (result.error) {
      return console.error(result.error.message)
    }
    const recovered = sigUtil.recoverTypedSignature({
      data: msgParams,
      sig: result.result
    })
    if (recovered === from) {
      console.log('Success')
    } else {
      console.log('Failed')
    }
  })
}

export default class Sign extends Component {
  async createContracts () {
    let web3Client = new Web3(web3.currentProvider)
    console.log(web3Client.eth.coinbase)

    const msgParams = [
      {
        type: 'string',      // Any valid solidity type
        name: 'Message',     // Any string label you want
        value: 'Please sign this message: ' + Math.floor(Math.random() * Math.floor(10000))  // The value to sign
      }]

    signMsg(msgParams, web3Client.eth.coinbase)
  }

  render () {
    return (
      <Layout>
        <Head />
        <div className='absolute top-0 left-0 w-100 vh-100 flex flex-column justify-center align-center'>
          <div className='center flex flex-column flex-row-ns align-center justify-center-ns'>
            <div className='near-black tr-ns'>
              <button onClick={this.createContracts}> Sign</button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
