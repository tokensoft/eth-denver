import { Component } from 'react'
import { promisify } from 'bluebird'
import Link from 'next/link'
import numeral from 'numeral'
import Container from './container'
import withInjectedWeb3 from './hocs/withInjectedWeb3'

class Header extends Component {
  render () {
    const account = this.props.account
      ? `${this.props.account.slice(0, 10)}...`
      : `No Unlocked Account`

    const balance = typeof this.props.balance === 'number'
      ? `${numeral(this.props.balance).format('0.00')} ETH`
      : 'N/A'

    return (
      <header className='pv4 z-1'>
        <Container className='flex flex-row items-center justify-between'>
          <div className='flex flex-column'>
            <Link href='/'>
              <a className='link pointer near-black hover-near-black f3 fw6 flex flex-row items-center'>
                <span>Etheregg</span>
                <img
                  className='dib h2 pl2'
                  src='/static/logo.svg'
                />
              </a>
            </Link>
            <div className='flex flex-row z-999'>
              <Link href='/regulations'><a className='link near-black underline-hover'>Regulations</a></Link>
              <span>&nbsp;|&nbsp;</span>
              <Link href='/tokens'><a className='link near-black underline-hover'>R-Tokens</a></Link>
            </div>
          </div>
          <div className='tr'>
            <div>{balance}</div>
            <div className='f7'>
              <a href='#' className='link dark-gray no-underline underline-hover'>
                {account}
              </a>
            </div>
          </div>
        </Container>
      </header>
    )
  }
}

export default withInjectedWeb3(Header)
