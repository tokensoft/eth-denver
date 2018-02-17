import Link from 'next/link'
import Container from './container'

const Header = () => (
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
        <div>12.45 ETH</div>
        <div className='f7'>
          <a href='#' className='link dark-gray no-underline underline-hover'>0xaDCf25n9...</a>
        </div>
      </div>
    </Container>
  </header>
)

export default Header
